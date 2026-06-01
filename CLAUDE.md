# Personal Portfolio Site

Single-page portfolio — intentionally one `index.html` with co-located CSS and JS. No build step.

## Content editing

All site content lives in the `CONFIG` object at the top of `index.html`:

- **name, handle, tagline** — header identity
- **bio** — supports `**bold**` markdown syntax
- **skills** — categories with pill items
- **certs** — certification pills (short name, issuer, year)
- **links** — social/contact links; set `visible: false` to hide without deleting
- **projects** — title, description, tags array, optional URL
- **SHOW_TERMINAL** — toggle the CLI easter-egg view on/off

## Design tokens

Colors, fonts, and sizes are CSS custom properties in the `:root {}` block at the top of the `<style>` tag. Edit them there directly.

## Deployment

GitHub Pages — push to `main`, it goes live. No build step needed.

## Do not suggest

- Splitting into multiple files or adding a build tool — the single-file structure is intentional
- A CMS or external data source — CONFIG editing is the preferred workflow
- Adding a JS framework — vanilla JS is the right fit for this scope
