# Build plan

**Current focus:** A working local diligence assistant, followed by workflow validation and multi-party controls.

## Phase 1 — Local AI vertical slice

**Status: Implemented locally**

- Upload PDF, DOCX, TXT, and Markdown files.
- Extract text and retain page or section locations.
- Generate local embeddings and index passages on the machine.
- Select documents and ask a diligence question.
- Retrieve relevant passages and generate a cited draft answer using a local model.
- Open citations to inspect the supporting passage.
- Report documents that cannot be parsed and avoid pretending scanned PDFs were indexed.

**Outcome:** One person can upload a text-based diligence packet and ask evidence-backed questions without a hosted AI account.

## Phase 2 — Validate answer usefulness

- Build a small reviewed set of realistic diligence questions and known supporting passages using synthetic or specifically authorized materials.
- Measure retrieval quality, citation correctness, unsupported claims, missing-evidence behavior, and user edit/rejection rate.
- Ask buyer-side deal leads and diligence reviewers to try the workflow and identify where it saves time or causes rework.
- Adjust chunking, retrieval ranking, prompts, and local model choice based on observed results.

**Outcome:** Decide whether the AI response quality is useful enough to connect to live diligence work. Do not treat citations as proof of correctness.

## Phase 3 — Connect answers to diligence work

- Add diligence requests, owners, deadlines, and status.
- Generate a draft response for a selected request and retain the cited passages with that draft.
- Let a reviewer edit, accept, reject, or request more evidence.
- Preserve the answer and source versions as the document index changes.

**Outcome:** The AI assistant fits a request-to-response workflow instead of acting as a standalone document chat.

## Phase 4 — Add party-aware collaboration

- Define organizations, deals, members, buyer/seller sides, roles, workstreams, and explicit sharing states.
- Add authentication and authorization at the database, file storage, and AI retrieval layers.
- Keep private party work separate from content explicitly shared across deal sides.
- Add audit events for uploads, access changes, draft reviews, and external sharing.

**Outcome:** Authorized buyer and seller users can exchange materials without exposing internal analysis or unrestricted files.

## Phase 5 — Prepare for a controlled pilot

- Review document retention, deletion, backup, audit, data residency, and AI provider requirements.
- Add OCR and spreadsheet extraction only after validating demand and acceptable source fidelity.
- Review permission boundaries and failure handling before using any live confidential deal materials.
- Run a limited pilot, collect workflow and answer-quality measures, and prioritize the next release from those results.

**Outcome:** A deliberate decision on deployment, vendors, and customer readiness based on user and security evidence.

## Current non-goals

- Hosted deployment or paid model APIs for the local AI slice
- Authentication or multi-party collaboration in the local assistant
- OCR for scanned PDFs or spreadsheet/table analysis
- Automated legal conclusions, approvals, negotiation, or external sending
- Full virtual data room replacement, e-signature, or post-merger integration management
