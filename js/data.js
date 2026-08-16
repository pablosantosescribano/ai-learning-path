/* ============ ROUTE DEFINITIONS ============ */
const ROUTES = {
  complete:   {name:'Complete',   hours:'~45–60 h', color:'var(--teal)',   emoji:'⭐', blocks:{A:'full',B:'full',C:'full',D:'full'}, bestFor:'Best for: hands-on technical roles with 6–8 weeks to invest who want the full picture, start to finish.'},
  executive:  {name:'Executive',  hours:'~12–15 h', color:'var(--amber)',  emoji:'💼', blocks:{A:'full',B:'partial',C:'full',D:'full'}, bestFor:'Best for: managers and decision-makers who want to understand what AI can do, its risks, and governance — without writing code.'},
  builder:    {name:'Builder',hours:'~30–35 h', color:'var(--violet)',emoji:'🔧', blocks:{A:'full',B:'full',C:'partial',D:'none'}, bestFor:'Best for: engineers/analysts who already know the AI basics and want to focus on hands-on building — agents, RAG, tool use.'},
  governance: {name:'Governance', hours:'~15–18 h', color:'var(--sage)',  emoji:'⚖',  blocks:{A:'none',B:'none',C:'full',D:'partial'}, bestFor:'Best for: risk, compliance, legal, or DPO roles focused on governance and regulation, with little interest in the technical build.'}
};

/* ============ DATA ============ */
const ALL3 = ['mobile','tablet','desktop'];
const DESKTOP_ONLY = ['desktop'];

/* route status per block letter is defined in ROUTES; modules reference their block.
   governance/builder etc. collapse (dim) modules whose block is 'none' for the selected route. */

const MODULES = [
  {
    id:'m0', block:null, num:null, tag:'Setup', title:'Accounts and prerequisites', notesOn:false,
    duration:null,
    objective:'Only resources that require signing up or setting something up are listed here. Everything else is open content — see the "Other resources of interest" section at the end.',
    resources:[
      {id:'r0-1', title:'DeepLearning.AI — create an account', url:'https://learn.deeplearning.ai', desc:'Free account (email or Google). Notebooks run in the browser, no install needed, with API keys already included.', devices:ALL3, lang:'EN'},
      {id:'r0-2', title:'Anthropic Console — developer account', url:'https://console.anthropic.com', desc:'Needed for the comparison exercise in topic 5.2: create your own account, with a few cents of testing cost, on at least two of Anthropic, OpenAI and Google.', devices:ALL3, lang:'EN'},
      {id:'r0-3', title:'OpenAI Platform — developer account', url:'https://platform.openai.com', desc:'One of the accounts needed for the topic 5.2 comparison.', devices:ALL3, lang:'EN'},
      {id:'r0-4', title:'Google AI Studio (Gemini) — developer account', url:'https://ai.google.dev/', desc:'Generous free tier. One of the accounts needed for the topic 5.2 comparison.', devices:ALL3, lang:'EN'}
    ]
  },
  {
    id:'m0-1', block:null, num:null, tag:'New', title:'Minimal Python to read notebooks', notesOn:false, optionalTag:'optional',
    duration:'5–8 h · optional',
    objective:'For anyone who doesn\'t code fluently — without this, topics 4-7 and 9 get hard. Only start here if you need it.',
    skipTest:'Can you read a for loop, a function, and a JSON without effort?',
    result:'You can read and edit the course notebooks without getting stuck on the code.',
    resources:[
      {id:'r0b-1', title:'Kaggle Learn — Python', url:'https://www.kaggle.com/learn/python', desc:'Free, with a certificate, exercises in the browser.', devices:ALL3, lang:'EN'}
    ]
  },

  {
    id:'mA', type:'group', block:'A', num:null, tag:'Block A', title:'Foundations',
    objective:'Vocabulary, a mental model, and the basics so you don\'t get lost later.',
    children:[
    {
      id:'m1', block:'A', num:1, tag:'AI Foundations', title:'General AI concepts', notesOn:true,
      duration:'2–3 days',
      objective:'Get the big picture before diving into LLMs: what machine learning is, types of learning, neural networks, and where LLMs fit in.',
      skipTest:'Can you explain the difference between supervised and unsupervised learning, and what a neural network is?',
      result:'A mental map of AI (types of learning, what a neural network is, where LLMs fit in) before the technical detail of topic 2.',
      resources:[
        {id:'r1-1', title:'Elements of AI', url:'https://www.elementsofai.com/', desc:'University of Helsinki, free, 2018. The world\'s most popular intro AI course: what AI is, machine learning, neural networks, no coding required. Also available in Spanish.', devices:ALL3, lang:'EN'},
        {id:'r1-2', title:'For non-technical/manager profiles: AI for Everyone', url:'https://www.deeplearning.ai/courses/ai-for-everyone/', desc:'Andrew Ng. What AI can and can\'t do, in business language — a good alternative if you prefer a non-technical approach.', devices:ALL3, lang:'EN'},
        {id:'r1-3', title:'🎥 But what is a neural network? | Deep Learning chapter 1', url:'https://www.youtube.com/watch?v=aircAruvnKk', desc:'3Blue1Brown, 2017. The most-recommended visual explanation of how a neural network works.', devices:ALL3, lang:'EN'}
      ]
    },
    {
      id:'m2', block:'A', num:2, tag:'LLM Fundamentals', title:'LLM fundamentals', notesOn:true,
      duration:'3–4 days',
      objective:'How LLMs work under the hood before building anything — transformer architecture, attention, tokenization.',
      skipTest:'Can you explain what a token is, what the context window is, and why an LLM hallucinates?',
      result:'You understand how an LLM predicts the next token and why that explains hallucinations, context, and cost.',
      resources:[
        {id:'r2-1', title:'How Transformer LLMs Work', url:'https://www.deeplearning.ai/courses/how-transformer-llms-work', desc:'Jay Alammar and Maarten Grootendorst, 2025. The transformer architecture explained visually, no advanced math needed.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r2-2', title:'Building Effective Agents (reading)', url:'https://www.anthropic.com/engineering/building-effective-agents', desc:'Anthropic, 2024. Lays the groundwork for how an LLM is orchestrated within a system. Reread in topic 5.0.', devices:ALL3, lang:'EN'},
        {id:'r2-3', title:'🎥 Stanford CS229 | Building Large Language Models', url:'https://www.youtube.com/watch?v=9vM4p9NN0Ts', desc:'Yann Dubois, Stanford, 2024. Pretraining and post-training (SFT/RLHF), and common data, algorithm, and evaluation practices.', devices:ALL3, lang:'EN'},
        {id:'r2-4', title:'🎥 Transformers, the tech behind LLMs | Chapter 5', url:'https://www.youtube.com/watch?v=wjZofJX0v4M', desc:'3Blue1Brown, 2024. A visual walkthrough of the transformer architecture.', devices:ALL3, lang:'EN'}
      ]
    },
    {
      id:'m3', block:'A', num:3, tag:'Prompting', title:'Prompting and context engineering', notesOn:true,
      duration:'2–3 days',
      objective:'Practical prompting techniques, reusable patterns, real use cases. Entry point for the Builder path.',
      skipTest:'Do you already use few-shot, chain-of-thought, and structured prompts with good judgment on a daily basis?',
      result:'You master the core prompting patterns and know that managing context (not just the prompt) is the key skill.',
      resources:[
        {id:'r3-1', title:'ChatGPT Prompt Engineering for Developers', url:'https://www.deeplearning.ai/courses/chatgpt-prompt-eng', desc:'DeepLearning.AI + OpenAI, 2023. Fundamentals: principles, summarizing, inferring, transforming, expanding. Uses older models in the examples, but the principles still hold.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r3-2', title:'Prompt Engineering Guide', url:'https://www.promptingguide.ai/', desc:'DAIR.AI, an ongoing reference since 2022. A catalog of techniques (chain-of-thought, few-shot, ReAct…) to consult as needed.', devices:ALL3, lang:'EN'},
        {id:'r3-3', title:'Anthropic Academy', url:'https://www.anthropic.com/learn', desc:'Free, up-to-date courses on prompting and evaluation with Claude.', devices:ALL3, lang:'EN'},
        {id:'r3-4', title:'Reading: context engineering guides', url:'https://www.anthropic.com/engineering', desc:'Anthropic\'s engineering blog. The discipline that replaces plain "prompting" once you\'re working with agents.', devices:ALL3, lang:'EN'},
        {id:'r3-5', title:'🎥 AI prompt engineering: A deep dive', url:'https://www.youtube.com/watch?v=T9aRN5JkmL8', desc:'Anthropic, 2024. Anthropic\'s own prompt engineering team walks through what actually works in practice.', devices:ALL3, lang:'EN'}
      ],
      checkpoint:{
        title:'Design the risk-analysis prompt',
        text:'Take a realistic excerpt from a consumer credit file and, using just a chat interface (no code), write and iterate on a prompt that turns the data into a readable summary: what risk signals stand out, what\'s missing, what you\'d recommend reviewing. This piece is reused as-is in the topic 5 agent and in the capstone.',
        piece:'Capstone piece → "Production prompt"'
      }
    }
    ]
  },

  {
    id:'mB', type:'group', block:'B', num:null, tag:'Block B', title:'Building',
    objective:'Hands on the keyboard: RAG, agents, and tool use. Notebooks hosted by DeepLearning.AI — nothing to install.',
    children:[
    {
      id:'m4', block:'B', num:4, tag:'RAG', title:'RAG — Retrieval-Augmented Generation', notesOn:true,
      duration:'4–5 days',
      objective:'Connecting the LLM to your own data — the technical foundation before building agents that use RAG.',
      skipTest:'Can you explain chunking, hybrid search, and groundedness, and have you built a RAG pipeline?',
      result:'You can design and evaluate a basic RAG pipeline over your own data.',
      resources:[
        {id:'r4-1', title:'Retrieval Augmented Generation (RAG)', url:'https://www.deeplearning.ai/courses/retrieval-augmented-generation', desc:'DeepLearning.AI, 2025, the most current: vector DBs, hybrid search, chunking, cost, and latency.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r4-2', title:'Building and Evaluating Advanced RAG', url:'https://www.deeplearning.ai/courses/building-evaluating-advanced-rag', desc:'With LlamaIndex, 2023. Advanced retrieval techniques and evaluation metrics (context relevance, groundedness).', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r4-3', title:'🎥 What is Retrieval-Augmented Generation (RAG)?', url:'https://www.youtube.com/watch?v=T-D1OfcDW1M', desc:'IBM Technology, 2023. A concise explainer of the RAG framework and why it reduces hallucinations.', devices:ALL3, lang:'EN'}
      ],
      checkpoint:{
        title:'Decide whether RAG applies to the credit data',
        text:'The capstone data (consumer credit files, Home Credit dataset) is structured — rows and columns across related tables — not free text. Use this topic to understand why classic embedding-based RAG isn\'t the right tool here, and document the decision: the right pattern is "give the agent tools that query and combine tables", not "embed and retrieve chunks".',
        piece:'Capstone piece → "Architecture justification"'
      }
    },
    {
      id:'m5', block:'B', num:5, tag:'Agents', title:'Agents and function calling / tool use', notesOn:true,
      duration:'1–1.5 weeks',
      objective:'Build systems that act (not just respond), and understand how each provider implements tool calling.',
      skipTest:'Can you explain how an LLM decides to invoke a tool, and have you built at least one agent?',
      result:'You\'ve built an agent with the raw API and with frameworks, you have your own view on the providers, and you know when NOT to use an agent.',
      resources:[
        {id:'r5-0', title:'5.0 · The agent by hand, first', url:'https://www.anthropic.com/engineering/building-effective-agents', desc:'Before touching frameworks: reread Building Effective Agents and implement the agent + tools loop with the raw API. This is how you learn what frameworks do under the hood.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r5-0b', title:'Claude Cookbooks (formerly Anthropic Cookbook)', url:'https://github.com/anthropics/claude-cookbooks', desc:'Practical examples with the raw API, including tool use and agent loops. The repo was renamed from "anthropic-cookbook" to "claude-cookbooks".', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r5-0c', title:'anthropics/courses (repo)', url:'https://github.com/anthropics/courses', desc:'Official Anthropic courses in notebook format, including one specifically on tool use — complements the Cookbook for the by-hand agent exercise.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r5-1', title:'Agentic AI', url:'https://www.deeplearning.ai/courses/agentic-ai', desc:'Andrew Ng, 2025. The most current and best-reviewed agents course in the catalog. Teaches the four patterns (reflection, tool use, planning, multi-agent collaboration) before touching any specific library.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r5-2', title:'Functions, Tools and Agents with LangChain', url:'https://www.deeplearning.ai/courses/functions-tools-agents-langchain', desc:'2023. How an LLM decides to invoke tools.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r5-3', title:'AI Agents in LangGraph', url:'https://www.deeplearning.ai/courses/ai-agents-in-langgraph', desc:'2024. Orchestration with state graphs.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r5-4', title:'Building Agentic RAG with LlamaIndex', url:'https://www.deeplearning.ai/courses/building-agentic-rag-with-llamaindex', desc:'2024. Combines RAG (topic 4) with agentic reasoning.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r5-5', title:'Optional: Multi AI Agent Systems with crewAI', url:'https://www.deeplearning.ai/courses/multi-ai-agent-systems-with-crewai', desc:'2024. Coordination between multiple agents with specialized roles.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r5-6', title:'Tool use — Anthropic (Claude)', url:'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview', desc:'5.2 · Hands-on comparison: implement the same agent across all three providers and compare. Anthropic version.', devices:ALL3, lang:'EN'},
        {id:'r5-7', title:'Function calling — OpenAI (GPT)', url:'https://platform.openai.com/docs/guides/function-calling', desc:'Same comparison, OpenAI version.', devices:ALL3, lang:'EN'},
        {id:'r5-8', title:'Function calling — Google (Gemini)', url:'https://ai.google.dev/gemini-api/docs/function-calling', desc:'Same comparison, Gemini version.', devices:ALL3, lang:'EN'},
        {id:'r5-9', title:'Arena', url:'https://arena.ai/', desc:'Formerly LMArena/Chatbot Arena, free, no signup, since 2023. Blind model comparison via human voting.', devices:ALL3, lang:'EN'},
        {id:'r5-10', title:'🎥 What are AI Agents?', url:'https://www.youtube.com/watch?v=F8NKVhkZZWI', desc:'IBM Technology, 2024. What makes a system "agentic" versus a plain chatbot.', devices:ALL3, lang:'EN'}
      ],
      checkpoint:{
        title:'Build the first risk-analysis agent',
        text:'Using the patterns from Agentic AI (or LangChain, if you want to go framework-first), build an agent with one tool: read an excerpt of the application + bureau tables from the Home Credit dataset, compute risk signals with pandas, and pass the result to the topic 3 prompt. This is the core of the capstone — everything after this is an upgrade.',
        piece:'Capstone piece → "Agent core"'
      },
      dataset:{
        title:'Capstone dataset — first delivery',
        tables:['application', 'bureau'],
        text:'From this topic on, the project uses the public Home Credit Default Risk dataset (Kaggle), reduced to two tables: application (application data) and bureau (history with other institutions). Enough for a realistic first agent without the overhead of the original dataset\'s seven full tables.',
        url:'https://www.kaggle.com/c/home-credit-default-risk/data'
      }
    },
    {
      id:'m5-3', block:'B', num:'5.3', tag:'Judgment', title:'Anti-hype exercise', notesOn:true, isSubExercise:true,
      duration:'included in topic 5',
      objective:'Pick 2 use cases from the bank and justify in writing whether they need an autonomous agent or whether a deterministic workflow is enough, using the criteria from Building Effective Agents.',
      result:'The right answer is often "you don\'t need an agent" — and knowing how to say that is as valuable as knowing how to build one.',
      resources:[],
      checkpoint:{
        title:'Agent vs. workflow',
        text:'Document the justification for your 2 chosen cases. This piece is reused in the capstone as an explicit design criterion.',
        piece:'Capstone piece → "Design criterion"'
      }
    },
    {
      id:'m6', block:'B', num:6, tag:'Fine-tuning', title:'Fine-tuning and customization', notesOn:true, optionalTag:'optional',
      duration:'3–4 days · optional',
      objective:'When fine-tuning makes sense versus prompting or RAG, and how it works in practice.',
      skipTest:'Is reading the course summary enough for you to decide "prompting vs. RAG vs. fine-tuning"?',
      result:'You know when to use fine-tuning versus prompt engineering or RAG, and what that means for cost and data.',
      resources:[
        {id:'r6-1', title:'Fine-tuning & RL for LLMs: Intro to Post-training', url:'https://www.deeplearning.ai/courses/fine-tuning-and-reinforcement-learning-for-llms-intro-to-post-training', desc:'Sharon Zhou, 2025, the most current: fine-tuning, RLHF, LoRA, evaluating fine-tuned models.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r6-2', title:'Shorter alternative: Finetuning Large Language Models', url:'https://www.deeplearning.ai/courses/finetuning-large-language-models', desc:'2023. Basic fundamentals, a shorter course.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r6-3', title:'🎥 Fine Tuning LLM Explained Simply', url:'https://www.youtube.com/watch?v=ezdIOLbUSWg', desc:'codebasics, 2025. A plain-language explanation of what fine-tuning does and when to use it.', devices:ALL3, lang:'EN'}
      ],
      noCheckpointNote:'No project checkpoint here — the risk agent is a good example of a case that does NOT need fine-tuning: good prompting + tool use already solves it. Honest note: in 2026 fine-tuning is rarely done before mastering prompting, RAG, and evals.'
    }
    ]
  },

  {
    id:'mC', type:'group', block:'C', num:null, tag:'Block C', title:'Trust: evaluation, security and governance',
    objective:'What separates a demo from something defensible in front of Risk, the DPO, and the supervisor. This block comes before integrating anything.',
    children:[
    {
      id:'m7', block:'C', num:7, tag:'Evaluation', title:'Evaluation, safety and limitations', notesOn:true,
      duration:'3–5 days',
      objective:'Hallucinations, bias, and how to measure the quality and safety of an LLM system — key before production.',
      skipTest:'Do you already have your own criteria for measuring quality and risk before deploying something?',
      result:'Criteria for measuring quality and risk beyond "it works in the demo". You know that an agent with tools is an attack surface.',
      resources:[
        {id:'r7-1', title:'Red Teaming LLM Applications', url:'https://www.deeplearning.ai/courses/red-teaming-llm-applications', desc:'With Giskard, 2024. Attacking real chatbots: prompt injection, information leaks.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r7-2', title:'OWASP Top 10 for LLM Applications', url:'https://owasp.org/www-project-top-10-for-large-language-model-applications/', desc:'The reference risk catalog, including prompt injection via tools/agents.', devices:ALL3, lang:'EN'},
        {id:'r7-3', title:'Evaluation guides on docs.claude.com', url:'https://docs.claude.com', desc:'How to define success criteria, build test datasets, and use LLM-as-judge. Evals aren\'t a topic — they\'re a habit that runs through everything from topic 3 onward.', devices:ALL3, lang:'EN'},
        {id:'r7-4', title:'🎥 Why Large Language Models Hallucinate', url:'https://www.youtube.com/watch?v=cfqtFvWOfg0', desc:'IBM Technology, 2023. Why hallucinations happen and how to reduce them.', devices:ALL3, lang:'EN'}
      ],
      checkpoint:{
        title:'Build a mini evaluation set',
        text:'Pick 5-10 known facts from a real record in the dataset (e.g. "declared income = X") and check that the agent gets them right. Then try to trick it: ask for a variable that isn\'t in the data and see whether it makes one up instead of saying it\'s missing. Also review the agent\'s design against the OWASP LLM Top 10.',
        piece:'Capstone piece → "Evaluation set"'
      }
    },
    {
      id:'m8', block:'C', num:8, tag:'Governance', title:'Data governance, ethics and the AI Act', notesOn:true,
      duration:'4–5 days',
      objective:'The ethical, legal, and operational implications of deploying AI within an organization. Entry point for the Governance path.',
      skipTest:'Do you already know the AI Act risk categories and the basic ethical principles applied to AI?',
      result:'You understand what it means to deploy AI responsibly and how it connects to the data governance you already know.',
      resources:[
        {id:'r8-1', title:'Ethics of AI', url:'https://ethics-of-ai.mooc.fi/', desc:'University of Helsinki, free, same team as Elements of AI, 2020. Ethical principles applied to AI. Also available in Spanish.', devices:ALL3, lang:'EN'},
        {id:'r8-2', title:'AI Act — official European Commission page', url:'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai', desc:'Adopted 2024, continuously updated. Authoritative reference on risk categories, obligations, and timeline.', devices:ALL3, lang:'EN'},
        {id:'r8-3', title:'Optional: AI Governance Foundations', url:'https://ethicalogic.com/ai-course-access/', desc:'Ethicalogic, free, no signup. Connects the AI Act with the NIST AI RMF and ISO/IEC 42001.', devices:ALL3, lang:'EN'},
        {id:'r8-4', title:'🎥 The EU\'s AI Act, Explained', url:'https://www.youtube.com/watch?v=i5iZNH2lCGU', desc:'WSJ Tech News Briefing, 2023. An accessible summary of what the AI Act covers.', devices:ALL3, lang:'EN'}
      ]
    },
    {
      id:'m8b', block:'C', num:'8-bis', tag:'Banking', title:'Model risk and banking supervision', notesOn:true, bank:true,
      duration:'4–6 h',
      objective:'The supervisor doesn\'t examine you against the AI Act in the abstract, but against the bank\'s model risk framework. Every agent is a "model" that needs to be inventoried, validated, and documented.',
      result:'You know how to map a generative AI system onto the bank\'s model lifecycle and anticipate what Validation, the DPO, and the supervisor will look at.',
      resources:[
        {id:'r8b-1', title:'Fed SR 11-7 — Guidance on Model Risk Management', url:'https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm', desc:'Still the global reference for model risk management (MRM).', devices:ALL3, lang:'EN'},
        {id:'r8b-2', title:'DORA — EU Regulation 2022/2554', url:'https://finance.ec.europa.eu/regulation-and-supervision/financial-services-legislation/implementing-and-delegated-acts/digital-operational-resilience-regulation_en', desc:'Your AI providers are ICT providers: registration, contracts, exit strategy, concentration risk.', devices:ALL3, lang:'EN'},
        {id:'r8b-3', title:'NIST AI Risk Management Framework', url:'https://www.nist.gov/itl/ai-risk-management-framework', desc:'Includes the specific generative AI profile.', devices:ALL3, lang:'EN'},
        {id:'r8b-4', title:'AEPD — Agentic AI from a data protection perspective', url:'https://www.aepd.es/guias/orientaciones-ia-agentica.pdf', desc:'Spain\'s data protection authority, guidance from February 2026 on AI agents and GDPR: what changes when a system decides and acts, not just responds. Very relevant from topic 5 onward.', devices:ALL3, lang:'ES'},
        {id:'r8b-5', title:'EBA — guidelines on ICT risk and outsourcing', url:'https://www.eba.europa.eu/', desc:'Along with ECB publications on the use of AI in banking.', devices:ALL3, lang:'EN'},
        {id:'r8b-6', title:'Governing AI Agents', url:'https://www.deeplearning.ai/short-courses/governing-ai-agents/', desc:'DeepLearning.AI with Databricks, taught by Amber Roberts, 2025. The most hands-on resource in this block: applies the four pillars of agent governance (lifecycle, risk, security, observability) to a real dataset in Databricks, with Unity Catalog for least-privilege access and observability. Very aligned with a Data & Analytics role.', devices:DESKTOP_ONLY, lang:'EN'}
      ]
    },
    {
      id:'mgate', block:'C', num:null, tag:'🚧 Gate', title:'Pre-production gate', notesOn:false, bank:true, isGate:true,
      duration:'before connecting any agent to real data or systems',
      objective:'No agent touches real bank data without passing through here. A minimal checklist, not just another reading.',
      resources:[],
      checklist:[
        {id:'g1', text:'OWASP LLM Top 10 read and applied to the design (especially prompt injection via tools).'},
        {id:'g2', text:'Your own evaluation set built (not just "I tried it and it works").'},
        {id:'g3', text:'AI Act classification of the use case documented.'},
        {id:'g4', text:'Data: DPIA if personal data is involved, DPA with the provider, third-party risk approval.'},
        {id:'g5', text:'Human-in-the-loop defined: what the machine decides and what a person signs off on.'},
        {id:'g6', text:'Sign-off from Model Risk, DPO, and Security.'}
      ]
    }
    ]
  },

  {
    id:'mD', type:'group', block:'D', num:null, tag:'Block D', title:'Integration, business and capstone',
    objective:'From notebook to enterprise architecture and business value.',
    children:[
    {
      id:'m9', block:'D', num:9, tag:'Integration', title:'Integrating with other systems (MCP)', notesOn:true,
      duration:'3–4 days',
      objective:'How an AI system connects to the rest of an organization\'s stack — the golden rule on data applies here especially if it\'s against real sources.',
      skipTest:'Do you know what MCP solves versus building a custom connector for every system?',
      result:'You understand how an AI system connects to the rest of the stack, and why a standard protocol simplifies (and concentrates) integration risk.',
      resources:[
        {id:'r9-1', title:'MCP: Build Rich-Context AI Apps with Anthropic', url:'https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic', desc:'DeepLearning.AI with Anthropic, 2025. The open standard for connecting LLMs to external systems without a custom connector per combination.', devices:DESKTOP_ONLY, lang:'EN'},
        {id:'r9-2', title:'Official MCP documentation', url:'https://modelcontextprotocol.io/', desc:'Includes security best practices: permissions, isolation, trust in third-party servers.', devices:ALL3, lang:'EN'},
        {id:'r9-3', title:'🎥 Why we built—and donated—the MCP', url:'https://www.youtube.com/watch?v=PLyCki2K0Lg', desc:'Anthropic, 2025. Why the protocol exists and where it\'s headed.', devices:ALL3, lang:'EN'}
      ],
      checkpoint:{
        title:'From "upload a file" to "read from a new folder/table"',
        text:'Replace the manual upload from topic 5 with an MCP source (filesystem or similar) and extend the dataset with the previous_application table (history of prior applications with the same institution). Now the agent combines an external source (bureau) and an internal one (previous_application) on its own.',
        piece:'Capstone piece → "Integration"'
      },
      dataset:{
        title:'Capstone dataset — second delivery',
        tables:['previous_application'],
        text:'The previous_application table is added, representing the history of prior applications with the same institution — an "internal vs. external" contrast with the bureau table from topic 5.',
        url:'https://www.kaggle.com/c/home-credit-default-risk/data'
      }
    },
    {
      id:'m10', block:'D', num:10, tag:'Reference', title:'Tools and frameworks', notesOn:false, isReference:true,
      duration:'ongoing reference, not a block',
      objective:'A cheat sheet of what\'s already used in topics 4, 5, 6, and 9, in one place.',
      resources:[
        {id:'r10-1', title:'LangChain', url:null, desc:'Orchestration, used in topics 4 and 5.'},
        {id:'r10-2', title:'LlamaIndex', url:null, desc:'RAG-focused, used in topic 4 and in the agentic RAG of topic 5.'},
        {id:'r10-3', title:'crewAI', url:null, desc:'Multi-agent coordination, used in topic 5.'},
        {id:'r10-4', title:'MCP', url:'https://modelcontextprotocol.io/', desc:'Integration protocol used in topic 9.', devices:ALL3, lang:'EN'},
        {id:'r10-5', title:'API — Anthropic', url:'https://platform.claude.com/docs', desc:'Direct reference to go deeper than the courses.', devices:ALL3, lang:'EN'},
        {id:'r10-6', title:'API — OpenAI', url:'https://platform.openai.com/docs', desc:'Direct reference to go deeper than the courses.', devices:ALL3, lang:'EN'},
        {id:'r10-7', title:'API — Google Gemini', url:'https://ai.google.dev/gemini-api/docs', desc:'Direct reference to go deeper than the courses.', devices:ALL3, lang:'EN'}
      ]
    },
    {
      id:'m11', block:'D', num:11, tag:'Business', title:'Business cases and real-world cost', notesOn:true,
      duration:'4–5 days',
      objective:'From "it works in a notebook" to thinking about production systems for real Data & Analytics projects.',
      skipTest:'Can you already justify model, orchestrator, cost, and latency for a real project in your organization?',
      result:'Architecture and business judgment: model, orchestrator, governance, cost/latency, and when to build nothing at all.',
      resources:[
        {id:'r11-1', title:'Full Stack Deep Learning — LLM Bootcamp', url:'https://fullstackdeeplearning.com/llm-bootcamp/', desc:'Free, 2023. System design for LLMs: expensive vs. cheap models, cost, latency, evaluation, monitoring. The design principles hold up; the specific model details don\'t.', devices:ALL3, lang:'EN'},
        {id:'r11-2', title:'API latency and cost documentation', url:'https://platform.openai.com/docs/guides/latency', desc:'How prompt size, tokens, and model choice affect real production cost.', devices:ALL3, lang:'EN'},
        {id:'r11-2b', title:'Modern cost: prompt caching, batch API and structured outputs', url:'https://docs.claude.com', desc:'An update on the latency guide: prompt caching and batch API on docs.claude.com can cut the cost of repeated context by ~90% — more current than the 2023 latency guide.', devices:ALL3, lang:'EN'},
        {id:'r11-3', title:'🎥 LLMOps (LLM Bootcamp)', url:'https://www.youtube.com/watch?v=Fquj2u7ay40', desc:'Full Stack Deep Learning, 2023. Choosing, testing, deploying, and monitoring LLM applications in production.', devices:ALL3, lang:'EN'},
        {id:'r11-4', title:'Sector context: AI-in-finance reports from the BIS and FSB', url:'https://www.bis.org/', desc:'Free reports on AI adoption in the financial sector.', devices:ALL3, lang:'EN'}
      ],
      checkpoint:{
        title:'Close the loop: cost and build vs. buy',
        text:'Think through what it would take to hand the agent to the team: which model tier is worth it for occasional use, where it would live (Slack? internal chat?), and what governance from topic 8/8-bis would apply. You don\'t need to build it — document the decisions as if you were really proposing it. Include a short build-vs-buy memo (TCO, lock-in, DORA concentration risk, exit clauses).',
        piece:'Capstone piece → "Business case"'
      },
      bankExtra:{
        title:'Banking mini-cases',
        text:'Analyze 4 internal cases — fraud, onboarding/KYC, customer service, regulatory reporting — and for each one: AI Act classification, explainability requirement, personal data yes/no, workflow vs. agent, and estimated annual cost (tokens × volume × model).'
      }
    }
    ]
  },

  {
    id:'mCapstone', block:null, num:null, tag:'★ Capstone', title:'Capstone project', notesOn:true, isCapstone:true,
    duration:'~8–12 h · mandatory on technical paths',
    objective:'Without a deliverable, the path produces certificates, not capability. The capstone assembles the pieces you already built at each checkpoint — not a new exercise from scratch.',
    projectIntro:'An end-to-end banking use case with public synthetic consumer-credit data (Home Credit Default Risk dataset): a risk-analysis agent + your own eval set + AI Act classification + a one-page business case. Presented to the team (20 min). Completion criterion: capstone defended, not courses completed.',
    projectTable:[
      {topic:'3 — Prompting', checkpoint:'Risk-analysis prompt'},
      {topic:'4 — RAG', checkpoint:'Architecture justification (why not classic RAG)'},
      {topic:'5 — Agents', checkpoint:'Agent core (application + bureau)'},
      {topic:'5.3 — Anti-hype', checkpoint:'Design criterion (agent vs. workflow)'},
      {topic:'9 — Integration/MCP', checkpoint:'Integration (+ previous_application)'},
      {topic:'7 — Evaluation', checkpoint:'Own evaluation set + OWASP review'},
      {topic:'8-bis / Gate — Banking', checkpoint:'AI Act classification + gate checklist'},
      {topic:'11 — Business', checkpoint:'One-page business case'}
    ],
    dataset:{
      title:'Full capstone dataset',
      tables:['application','bureau','previous_application','installments_payments (optional)'],
      text:'Home Credit Default Risk (Kaggle). The first three tables are added in stages throughout the path (topics 5 and 9); installments_payments (actual payment behavior) is an optional extension for anyone going deeper on the Builder path.',
      url:'https://www.kaggle.com/c/home-credit-default-risk/data'
    },
    resources:[]
  },

  {
    id:'mE', block:null, num:null, tag:'Block E', title:'Daily practice and gamification', notesOn:false, isAdoption:true,
    duration:'ongoing, from week 1',
    objective:'Courses give knowledge; this builds the habit. Without daily use, nothing is left after 3 months. Runs on each person\'s personal computer, due to corporate network restrictions.',
    adoptItems:[
      {title:'AI in your real work, every week', desc:'~1-2 h/week during normal hours: 3 real tasks per week using the AI tool approved by the bank. Not a separate exercise — it\'s your usual work, with AI. Only with approved tools and no customer data in personal tools.'},
      {title:'Team prompt library', desc:'Shared repository (wiki/SharePoint) where everyone uploads prompts that work for them, organized by process. No real data in the prompts you upload.'},
      {title:'Weekly challenge (30-60 min)', desc:'A rotating mini-challenge: "automate a step of your reporting", "have the AI critique your presentation"…'},
      {title:'Friday demo (15 min)', desc:'One person shows something that worked for them (or that failed — that counts too). Feeds the "AI wins" channel with estimated time saved.'}
    ],
    resources:[]
  },

  {
    id:'mGloss', block:null, num:null, tag:'Reference', title:'Quick glossary', notesOn:false, isGlossary:true,
    duration:'for non-technical profiles',
    objective:'Terms that come up constantly in this path, explained in one sentence.',
    glossary:[
      {term:'LLM', def:'Large language model: the engine that predicts text (Claude, GPT, Gemini).'},
      {term:'Token', def:'The smallest unit of text the model processes (~¾ of a word). You pay per token.'},
      {term:'RAG', def:'The model looks up your own documents before answering, instead of relying only on its memory.'},
      {term:'Agent', def:'An LLM that decides on its own which tools to use (search, query a database, write) to achieve a goal.'},
      {term:'Tool use / function calling', def:'The mechanism by which the model invokes external tools.'},
      {term:'Orchestration', def:'Coordinating the steps, tools, and models of an AI system (LangGraph, etc.).'},
      {term:'Fine-tuning', def:'Partially retraining a model on your own data. Expensive and almost never the first step.'},
      {term:'Evals', def:'Systematic, repeatable tests of an AI system\'s quality. No evals, no production.'},
      {term:'Prompt injection', def:'An attack that sneaks malicious instructions into the text the model reads — critical if the agent has tools.'},
      {term:'MCP', def:'A standard protocol for connecting models to external systems (databases, APIs, applications).'},
      {term:'Vector DB / chunking', def:'How documents are split (chunking) and indexed so RAG can find what\'s relevant.'},
      {term:'Prompt caching', def:'Reusing repeated context across calls to pay up to ~90% less for it.'}
    ],
    resources:[]
  },

  {
    id:'m12', block:null, num:null, tag:'Wrap-up', title:'Wrapping up', notesOn:true, isClosing:true,
    closingText:[
      'You\'ve gone from AI and LLM fundamentals, through prompting, RAG, and agent-building with real frameworks, to the harder architectural questions: when to fine-tune, how to evaluate and secure a system, how to handle governance and regulation, and how to integrate AI into the rest of the stack — all while building the same credit-risk-analysis agent from start to finish, not with disconnected toy examples.',
      'To keep this picture current, subscribe to The Batch, DeepLearning.AI\'s weekly newsletter.'
    ],
    resources:[
      {id:'r12-1', title:'The Batch — subscribe to the newsletter', url:'https://www.deeplearning.ai/the-batch/', desc:'DeepLearning.AI\'s free weekly newsletter. Summarizes what matters without the noise.', devices:ALL3, lang:'EN'}
    ]
  },
  {
    id:'m13', block:null, num:null, tag:'Reference', title:'Other resources of interest', notesOn:false, isReference:true,
    duration:'no account needed',
    objective:'Everything below is freely accessible, no account or setup needed — keep it as reference, not as a checklist.',
    resources:[
      {id:'r13-1', title:'Elements of AI (topic 1, 2018)', url:'https://www.elementsofai.com/', desc:'Free account only needed if you want to track progress or get a certificate.', devices:ALL3, lang:'EN'},
      {id:'r13-2', title:'Anthropic — Building Effective Agents (topic 2, 2024)', url:'https://www.anthropic.com/engineering/building-effective-agents', desc:'Open-access article, no signup.', devices:ALL3, lang:'EN'},
      {id:'r13-3', title:'Prompt Engineering Guide (topic 3)', url:'https://www.promptingguide.ai/', desc:'DAIR.AI reference catalog, no signup.', devices:ALL3, lang:'EN'},
      {id:'r13-4', title:'Arena (topic 5)', url:'https://arena.ai/', desc:'No account, no cost.', devices:ALL3, lang:'EN'},
      {id:'r13-5', title:'Official MCP documentation (topic 9)', url:'https://modelcontextprotocol.io/', desc:'Conceptual reference, no signup.', devices:ALL3, lang:'EN'},
      {id:'r13-6', title:'Ethics of AI (topic 8, 2020)', url:'https://ethics-of-ai.mooc.fi/', desc:'Free account only needed for a certificate.', devices:ALL3, lang:'EN'},
      {id:'r13-7', title:'AI Act — official European Commission page', url:'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai', desc:'Open content, continuously updated.', devices:ALL3, lang:'EN'},
      {id:'r13-8', title:'AI Governance Foundations, Ethicalogic (topic 8)', url:'https://ethicalogic.com/ai-course-access/', desc:'Free, no signup.', devices:ALL3, lang:'EN'},
      {id:'r13-9', title:'API documentation — Anthropic (reading)', url:'https://platform.claude.com/docs', desc:'No account needed to read; an account is only needed for the topic 5 exercise.', devices:ALL3, lang:'EN'},
      {id:'r13-10', title:'API documentation — OpenAI (reading)', url:'https://platform.openai.com/docs', desc:'No account needed to read.', devices:ALL3, lang:'EN'},
      {id:'r13-11', title:'API documentation — Google Gemini (reading)', url:'https://ai.google.dev/gemini-api/docs', desc:'No account needed to read.', devices:ALL3, lang:'EN'},
      {id:'r13-12', title:'The Batch, DeepLearning.AI\'s newsletter', url:'https://www.deeplearning.ai/the-batch/', desc:'Free, summarizes what matters without the noise.', devices:ALL3, lang:'EN'},
      {id:'r13-13', title:'Kaggle — Home Credit Default Risk (capstone dataset)', url:'https://www.kaggle.com/c/home-credit-default-risk/data', desc:'Public dataset used as the base of this path\'s capstone project.', devices:ALL3, lang:'EN'}
    ]
  }
];
