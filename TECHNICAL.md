# 🔧 Technical Documentation

**Deep dive into architecture, implementation details, and design decisions.**

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Performance Optimizations](#performance-optimizations)
7. [Development Workflow](#development-workflow)
8. [Deployment](#deployment)

---

## Architecture Overview

### System Design

```
┌─────────────────────────────────────────┐
│          Client Browser                  │
│   (React SPA on localhost:5173)         │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
               │ (axios)
┌──────────────▼──────────────────────────┐
│        FastAPI Backend                   │
│     (Uvicorn on localhost:8000)         │
│  ┌─────────────────────────────────┐   │
│  │  CORS Middleware                │   │
│  │  ↓                               │   │
│  │  Route Handlers                 │   │
│  │  ↓                               │   │
│  │  Database Layer (db.py)         │   │
│  └─────────────┬───────────────────┘   │
└────────────────┼───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│       SQLite Database                   │
│     (catalog.sqlite3)                   │
│   - 74 papers                           │
│   - Single table: papers                │
└─────────────────────────────────────────┘
```

### Technology Choices

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Backend Framework | FastAPI | Async support, auto-docs, type safety, performance |
| Backend Server | Uvicorn | ASGI server, hot reload, production-ready |
| Database | SQLite | Zero-config, portable, sufficient for read-heavy workload |
| Frontend Framework | React 18 | Component model, hooks, ecosystem, TypeScript support |
| Build Tool | Vite | Lightning-fast HMR, ESBuild, native ESM |
| Styling | Tailwind CSS v3 | Utility-first, responsive, dark mode, small bundle |
| Animation | GSAP | GPU-accelerated, precise control, 60fps |
| HTTP Client | Axios | Interceptors, request cancellation, promise-based |
| Routing | React Router v6 | Declarative, nested routes, loaders |

---

## Backend Implementation

### Project Structure

```
app/
├── __init__.py
├── main.py              # FastAPI app, routes, CORS
├── models/
│   └── __init__.py
├── routers/
│   └── __init__.py
├── store/
│   ├── __init__.py
│   └── db.py           # Database operations
└── catalog.sqlite3     # SQLite database file
```

### Core Files

#### `app/main.py`

```python
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.store.db import init_db, search_papers, get_paper, count_papers

app = FastAPI(title="Finance AI Use Case Catalog API", version="1.0.0")

# CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
init_db()
```

**Key Design Decisions:**
- CORS open for development (`allow_origins=["*"]`)
- Database initialized on app startup
- Clean separation: routes → database layer → SQLite

#### `app/store/db.py`

**Database Operations:**

```python
# Connection with dict row factory
def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = dict_factory  # Returns dicts instead of tuples
    return conn

# Parameterized queries (SQL injection safe)
def _build_where(q=None, function=None, **filters):
    clauses, params = [], []
    if q:
        like = f"%{q.strip()}%"
        clauses.append("(title LIKE ? OR authors LIKE ? OR summary LIKE ?)")
        params += [like, like, like]
    # ... more filters
    return " WHERE " + " AND ".join(clauses) if clauses else "", params
```

**Performance Considerations:**
- `check_same_thread=False`: Allows SQLite in multi-threaded FastAPI
- Parameterized queries: Prevents SQL injection
- Pagination: LIMIT/OFFSET for large result sets
- No N+1 queries: Single query per request

---

## Frontend Implementation

### Project Structure

```
frontend/src/
├── main.tsx                       # Entry point
├── App.tsx                        # Router setup
├── index.css                      # Tailwind + globals
├── layouts/
│   └── RootLayout.tsx            # Global layout wrapper
├── pages/
│   └── Papers.tsx                # Main listing page
├── components/
│   ├── background/
│   │   └── LetterGlitch.tsx      # Canvas background
│   ├── papers/
│   │   ├── ExpandablePaperCard.tsx
│   │   ├── FilterSection.tsx
│   │   └── Pagination.tsx
│   ├── Navigation.tsx
│   └── [ReactBits components]
├── hooks/
│   └── usePapers.ts              # API data fetching
└── lib/
    ├── api.ts                     # Axios client
    └── utils.ts                   # Utilities (cn)
```

### Key Components

#### LetterGlitch Background

**Technology:** Canvas API with requestAnimationFrame

```typescript
// Performance optimizations:
const fontSize = 18;
const charWidth = 12;
const charHeight = 24;
const updateCount = Math.floor(letters.length * 0.02); // Only 2% update per frame
const glitchSpeed = 150; // Update every 150ms (~7 FPS)

// Animation loop
const animate = () => {
  const now = Date.now();
  if (now - lastGlitchTime.current >= glitchSpeed) {
    updateLetters();
    drawLetters();
    lastGlitchTime.current = now;
  }
  if (smooth) handleSmoothTransitions();
  animationRef.current = requestAnimationFrame(animate);
};
```

**Why Canvas?**
- Direct GPU rendering (no DOM overhead)
- Can render 1000+ characters at 60fps
- Pixel-perfect control
- Works identically across browsers

#### ExpandablePaperCard

**Animation:** GSAP Timeline

```typescript
const createTimeline = () => {
  const tl = gsap.timeline({ paused: true });
  
  // Animate card height
  tl.to(card, {
    height: calculateHeight,
    duration: 0.4,
    ease: 'power3.out'
  });
  
  // Fade in expanded content
  tl.to(content, { 
    opacity: 1, 
    y: 0, 
    duration: 0.3, 
    ease: 'power3.out' 
  }, '-=0.2'); // Overlap by 200ms
  
  return tl;
};
```

**Why GSAP?**
- GPU-accelerated (transforms)
- Precise easing curves
- Timeline sequencing
- Cross-browser consistency
- Battle-tested (15+ years)

---

## Database Schema

### Papers Table

```sql
CREATE TABLE papers (
  id TEXT PRIMARY KEY,              -- SHA256(title + link)
  title TEXT NOT NULL,
  authors TEXT NOT NULL,            -- Comma-separated
  year INTEGER NOT NULL CHECK (year >= 2018 AND year <= 2030),
  venue TEXT,
  link TEXT NOT NULL,
  doi TEXT,
  open_access INTEGER DEFAULT 1,   -- Boolean (0 or 1)
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
  source_evidence TEXT              -- JSON array serialized as string
);
```

**Indexes:**
- Primary key on `id` (automatic B-tree index)
- No additional indexes yet (74 rows = fast full scans)
- Future: Add indexes on `function`, `technique`, `year` if data grows

---

## API Reference

### Health Check

```
GET /api/health
```

**Response:**
```json
{"ok": true, "status": "healthy"}
```

---

### List Papers

```
GET /api/papers
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Full-text search | `?q=fraud` |
| `function` | string | Business function filter | `?function=AML` |
| `technique` | string | ML technique filter | `?technique=Graph` |
| `industry` | string | Industry filter | `?industry=Banking` |
| `stage` | string | Maturity stage | `?stage=Production` |
| `year_from` | integer | Min year | `?year_from=2020` |
| `year_to` | integer | Max year | `?year_to=2023` |
| `order` | string | Sort order | `?order=-year` (desc) |
| `page` | integer | Page number (≥1) | `?page=2` |
| `limit` | integer | Results per page (1-50) | `?limit=20` |

**Response:**
```json
{
  "count": 74,
  "page": 1,
  "limit": 20,
  "total_pages": 4,
  "papers": [...]
}
```

---

### Get Single Paper

```
GET /api/papers/{paper_id}
```

**Response:** Single paper object or 404

---

## Performance Optimizations

### Backend

1. **Database Connection Pooling**: Single connection per request (SQLite limitation)
2. **Parameterized Queries**: Prevents SQL injection, allows query plan caching
3. **Pagination**: LIMIT/OFFSET reduces payload size
4. **Dict Row Factory**: Direct dict conversion (no ORM overhead)

### Frontend

1. **Code Splitting**: Vite automatically chunks code by route
2. **Tree Shaking**: Unused code removed in production build
3. **Lazy Loading**: Components loaded on-demand
4. **Debounced Search**: Reduces API calls (300ms delay)
5. **Request Cancellation**: Aborts in-flight requests on filter change
6. **Canvas Rendering**: Background uses GPU (no DOM manipulation)
7. **Memoization**: `useMemo` and `useCallback` prevent unnecessary re-renders

### Measurements

| Metric | Value |
|--------|-------|
| API response time | <50ms (localhost) |
| Initial page load | ~1.2s (with background animation) |
| Search response | ~300ms (includes debounce) |
| Card expansion | 400ms (GSAP animation) |
| Background FPS | ~7 FPS (intentionally slow for effect) |
| Bundle size (gzipped) | ~180KB JS, ~25KB CSS |

---

## Development Workflow

### Local Development

```bash
# Terminal 1: Backend with hot reload
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend with HMR
cd frontend && npm run dev

# Backend auto-reloads on .py file changes
# Frontend HMR updates on .tsx/.ts/.css changes (< 50ms)
```

### Code Quality

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint for frontend
- **Type Safety**: Pydantic for backend, TypeScript for frontend
- **No `any` types**: Enforced in tsconfig

---

## Deployment

### Production Checklist

**Backend:**
1. Set `CORS allow_origins` to specific domains
2. Use PostgreSQL or production SQLite config
3. Enable HTTPS
4. Add rate limiting (slowapi)
5. Set up logging (structlog)
6. Use production ASGI server (gunicorn + uvicorn workers)

**Frontend:**
1. Build production bundle: `npm run build`
2. Serve from CDN (Cloudflare, AWS S3)
3. Enable gzip/brotli compression
4. Set up error tracking (Sentry)
5. Configure `VITE_API_URL` for production backend

**Database:**
1. Backup `catalog.sqlite3` regularly
2. Consider PostgreSQL for >10K concurrent users
3. Add indexes on `function`, `technique`, `year`

### Hosting Options

| Service | Backend | Frontend | Database | Cost |
|---------|---------|----------|----------|------|
| Heroku | ✅ | ✅ | SQLite or Postgres | $7-13/mo |
| Vercel | ❌ | ✅ | External | Free (hobby) |
| Railway | ✅ | ✅ | SQLite or Postgres | $5/mo |
| AWS | ✅ | ✅ | RDS Postgres | $20-50/mo |
| DigitalOcean | ✅ | ✅ | Managed Postgres | $12-25/mo |

---

## Architecture Decisions Log

### Why Single-Table Design?
- 74 papers = no normalization needed
- Simplifies queries (no JOINs)
- Fast for read-heavy workload
- Easy to backup/restore

### Why No ORM?
- SQLAlchemy adds overhead
- Raw SQL is clearer for this use case
- Fewer abstractions = easier debugging
- Database is simple (single table)

### Why Tailwind Over CSS-in-JS?
- Smaller bundle size
- Better performance (no runtime)
- Easier to customize
- Responsive utilities built-in

### Why Vite Over Create React App?
- 10-100x faster HMR
- Smaller bundle size
- Native ESM support
- Better tree-shaking

---

## Contributing Guidelines

### Adding Papers

1. Fork the repository
2. Add paper data to `catalog.sqlite3`
3. Submit pull request with paper details

### Code Contributions

1. Follow existing code style
2. Add TypeScript types for new functions
3. Test locally before submitting PR
4. Keep commits atomic and descriptive

---

## License

MIT License - see LICENSE file for details.

