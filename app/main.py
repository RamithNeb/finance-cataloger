from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.store.db import init_db, search_papers, get_paper, count_papers

app = FastAPI(title="Finance AI Use Case Catalog API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"ok": True, "status": "healthy"}

@app.get("/api/papers")
def list_papers(
    q: str | None = None,
    function: str | None = None,
    technique: str | None = None,
    industry: str | None = None,
    stage: str | None = None,
    year_from: int | None = None,
    year_to: int | None = None,
    order: str = "-year",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
):
    total = count_papers(q=q, function=function, technique=technique, industry=industry,
                         stage=stage, year_from=year_from, year_to=year_to)
    papers = search_papers(q=q, function=function, technique=technique, industry=industry,
                           stage=stage, year_from=year_from, year_to=year_to,
                           order=order, page=page, limit=limit)
    total_pages = max(1, (total + limit - 1) // limit)
    return {"count": total, "page": page, "limit": limit, "total_pages": total_pages, "papers": papers}

@app.get("/api/papers/{paper_id}")
def paper_detail(paper_id: str):
    row = get_paper(paper_id)
    if not row:
        raise HTTPException(status_code=404, detail="Paper not found")
    return row

# boot
init_db()

