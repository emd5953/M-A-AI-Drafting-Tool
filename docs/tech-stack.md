# Tech stack

**Current scope:** Local evidence-backed diligence assistant  
**Runtime cost:** No hosted services or per-request AI fees

## Implemented stack

| Layer | Choice | Use |
| --- | --- | --- |
| Interface | Static HTML, CSS, and JavaScript | Existing deal overview plus the diligence assistant workbench. |
| Local API | Python 3 with FastAPI and Uvicorn | Serves the interface and handles document ingestion, search, and answer requests on localhost. |
| Local document store | SQLite plus files under ignored `data/` | Persists uploaded source documents, metadata, extracted passages, and local embeddings on this machine. |
| Document extraction | pypdf, python-docx, and Python text decoding | Extracts text from PDF, DOCX, TXT, and Markdown files. Scanned PDF OCR is not included. |
| Embeddings | Ollama `nomic-embed-text` | Embeds document passages and user questions locally. |
| Retrieval | Python cosine similarity plus keyword overlap | Selects up to five relevant indexed passages from the selected documents. |
| Answer generation | Ollama `qwen3:8b` | Drafts a response from retrieved passages with inline citations and an explicit instruction to report missing or conflicting evidence. |

The local API stores originals and extracted data in `data/`, which is excluded from Git. Ollama listens on `127.0.0.1:11434`; the app binds to `127.0.0.1:8000`.

## AI request path

1. A user uploads a PDF, DOCX, TXT, or Markdown file.
2. The API extracts text, keeps page or section locators, and splits it into overlapping passages.
3. Ollama creates and returns embeddings; SQLite stores each passage and its vector.
4. A user asks a question and selects which indexed files to search.
5. The API embeds the question, ranks passages with semantic and keyword similarity, and sends the top five to the local model.
6. The model drafts an answer using source labels such as `[S1]`. The interface links those labels to the corresponding passage and source file.

No document text leaves the machine through this flow. Source contents are treated as untrusted input, and the model cannot send, approve, or share anything.

## Local model choices

- `qwen3:8b` generates answers.
- `nomic-embed-text` creates embeddings.
- Change models through `OLLAMA_CHAT_MODEL` and `OLLAMA_EMBED_MODEL` environment variables. Changing the embedding model requires re-indexing existing documents so stored and query vectors use the same embedding space.

These models are selected to make local development possible without API charges. Their answer quality is not yet evaluated for M&A diligence. Citations help users inspect sources; they do not establish that an answer is complete or correct.

## Current boundaries

- The app is a single-machine prototype with no sign-in, deal membership, or buyer/seller permission model.
- Anyone with access to this local machine and port can access local documents through the app. Keep the service bound to localhost.
- SQLite passage retrieval is suitable for a small local corpus, not concurrent multi-party production use.
- Scanned PDFs, OCR, spreadsheet extraction, authentication, audit trails, and shared remote access are not implemented.
- The local AI workflow is not a production security or compliance architecture. Do not upload live confidential deal materials unless authorized and covered by an appropriate review.

## Future platform decisions

After the diligence workflow is validated, the team can decide which authentication, party-level access controls, shared storage, relational database, audit, and deployment services the multi-party deal product requires. Those services are outside this local AI feature slice and are not part of the working app yet.
