# AI / LLM / Agents Learning Path

> Markdown reference version, generated from `index.html`. The interactive HTML tracker is the source of truth for day-to-day use (progress tracking, checkboxes, notes); this document is for reading, printing, or reviewing offline.

## Role-based paths

| Path | Duration | Best for |
|---|---|---|
| ⭐ **Complete** | ~45–60 h | hands-on technical roles with 6–8 weeks to invest who want the full picture, start to finish. |
| 💼 **Executive** | ~12–15 h | managers and decision-makers who want to understand what AI can do, its risks, and governance — without writing code. |
| 🔧 **Builder** | ~30–35 h | engineers/analysts who already know the AI basics and want to focus on hands-on building — agents, RAG, tool use. |
| ⚖ **Governance** | ~15–18 h | risk, compliance, legal, or DPO roles focused on governance and regulation, with little interest in the technical build. |

Each path covers the four blocks — **A. Foundations**, **B. Building**, **C. Trust**, **D. Business** — fully, partially, or not at all, depending on the role. See the HTML tracker for the exact per-block breakdown.

> A banking-specific regulatory module (SR 11-7, DORA, EBA/BCE, NIST AI RMF, AEPD) is included and toggleable — relevant to banking readers, skippable for anyone else. Sections marked 🏦 below are part of that banking-specific content.

---

## Table of contents

- Accounts and prerequisites
- Minimal Python to read notebooks
- **Block A — Foundations**
  - 1. General AI concepts
  - 2. LLM fundamentals
  - 3. Prompting and context engineering
- **Block B — Building**
  - 4. RAG — Retrieval-Augmented Generation
  - 5. Agents and function calling / tool use
  - 5.3. Anti-hype exercise
  - 6. Fine-tuning and customization
- **Block C — Trust: evaluation, security and governance**
  - 7. Evaluation, safety and limitations
  - 8. Data governance, ethics and the AI Act
  - 8-bis. Model risk and banking supervision
  - Pre-production gate
- **Block D — Integration, business and capstone**
  - 9. Integrating with other systems (MCP)
  - 10. Tools and frameworks
  - 11. Business cases and real-world cost
- Capstone project
- Daily practice and gamification
- Quick glossary
- Wrapping up
- Other resources of interest

---

## Accounts and prerequisites _(Setup)_

Only resources that require signing up or setting something up are listed here. Everything else is open content — see the "Other resources of interest" section at the end.

- **[DeepLearning.AI — create an account](https://learn.deeplearning.ai)** — Free account (email or Google). Notebooks run in the browser, no install needed, with API keys already included.
- **[Anthropic Console — developer account](https://console.anthropic.com)** — Needed for the comparison exercise in topic 5.2: create your own account, with a few cents of testing cost, on at least two of Anthropic, OpenAI and Google.
- **[OpenAI Platform — developer account](https://platform.openai.com)** — One of the accounts needed for the topic 5.2 comparison.
- **[Google AI Studio (Gemini) — developer account](https://ai.google.dev/)** — Generous free tier. One of the accounts needed for the topic 5.2 comparison.

---

## Minimal Python to read notebooks _(New)_

*Duration: 5–8 h · optional*

For anyone who doesn't code fluently — without this, topics 4-7 and 9 get hard. Only start here if you need it.

**Skip test:** Can you read a for loop, a function, and a JSON without effort?

**Outcome:** You can read and edit the course notebooks without getting stuck on the code.

- **[Kaggle Learn — Python](https://www.kaggle.com/learn/python)** — Free, with a certificate, exercises in the browser.

---

## Block A — Foundations

Vocabulary, a mental model, and the basics so you don't get lost later.

### 1. General AI concepts _(AI Foundations)_

*Duration: 2–3 days*

Get the big picture before diving into LLMs: what machine learning is, types of learning, neural networks, and where LLMs fit in.

**Skip test:** Can you explain the difference between supervised and unsupervised learning, and what a neural network is?

**Outcome:** A mental map of AI (types of learning, what a neural network is, where LLMs fit in) before the technical detail of topic 2.

- **[Elements of AI](https://www.elementsofai.com/)** — University of Helsinki, free, 2018. The world's most popular intro AI course: what AI is, machine learning, neural networks, no coding required. Also available in Spanish.
- **[For non-technical/manager profiles: AI for Everyone](https://www.deeplearning.ai/courses/ai-for-everyone/)** — Andrew Ng. What AI can and can't do, in business language — a good alternative if you prefer a non-technical approach.
- **[🎥 But what is a neural network? | Deep Learning chapter 1](https://www.youtube.com/watch?v=aircAruvnKk)** — 3Blue1Brown, 2017. The most-recommended visual explanation of how a neural network works.

### 2. LLM fundamentals _(LLM Fundamentals)_

*Duration: 3–4 days*

How LLMs work under the hood before building anything — transformer architecture, attention, tokenization.

**Skip test:** Can you explain what a token is, what the context window is, and why an LLM hallucinates?

**Outcome:** You understand how an LLM predicts the next token and why that explains hallucinations, context, and cost.

- **[How Transformer LLMs Work](https://www.deeplearning.ai/courses/how-transformer-llms-work)** — Jay Alammar and Maarten Grootendorst, 2025. The transformer architecture explained visually, no advanced math needed.
- **[Building Effective Agents (reading)](https://www.anthropic.com/engineering/building-effective-agents)** — Anthropic, 2024. Lays the groundwork for how an LLM is orchestrated within a system. Reread in topic 5.0.
- **[🎥 Stanford CS229 | Building Large Language Models](https://www.youtube.com/watch?v=9vM4p9NN0Ts)** — Yann Dubois, Stanford, 2024. Pretraining and post-training (SFT/RLHF), and common data, algorithm, and evaluation practices.
- **[🎥 Transformers, the tech behind LLMs | Chapter 5](https://www.youtube.com/watch?v=wjZofJX0v4M)** — 3Blue1Brown, 2024. A visual walkthrough of the transformer architecture.

### 3. Prompting and context engineering _(Prompting)_

*Duration: 2–3 days*

Practical prompting techniques, reusable patterns, real use cases. Entry point for the Builder path.

**Skip test:** Do you already use few-shot, chain-of-thought, and structured prompts with good judgment on a daily basis?

**Outcome:** You master the core prompting patterns and know that managing context (not just the prompt) is the key skill.

- **[ChatGPT Prompt Engineering for Developers](https://www.deeplearning.ai/courses/chatgpt-prompt-eng)** — DeepLearning.AI + OpenAI, 2023. Fundamentals: principles, summarizing, inferring, transforming, expanding. Uses older models in the examples, but the principles still hold.
- **[Prompt Engineering Guide](https://www.promptingguide.ai/)** — DAIR.AI, an ongoing reference since 2022. A catalog of techniques (chain-of-thought, few-shot, ReAct…) to consult as needed.
- **[Anthropic Academy](https://www.anthropic.com/learn)** — Free, up-to-date courses on prompting and evaluation with Claude.
- **[Reading: context engineering guides](https://www.anthropic.com/engineering)** — Anthropic's engineering blog. The discipline that replaces plain "prompting" once you're working with agents.
- **[🎥 AI prompt engineering: A deep dive](https://www.youtube.com/watch?v=T9aRN5JkmL8)** — Anthropic, 2024. Anthropic's own prompt engineering team walks through what actually works in practice.

---

## Block B — Building

Hands on the keyboard: RAG, agents, and tool use. Notebooks hosted by DeepLearning.AI — nothing to install.

### 4. RAG — Retrieval-Augmented Generation _(RAG)_

*Duration: 4–5 days*

Connecting the LLM to your own data — the technical foundation before building agents that use RAG.

**Skip test:** Can you explain chunking, hybrid search, and groundedness, and have you built a RAG pipeline?

**Outcome:** You can design and evaluate a basic RAG pipeline over your own data.

- **[Retrieval Augmented Generation (RAG)](https://www.deeplearning.ai/courses/retrieval-augmented-generation)** — DeepLearning.AI, 2025, the most current: vector DBs, hybrid search, chunking, cost, and latency.
- **[Building and Evaluating Advanced RAG](https://www.deeplearning.ai/courses/building-evaluating-advanced-rag)** — With LlamaIndex, 2023. Advanced retrieval techniques and evaluation metrics (context relevance, groundedness).
- **[🎥 What is Retrieval-Augmented Generation (RAG)?](https://www.youtube.com/watch?v=T-D1OfcDW1M)** — IBM Technology, 2023. A concise explainer of the RAG framework and why it reduces hallucinations.

### 5. Agents and function calling / tool use _(Agents)_

*Duration: 1–1.5 weeks*

Build systems that act (not just respond), and understand how each provider implements tool calling.

**Skip test:** Can you explain how an LLM decides to invoke a tool, and have you built at least one agent?

**Outcome:** You've built an agent with the raw API and with frameworks, you have your own view on the providers, and you know when NOT to use an agent.

- **[5.0 · The agent by hand, first](https://www.anthropic.com/engineering/building-effective-agents)** — Before touching frameworks: reread Building Effective Agents and implement the agent + tools loop with the raw API. This is how you learn what frameworks do under the hood.
- **[Claude Cookbooks (formerly Anthropic Cookbook)](https://github.com/anthropics/claude-cookbooks)** — Practical examples with the raw API, including tool use and agent loops. The repo was renamed from "anthropic-cookbook" to "claude-cookbooks".
- **[anthropics/courses (repo)](https://github.com/anthropics/courses)** — Official Anthropic courses in notebook format, including one specifically on tool use — complements the Cookbook for the by-hand agent exercise.
- **[Agentic AI](https://www.deeplearning.ai/courses/agentic-ai)** — Andrew Ng, 2025. The most current and best-reviewed agents course in the catalog. Teaches the four patterns (reflection, tool use, planning, multi-agent collaboration) before touching any specific library.
- **[Functions, Tools and Agents with LangChain](https://www.deeplearning.ai/courses/functions-tools-agents-langchain)** — 2023. How an LLM decides to invoke tools.
- **[AI Agents in LangGraph](https://www.deeplearning.ai/courses/ai-agents-in-langgraph)** — 2024. Orchestration with state graphs.
- **[Building Agentic RAG with LlamaIndex](https://www.deeplearning.ai/courses/building-agentic-rag-with-llamaindex)** — 2024. Combines RAG (topic 4) with agentic reasoning.
- **[Optional: Multi AI Agent Systems with crewAI](https://www.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai)** — 2024. Coordination between multiple agents with specialized roles.
- **[Tool use — Anthropic (Claude)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)** — 5.2 · Hands-on comparison: implement the same agent across all three providers and compare. Anthropic version.
- **[Function calling — OpenAI (GPT)](https://platform.openai.com/docs/guides/function-calling)** — Same comparison, OpenAI version.
- **[Function calling — Google (Gemini)](https://ai.google.dev/gemini-api/docs/function-calling)** — Same comparison, Gemini version.
- **[Arena](https://arena.ai/)** — Formerly LMArena/Chatbot Arena, free, no signup, since 2023. Blind model comparison via human voting.
- **[🎥 What are AI Agents?](https://www.youtube.com/watch?v=F8NKVhkZZWI)** — IBM Technology, 2024. What makes a system "agentic" versus a plain chatbot.

### 5.3. Anti-hype exercise _(Judgment)_

*Duration: included in topic 5*

Pick 2 use cases from the bank and justify in writing whether they need an autonomous agent or whether a deterministic workflow is enough, using the criteria from Building Effective Agents.

**Outcome:** The right answer is often "you don't need an agent" — and knowing how to say that is as valuable as knowing how to build one.

### 6. Fine-tuning and customization _(Fine-tuning)_

*Duration: 3–4 days · optional*

When fine-tuning makes sense versus prompting or RAG, and how it works in practice.

**Skip test:** Is reading the course summary enough for you to decide "prompting vs. RAG vs. fine-tuning"?

**Outcome:** You know when to use fine-tuning versus prompt engineering or RAG, and what that means for cost and data.

- **[Fine-tuning & RL for LLMs: Intro to Post-training](https://www.deeplearning.ai/courses/fine-tuning-and-reinforcement-learning-for-llms-intro-to-post-training)** — Sharon Zhou, 2025, the most current: fine-tuning, RLHF, LoRA, evaluating fine-tuned models.
- **[Shorter alternative: Finetuning Large Language Models](https://www.deeplearning.ai/courses/finetuning-large-language-models)** — 2023. Basic fundamentals, a shorter course.
- **[🎥 Fine Tuning LLM Explained Simply](https://www.youtube.com/watch?v=ezdIOLbUSWg)** — codebasics, 2025. A plain-language explanation of what fine-tuning does and when to use it.

---

## Block C — Trust: evaluation, security and governance

What separates a demo from something defensible in front of Risk, the DPO, and the supervisor. This block comes before integrating anything.

### 7. Evaluation, safety and limitations _(Evaluation)_

*Duration: 3–5 days*

Hallucinations, bias, and how to measure the quality and safety of an LLM system — key before production.

**Skip test:** Do you already have your own criteria for measuring quality and risk before deploying something?

**Outcome:** Criteria for measuring quality and risk beyond "it works in the demo". You know that an agent with tools is an attack surface.

- **[Red Teaming LLM Applications](https://www.deeplearning.ai/courses/red-teaming-llm-applications)** — With Giskard, 2024. Attacking real chatbots: prompt injection, information leaks.
- **[OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)** — The reference risk catalog, including prompt injection via tools/agents.
- **[Evaluation guides on docs.claude.com](https://docs.claude.com)** — How to define success criteria, build test datasets, and use LLM-as-judge. Evals aren't a topic — they're a habit that runs through everything from topic 3 onward.
- **[🎥 Why Large Language Models Hallucinate](https://www.youtube.com/watch?v=cfqtFvWOfg0)** — IBM Technology, 2023. Why hallucinations happen and how to reduce them.

### 8. Data governance, ethics and the AI Act _(Governance)_

*Duration: 4–5 days*

The ethical, legal, and operational implications of deploying AI within an organization. Entry point for the Governance path.

**Skip test:** Do you already know the AI Act risk categories and the basic ethical principles applied to AI?

**Outcome:** You understand what it means to deploy AI responsibly and how it connects to the data governance you already know.

- **[Ethics of AI](https://ethics-of-ai.mooc.fi/)** — University of Helsinki, free, same team as Elements of AI, 2020. Ethical principles applied to AI. Also available in Spanish.
- **[AI Act — official European Commission page](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)** — Adopted 2024, continuously updated. Authoritative reference on risk categories, obligations, and timeline.
- **[Optional: AI Governance Foundations](https://ethicalogic.com/ai-course-access/)** — Ethicalogic, free, no signup. Connects the AI Act with the NIST AI RMF and ISO/IEC 42001.
- **[🎥 The EU's AI Act, Explained](https://www.youtube.com/watch?v=i5iZNH2lCGU)** — WSJ Tech News Briefing, 2023. An accessible summary of what the AI Act covers.

### 8-bis. Model risk and banking supervision _(Banking)_ 🏦

*Duration: 4–6 h*

The supervisor doesn't examine you against the AI Act in the abstract, but against the bank's model risk framework. Every agent is a "model" that needs to be inventoried, validated, and documented.

**Outcome:** You know how to map a generative AI system onto the bank's model lifecycle and anticipate what Validation, the DPO, and the supervisor will look at.

- **[Fed SR 11-7 — Guidance on Model Risk Management](https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm)** — Still the global reference for model risk management (MRM).
- **[DORA — EU Regulation 2022/2554](https://finance.ec.europa.eu/regulation-and-supervision/financial-services-legislation/implementing-and-delegated-acts/digital-operational-resilience-regulation_en)** — Your AI providers are ICT providers: registration, contracts, exit strategy, concentration risk.
- **[NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)** — Includes the specific generative AI profile.
- **[AEPD — Agentic AI from a data protection perspective](https://www.aepd.es/guias/orientaciones-ia-agentica.pdf)** _(source in ES)_ — Spain's data protection authority, guidance from February 2026 on AI agents and GDPR: what changes when a system decides and acts, not just responds. Very relevant from topic 5 onward.
- **[EBA — guidelines on ICT risk and outsourcing](https://www.eba.europa.eu/)** — Along with ECB publications on the use of AI in banking.
- **[Governing AI Agents](https://www.deeplearning.ai/short-courses/governing-ai-agents/)** — DeepLearning.AI with Databricks, taught by Amber Roberts, 2025. The most hands-on resource in this block: applies the four pillars of agent governance (lifecycle, risk, security, observability) to a real dataset in Databricks, with Unity Catalog for least-privilege access and observability. Very aligned with a Data & Analytics role.

### Pre-production gate _(🚧 Gate)_ 🏦

*Duration: before connecting any agent to real data or systems*

No agent touches real bank data without passing through here. A minimal checklist, not just another reading.

**Pre-production gate checklist:**

- [ ] OWASP LLM Top 10 read and applied to the design (especially prompt injection via tools).
- [ ] Your own evaluation set built (not just "I tried it and it works").
- [ ] AI Act classification of the use case documented.
- [ ] Data: DPIA if personal data is involved, DPA with the provider, third-party risk approval.
- [ ] Human-in-the-loop defined: what the machine decides and what a person signs off on.
- [ ] Sign-off from Model Risk, DPO, and Security.

---

## Block D — Integration, business and capstone

From notebook to enterprise architecture and business value.

### 9. Integrating with other systems (MCP) _(Integration)_

*Duration: 3–4 days*

How an AI system connects to the rest of an organization's stack — the golden rule on data applies here especially if it's against real sources.

**Skip test:** Do you know what MCP solves versus building a custom connector for every system?

**Outcome:** You understand how an AI system connects to the rest of the stack, and why a standard protocol simplifies (and concentrates) integration risk.

- **[MCP: Build Rich-Context AI Apps with Anthropic](https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic)** — DeepLearning.AI with Anthropic, 2025. The open standard for connecting LLMs to external systems without a custom connector per combination.
- **[Official MCP documentation](https://modelcontextprotocol.io/)** — Includes security best practices: permissions, isolation, trust in third-party servers.
- **[🎥 Why we built—and donated—the MCP](https://www.youtube.com/watch?v=PLyCki2K0Lg)** — Anthropic, 2025. Why the protocol exists and where it's headed.

### 10. Tools and frameworks _(Reference)_

*Duration: ongoing reference, not a block*

A cheat sheet of what's already used in topics 4, 5, 6, and 9, in one place.

- LangChain — Orchestration, used in topics 4 and 5.
- LlamaIndex — RAG-focused, used in topic 4 and in the agentic RAG of topic 5.
- crewAI — Multi-agent coordination, used in topic 5.
- **[MCP](https://modelcontextprotocol.io/)** — Integration protocol used in topic 9.
- **[API — Anthropic](https://platform.claude.com/docs)** — Direct reference to go deeper than the courses.
- **[API — OpenAI](https://platform.openai.com/docs)** — Direct reference to go deeper than the courses.
- **[API — Google Gemini](https://ai.google.dev/gemini-api/docs)** — Direct reference to go deeper than the courses.

### 11. Business cases and real-world cost _(Business)_

*Duration: 4–5 days*

From "it works in a notebook" to thinking about production systems for real Data & Analytics projects.

**Skip test:** Can you already justify model, orchestrator, cost, and latency for a real project in your organization?

**Outcome:** Architecture and business judgment: model, orchestrator, governance, cost/latency, and when to build nothing at all.

- **[Full Stack Deep Learning — LLM Bootcamp](https://fullstackdeeplearning.com/llm-bootcamp/)** — Free, 2023. System design for LLMs: expensive vs. cheap models, cost, latency, evaluation, monitoring. The design principles hold up; the specific model details don't.
- **[API latency and cost documentation](https://platform.openai.com/docs/guides/latency)** — How prompt size, tokens, and model choice affect real production cost.
- **[Modern cost: prompt caching, batch API and structured outputs](https://docs.claude.com)** — An update on the latency guide: prompt caching and batch API on docs.claude.com can cut the cost of repeated context by ~90% — more current than the 2023 latency guide.
- **[🎥 LLMOps (LLM Bootcamp)](https://www.youtube.com/watch?v=Fquj2u7ay40)** — Full Stack Deep Learning, 2023. Choosing, testing, deploying, and monitoring LLM applications in production.
- **[Sector context: AI-in-finance reports from the BIS and FSB](https://www.bis.org/)** — Free reports on AI adoption in the financial sector.

---

## Capstone project _(★ Capstone)_

*Duration: ~8–12 h · mandatory on technical paths*

Without a deliverable, the path produces certificates, not capability. The capstone assembles the pieces you already built at each checkpoint — not a new exercise from scratch.

An end-to-end banking use case with public synthetic consumer-credit data (Home Credit Default Risk dataset): a risk-analysis agent + your own eval set + AI Act classification + a one-page business case. Presented to the team (20 min). Completion criterion: capstone defended, not courses completed.

| Topic | Checkpoint artifact |
|---|---|
| 3 — Prompting | Risk-analysis prompt |
| 4 — RAG | Architecture justification (why not classic RAG) |
| 5 — Agents | Agent core (application + bureau) |
| 5.3 — Anti-hype | Design criterion (agent vs. workflow) |
| 9 — Integration/MCP | Integration (+ previous_application) |
| 7 — Evaluation | Own evaluation set + OWASP review |
| 8-bis / Gate — Banking | AI Act classification + gate checklist |
| 11 — Business | One-page business case |

**[Full capstone dataset](https://www.kaggle.com/c/home-credit-default-risk/data)**

Home Credit Default Risk (Kaggle). The first three tables are added in stages throughout the path (topics 5 and 9); installments_payments (actual payment behavior) is an optional extension for anyone going deeper on the Builder path.

Tables: application, bureau, previous_application, installments_payments (optional)

---

## Daily practice and gamification _(Block E)_

*Duration: ongoing, from week 1*

Courses give knowledge; this builds the habit. Without daily use, nothing is left after 3 months. Runs on each person's personal computer, due to corporate network restrictions.

- **AI in your real work, every week** — ~1-2 h/week during normal hours: 3 real tasks per week using the AI tool approved by the bank. Not a separate exercise — it's your usual work, with AI. Only with approved tools and no customer data in personal tools.
- **Team prompt library** — Shared repository (wiki/SharePoint) where everyone uploads prompts that work for them, organized by process. No real data in the prompts you upload.
- **Weekly challenge (30-60 min)** — A rotating mini-challenge: "automate a step of your reporting", "have the AI critique your presentation"…
- **Friday demo (15 min)** — One person shows something that worked for them (or that failed — that counts too). Feeds the "AI wins" channel with estimated time saved.

---

## Quick glossary _(Reference)_

*Duration: for non-technical profiles*

Terms that come up constantly in this path, explained in one sentence.

- **LLM** — Large language model: the engine that predicts text (Claude, GPT, Gemini).
- **Token** — The smallest unit of text the model processes (~¾ of a word). You pay per token.
- **RAG** — The model looks up your own documents before answering, instead of relying only on its memory.
- **Agent** — An LLM that decides on its own which tools to use (search, query a database, write) to achieve a goal.
- **Tool use / function calling** — The mechanism by which the model invokes external tools.
- **Orchestration** — Coordinating the steps, tools, and models of an AI system (LangGraph, etc.).
- **Fine-tuning** — Partially retraining a model on your own data. Expensive and almost never the first step.
- **Evals** — Systematic, repeatable tests of an AI system's quality. No evals, no production.
- **Prompt injection** — An attack that sneaks malicious instructions into the text the model reads — critical if the agent has tools.
- **MCP** — A standard protocol for connecting models to external systems (databases, APIs, applications).
- **Vector DB / chunking** — How documents are split (chunking) and indexed so RAG can find what's relevant.
- **Prompt caching** — Reusing repeated context across calls to pay up to ~90% less for it.

---

## Wrapping up _(Wrap-up)_

You've gone from AI and LLM fundamentals, through prompting, RAG, and agent-building with real frameworks, to the harder architectural questions: when to fine-tune, how to evaluate and secure a system, how to handle governance and regulation, and how to integrate AI into the rest of the stack — all while building the same credit-risk-analysis agent from start to finish, not with disconnected toy examples.

To keep this picture current, subscribe to The Batch, DeepLearning.AI's weekly newsletter.

- **[The Batch — subscribe to the newsletter](https://www.deeplearning.ai/the-batch/)** — DeepLearning.AI's free weekly newsletter. Summarizes what matters without the noise.

---

## Other resources of interest _(Reference)_

*Duration: no account needed*

Everything below is freely accessible, no account or setup needed — keep it as reference, not as a checklist.

- **[Elements of AI (topic 1, 2018)](https://www.elementsofai.com/)** — Free account only needed if you want to track progress or get a certificate.
- **[Anthropic — Building Effective Agents (topic 2, 2024)](https://www.anthropic.com/engineering/building-effective-agents)** — Open-access article, no signup.
- **[Prompt Engineering Guide (topic 3)](https://www.promptingguide.ai/)** — DAIR.AI reference catalog, no signup.
- **[Arena (topic 5)](https://arena.ai/)** — No account, no cost.
- **[Official MCP documentation (topic 9)](https://modelcontextprotocol.io/)** — Conceptual reference, no signup.
- **[Ethics of AI (topic 8, 2020)](https://ethics-of-ai.mooc.fi/)** — Free account only needed for a certificate.
- **[AI Act — official European Commission page](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)** — Open content, continuously updated.
- **[AI Governance Foundations, Ethicalogic (topic 8)](https://ethicalogic.com/ai-course-access/)** — Free, no signup.
- **[API documentation — Anthropic (reading)](https://platform.claude.com/docs)** — No account needed to read; an account is only needed for the topic 5 exercise.
- **[API documentation — OpenAI (reading)](https://platform.openai.com/docs)** — No account needed to read.
- **[API documentation — Google Gemini (reading)](https://ai.google.dev/gemini-api/docs)** — No account needed to read.
- **[The Batch, DeepLearning.AI's newsletter](https://www.deeplearning.ai/the-batch/)** — Free, summarizes what matters without the noise.
- **[Kaggle — Home Credit Default Risk (capstone dataset)](https://www.kaggle.com/c/home-credit-default-risk/data)** — Public dataset used as the base of this path's capstone project.

---
