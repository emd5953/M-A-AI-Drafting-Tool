# Local setup

This setup runs the diligence assistant on a single machine. The app and model server bind to localhost, and uploaded files and indexes are saved under the ignored `data/` directory.

## Prerequisites

- Python 3.10 or later
- Ollama installed and able to run local models
- The `qwen3:8b` and `nomic-embed-text` models downloaded

## Install

From the repository root:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
ollama pull qwen3:8b
ollama pull nomic-embed-text
```

## Start

In one terminal, start Ollama:

```sh
ollama serve
```

In a second terminal, start the app:

```sh
.venv/bin/uvicorn local_ai_server:app --host 127.0.0.1 --port 8000
```

Open <http://127.0.0.1:8000>. Select **Open AI assistant**, upload documents, select which ones to search, and ask a diligence question. Stop each process with `Ctrl+C`.

## Models and settings

The default models are `qwen3:8b` for answer generation and `nomic-embed-text` for embeddings. Override them with `OLLAMA_CHAT_MODEL` and `OLLAMA_EMBED_MODEL` when starting Uvicorn. Re-index documents if the embedding model changes.

## Data and limitations

- Original uploads and the SQLite index are stored in `data/`; this directory is excluded from Git.
- Upload supports PDF, DOCX, TXT, and Markdown files up to 20 MB.
- Scanned PDF OCR, login, buyer/seller permission controls, and shared remote access are not implemented.
- Keep the app and Ollama bound to localhost. Do not expose them to the network or upload confidential live deal files without authorization and an appropriate review.
