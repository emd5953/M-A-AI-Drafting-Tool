# M&A Deal Workspace

A local prototype for an M&A deal workspace, with a working evidence-backed diligence assistant.

## Current prototype

The interface includes:

- A deal overview with enterprise value, progress, milestones, and open-item metrics
- A transaction timeline from preparation through signing and close
- A shared document list with draft statuses, search, tabs, and flagged-item filtering
- A diligence assistant that indexes local documents, answers questions with inline citations, and opens source passages for review
- Recent activity, attention items, and buyer and seller team rosters
- Invite and team-management dialogs as front-end interaction placeholders

The deal-room overview remains a UI prototype. The diligence assistant uses a local Python API, SQLite, and Ollama. It does not provide authentication, party-level access controls, remote collaboration, scanned-PDF OCR, or production security controls.

## Run locally

Install Python dependencies and the local models once:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
ollama pull qwen3:8b
ollama pull nomic-embed-text
```

Start Ollama in one terminal:

```sh
ollama serve
```

Start the app in another terminal:

```sh
.venv/bin/uvicorn local_ai_server:app --host 127.0.0.1 --port 8000
```

Open <http://127.0.0.1:8000>, then choose **Open AI assistant**. Uploaded documents and the local index live in the ignored `data/` directory.

## Project files

- `index.html` — deal workspace layout and interface content
- `styles.css` — responsive visual styling
- `app.js` — prototype interactions and in-memory document list behavior
- `local_ai_server.py` — local document parsing, indexing, retrieval, and Ollama answer API
- `ai.html`, `ai.css`, `ai.js` — diligence assistant interface
- `requirements.txt` — local Python dependencies
- `docs/` — product and workflow notes

## Documentation

- [Product overview](docs/product-overview.md) — what we're building, why, and who it helps.
- [M&A research reference](docs/research-reference.md) — process, participants, and pain point sources.
- [Tech stack](docs/tech-stack.md) — proposed architecture, infrastructure, and security model.
- [Build plan](docs/build-plan.md) — phased implementation sequence and scope boundaries.
- [Local setup](docs/local-setup.md) — run the prototype and local development stack.
