# Product overview

**Product name:** To be decided  
**Status:** Product direction

## What we are building

We are building an AI-enabled M&A deal workspace, starting with buyer-side diligence. The initial product helps a buyer's deal team organize diligence requests, review seller-provided documents, find evidence, and prepare accurate responses and follow-up questions. Seller participants can provide materials and respond through a controlled collaboration space.

Each deal has a secure workspace connecting documents to requests, answers, issues, owners, and deadlines. Buyer and seller participants can collaborate on explicitly shared items while keeping their internal work private. Deal teams can configure workstreams and stages to fit the transaction.

### Initial AI workflow

1. A user uploads or selects deal materials they are authorized to use.
2. The system extracts and indexes document content while retaining links to the source files and relevant passages.
3. A buyer-side user asks a diligence question or opens a request. AI finds relevant evidence in the accessible deal materials and returns a draft answer with source citations.
4. The assistant identifies when evidence is missing, ambiguous, or conflicting and suggests a follow-up question where useful.
5. A deal professional reviews and edits the answer, then chooses whether to keep it internal, assign follow-up, or explicitly share it with the seller.

AI suggestions are drafts. They are not treated as verified facts, legal conclusions, approvals, or messages to the other party until a person reviews and takes the corresponding action.

## Why we are building it

An M&A transaction brings together many people from two organizations and their advisers, working against important deadlines on sensitive information. During diligence, a team must connect a large set of documents to requests, evidence, findings, and follow-up. Those connections can be difficult to maintain when files, questions, draft changes, and decisions are spread across different systems and conversations.

We want to give deal teams a shared, dependable view of the work: what information supports an answer, what is still unknown, what needs attention, who owns the next step, and what has been agreed or resolved. AI should reduce time spent searching and assembling first drafts while keeping source evidence and human review close at hand. Bringing that context together should reduce coordination overhead and help participants move work forward with fewer missed handoffs.

The product is intended to support better organized deal execution. It does not make transaction decisions or replace the judgment of deal professionals and advisers.

## Who it helps

- **Buyer deal leads and corporate development teams** coordinating diligence, advisers, approvals, and transaction timing.
- **Seller deal leads and company teams** organizing materials and coordinating timely responses to requests.
- **Lawyers and legal teams** drafting, revising, reviewing, and tracking transaction documents and comments.
- **Finance and diligence specialists** reviewing information, answering questions, and surfacing findings in their workstreams.
- **Executives and decision makers** who need a clear view of progress, important issues, and decisions requiring attention.
- **External advisers** who need the right deal context and controlled access to assigned work.

The participants and workflow vary by transaction. Each deal should let its administrators invite the relevant people, define their roles, and control which materials and work areas they can access.

## The product experience

### One workspace for each deal

The deal overview shows the current stage, milestones, open work, documents, recent activity, and team. It gives each participant a practical starting point for understanding deal status and finding their next action.

### Documents connected to deal work

Users can upload and organize materials, keep versions together, search across the deal, and see ownership and review status. Diligence requests and answers should link to supporting documents and passages. Draft comments, flags, questions, and decisions should remain connected to the relevant document or work item.

### Clear review and handoffs

Drafts move through review, requested changes, revision, approval, and execution as appropriate. Questions and issues have an owner, status, and next step. Sharing with another party and approving a draft are explicit actions.

### Work that follows the transaction

The deal team can track configurable stages, workstreams, deadlines, and approvals from preparation through signing and closing. Important diligence findings and commitments can be carried into closing tasks and integration planning when the deal requires it.

### AI assistance with human review

The first AI capability is evidence-backed diligence assistance: find relevant passages in authorized deal documents, prepare a cited draft response to a request, and call out missing or conflicting evidence. The user can inspect the source material, edit the response, and choose what to do next. The assistant does not approve or send drafts on a user's behalf. Broader summarization, draft comparison, and drafting capabilities can follow as separate workflows.

## Product principles

- **Protect deal confidentiality:** Keep access scoped to the right deal, party, workstream, and participant.
- **Keep work traceable:** Make document versions, ownership, status changes, comments, and decisions understandable.
- **Make handoffs explicit:** Show who owns an open item and what action is expected next.
- **Support each deal's process:** Provide useful starting workflows while allowing teams to adapt stages and workstreams.
- **Keep people in control:** Show evidence and uncertainty with AI output; require human review for answers and human action for decisions or external sharing.

## Current prototype

The current prototype includes a static deal overview and a working local diligence assistant. Users can upload PDF, DOCX, TXT, and Markdown files, ask questions across selected documents, and inspect cited passages in the source. Document text, embeddings, and originals are stored locally; generation and embeddings run through Ollama on the same machine. Authentication, party-specific permissions, shared remote access, OCR, and production audit controls are not implemented.

## Initial product focus and later scope

The first target workflow is buyer-side diligence with controlled seller participation. The product should prove that deal teams can find evidence in authorized materials, prepare traceable draft answers, and route missing information to the right person. This focus provides a concrete first use for document upload, permissions, AI retrieval, citations, review, and collaboration.

The longer-term product can support more of the M&A lifecycle, including transaction-document drafting and review, signing and closing coordination, and integration handoff. Those broader workflows should not obscure the initial diligence use case.
