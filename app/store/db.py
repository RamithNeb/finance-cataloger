import os, sqlite3, hashlib

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "catalog.sqlite3")
DB_PATH = os.path.abspath(DB_PATH)

def dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = dict_factory
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_conn()
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS papers(
      id TEXT PRIMARY KEY,
      title TEXT,
      authors TEXT,
      year INTEGER,
      venue TEXT,
      link TEXT,
      doi TEXT,
      open_access INTEGER,
      summary TEXT,
      use_case TEXT,
      dataset TEXT,
      model TEXT,
      results TEXT,
      business_impact TEXT,
      industry TEXT,
      function TEXT,
      modality TEXT,
      technique TEXT,
      stage TEXT,
      source_evidence TEXT
    )
    """)
    conn.commit()
    conn.close()

def _build_where(q=None, function=None, technique=None, industry=None, stage=None, year_from=None, year_to=None):
    clauses, params = [], []
    if q:
        like = f"%{q.strip()}%"
        clauses.append("(title LIKE ? OR authors LIKE ? OR summary LIKE ?)")
        params += [like, like, like]
    if function:
        clauses.append("function = ?"); params.append(function)
    if technique:
        clauses.append("technique = ?"); params.append(technique)
    if industry:
        clauses.append("industry = ?"); params.append(industry)
    if stage:
        clauses.append("stage = ?"); params.append(stage)
    if year_from:
        clauses.append("year >= ?"); params.append(year_from)
    if year_to:
        clauses.append("year <= ?"); params.append(year_to)
    where = " WHERE " + " AND ".join(clauses) if clauses else ""
    return where, params

def _order_sql(order: str):
    # allow: "year", "-year", "title", "-title"
    allowed = {"year": "year", "-year": "year DESC", "title": "title", "-title": "title DESC"}
    return " ORDER BY " + allowed.get(order, "year DESC")

def count_papers(**kwargs):
    where, params = _build_where(**kwargs)
    sql = "SELECT COUNT(*) AS cnt FROM papers" + where
    conn = get_conn(); cur = conn.cursor()
    cur.execute(sql, params)
    row = cur.fetchone(); conn.close()
    return int(row["cnt"]) if row else 0

def search_papers(order="-year", page=1, limit=20, **kwargs):
    where, params = _build_where(**kwargs)
    off = (page - 1) * limit
    sql = "SELECT * FROM papers" + where + _order_sql(order) + " LIMIT ? OFFSET ?"
    conn = get_conn(); cur = conn.cursor()
    cur.execute(sql, params + [limit, off])
    rows = cur.fetchall(); conn.close()
    return rows

def get_paper(paper_id: str):
    conn = get_conn(); cur = conn.cursor()
    cur.execute("SELECT * FROM papers WHERE id = ?", [paper_id])
    row = cur.fetchone(); conn.close()
    return row

def upsert_records(records: list[dict]):
    conn = get_conn(); cur = conn.cursor()
    inserted = updated = 0
    for r in records:
        pid = r.get("id") or hashlib.sha256((r.get("link") or r.get("title","")).encode()).hexdigest()
        r["id"] = pid
        cols = ["id","title","authors","year","venue","link","doi","open_access","summary","use_case",
                "dataset","model","results","business_impact","industry","function","modality","technique","stage","source_evidence"]
        vals = [r.get(k) for k in cols]
        cur.execute("SELECT id FROM papers WHERE id=?", [pid])
        if cur.fetchone():
            set_clause = ", ".join([f"{k}=?" for k in cols[1:]])
            cur.execute(f"UPDATE papers SET {set_clause} WHERE id=?", vals[1:] + [pid]); updated += 1
        else:
            placeholders = ",".join(["?"]*len(cols))
            cur.execute(f"INSERT INTO papers({','.join(cols)}) VALUES({placeholders})", vals); inserted += 1
    conn.commit(); conn.close()
    return inserted, updated

