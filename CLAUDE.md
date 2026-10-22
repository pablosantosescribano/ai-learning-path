# CLAUDE.md

See README.md for what the app is and how the files are laid out. This file covers the rules for changing it.

## Keep the three copies in sync

The path exists in three places. Any change to content or behaviour must be applied to all of them in the same change:

1. `index.html` + `css/` + `js/` — the live site and the source of truth.
2. `assets/ai-learning-path-banking.single-file.html` — the same app inlined into one file (styles in `<style>`, all JS in one inline `<script>`). Mirror code and content edits there by hand.
3. `assets/itinerario-ia-agentes.md` — a Markdown rendering of the content in `js/data.js` (routes, modules, resources, checkpoints). Update it whenever content changes; pure UI/styling changes don't affect it.

Before finishing, diff the relevant sections of the single-file copy against the modular files to confirm they match.

## Constraints

- Plain static HTML/CSS/JS, no build step. Don't add npm, bundlers, frameworks, or new CDN dependencies.
- Don't rename or reuse module/resource `id`s in `js/data.js` (`m1`, `r1-2`, …): saved progress is keyed by them, so renaming silently wipes people's progress. New items get new ids following the existing pattern.
- Banking/regulatory content belongs only in the `8-bis` module (`bank:true`), which is gated by the banking toggle.
- Content is written in English.
- `js/config.js` holds a publishable Supabase key. It's meant to be public; leave it committed.
- Schema changes to the `path_progress` table have to be run by hand in the Supabase SQL Editor. Document the SQL in the README instead of assuming it gets applied.

## Checking changes

There are no tests. Serve the folder (`python3 -m http.server`), open `index.html`, and check the affected views, including with the banking toggle on and off. Open the single-file copy directly to check it too.

## Workflow

`main` is branch-protected. Work on a `claude/<short-topic>` branch and open a PR.
