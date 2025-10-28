# 💼 Finance AI Use Case Catalog

**A searchable database of real-world AI/ML applications in financial services, sourced from academic research.**

Stop wondering if AI works in finance. This catalog proves it does—with evidence.

![Finance AI Catalog](https://img.shields.io/badge/Papers-74-gold) ![Tech Stack](https://img.shields.io/badge/Stack-FastAPI%20%2B%20React-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## What This Is

A full-stack web application that catalogs **74 verified AI/ML use cases** in finance, each backed by academic papers. Search and filter by:

- **Business Function**: AML, fraud detection, credit risk, trading, compliance
- **ML Technique**: Transformers, graph neural networks, XGBoost, LSTMs
- **Industry**: Banking, insurance, fintech, asset management
- **Maturity Stage**: Research, pilot, production
- **Publication Year**: 2018-2025

Each entry includes the paper title, authors, summary, dataset used, model architecture, results, and business impact.

---

## Why This Exists

Financial institutions spend millions on AI/ML projects without knowing what actually works. This catalog provides:

- ✅ **Evidence-based decisions**: Every use case links to peer-reviewed research
- ✅ **Implementation guidance**: See what datasets, models, and techniques succeed
- ✅ **Competitive intelligence**: Understand what others are building
- ✅ **Education resource**: Learn AI/ML applications through real examples

---

## Tech Stack

**Backend:**
- FastAPI (Python) - REST API
- SQLite - Database (74 papers)
- Uvicorn - ASGI server

**Frontend:**
- React 18 + TypeScript
- Vite - Build tool
- Tailwind CSS - Styling
- GSAP - Animations
- Custom Canvas - Animated background

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/finance-cataloger.git
cd finance-cataloger

# Backend setup
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
cd ..
```

### Running the Application

**Terminal 1 - Backend:**
```bash
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Usage

### Search & Filter
- **Full-text search**: Search across titles, authors, and summaries
- **Multi-filter**: Combine function, technique, industry, stage, and year filters
- **Pagination**: Browse 20 papers per page

### View Paper Details
- **Click any card** to expand and see full details
- **View Paper button** opens the original research paper
- **Tags** show classification (always visible)

### API Access

The backend exposes a REST API:

```bash
# Health check
GET http://localhost:8000/api/health

# List papers with filters
GET http://localhost:8000/api/papers?function=Fraud&technique=Graph&page=1

# Get single paper
GET http://localhost:8000/api/papers/{paper_id}
```

Full API documentation: **http://localhost:8000/docs** (when backend is running)

---

## Project Structure

```
finance-cataloger/
├── app/                    # FastAPI backend
│   ├── main.py            # API routes
│   ├── store/db.py        # Database operations
│   └── catalog.sqlite3    # Database (74 papers)
├── frontend/              # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # API client & utilities
│   └── public/            # Static assets
└── requirements.txt       # Python dependencies
```

---

## Features

- 🔍 **Full-text search** across 74 papers
- 🎯 **Multi-dimensional filtering** (function, technique, industry, stage, year)
- 📊 **Pagination** with 20 results per page
- 🎨 **Animated UI** with smooth card expansions and glow effects
- 📱 **Responsive design** (mobile, tablet, desktop)
- ⚡ **Real-time updates** with debounced search
- 🎭 **Dynamic background** with animated text effects
- 🔗 **Direct links** to original research papers

---

## Documentation

- **[GETTING-STARTED.md](./GETTING-STARTED.md)** - Beginner-friendly setup guide
- **[TECHNICAL.md](./TECHNICAL.md)** - Deep technical documentation for developers

---

## Contributing

Contributions welcome! To add papers to the catalog:

1. Papers must be from peer-reviewed sources or reputable preprint servers (arXiv, SSRN)
2. Must describe a concrete AI/ML application in finance
3. Should include dataset, model, and results information

Submit via pull request with paper details in the format used in `catalog.sqlite3`.

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

## Data Disclaimer

This catalog is for educational and research purposes. Paper summaries and classifications are interpretations and may not reflect the authors' intentions. Always refer to the original papers for authoritative information.

---

## Contact

Questions or suggestions? Open an issue or reach out via GitHub.

---

**Built with ❤️ for the fintech community**

