# AI / LLM Learning Path (Banking)

An interactive, self-hosted learning tracker for Generative AI, LLMs, and agents — with an optional banking-specific regulatory module (SR 11-7, DORA, EBA/BCE, NIST AI RMF, AEPD).

**Live site:** https://pablosantosescribano.github.io/ai_learning_path/ *(enable GitHub Pages — see below)*

## What this is

- A role-based learning path (Complete / Executive / Builder / Governance) covering generative AI and LLM fundamentals through applied agent-building, with a capstone project based on the Kaggle Home Credit Default Risk dataset.
- Progress is saved per person (by name) in a Supabase database, so it can be picked up from any device.
- Banking-specific regulatory content is toggleable, so the path stays useful outside a banking context.
- A Markdown reference version of the path (`assets/itinerario-ia-agentes.md`) is included for reading, printing, or reviewing offline — the HTML tracker remains the source of truth for day-to-day use.

## Structure

```
├── index.html          Main app shell
├── css/styles.css       All styling
├── js/
│   ├── config.js        Supabase project URL + public key
│   ├── data.js           Learning path content (modules, routes, resources)
│   ├── storage.js        Persistence layer (Supabase + local fallbacks) and the
│   │                      user-identity modal
│   └── app.js             Rendering, interactions, and app initialization
└── assets/
    ├── ai-learning-path-banking.single-file.html   Standalone copy (no build steps,
    │                                                  works offline, kept in sync manually)
    └── itinerario-ia-agentes.md                    Markdown reference version of the path,
                                                       for reading/printing/reviewing offline
```

## Local development

No build step — open `index.html` directly, or serve the folder with any static file server.

## Data & privacy note

Progress is identified by a self-chosen display name plus a password, not a real identity. People are asked not to enter personal data (full name, email) when signing in, since the name is stored as-is in a shared Supabase table. The password is hashed (SHA-256) client-side before being stored or compared — this stops the app's own UI from letting someone else continue under your name, but it's not high-security: it isn't enforced at the database level (Row Level Security), so treat it as a soft per-name lock, not a real login, and never reuse a password from elsewhere.

### Database setup (Supabase)

The `path_progress` table needs a `password_hash` column. If it doesn't exist yet, run this once in the Supabase SQL Editor:

```sql
alter table public.path_progress
  add column if not exists password_hash text;
```

Existing rows will have `password_hash` as `null` — the app treats those as unclaimed and sets the password the next time each person signs in with that name.

## Updating content

Learning modules, resources, and routes live in `js/data.js`. Regulatory / banking-specific content is grouped under the `8-bis` module and gated behind the banking toggle in the UI.

## GitHub Pages

To serve `index.html` from the repo root:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **Deploy from a branch**.
3. Under **Branch**, select `main` and folder `/ (root)`, then **Save**.
4. Wait a minute or two for the first deployment; the site will be published at the URL shown at the top of that page (typically `https://pablosantosescribano.github.io/ai_learning_path/`).

No further configuration is needed — there's no build step, and `index.html` already links to `css/` and `js/` with relative paths.
