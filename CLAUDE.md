# Personal Portfolio Site

Single-page portfolio — intentionally one `index.html` with co-located CSS and JS. No build step.

## Content editing

All site content lives in the `CONFIG` object at the top of `index.html`:

- **name, handle, tagline** — header identity
- **bio** — supports `**bold**` markdown syntax
- **skills** — categories with pill items
- **certs** — certification pills (short name, issuer, year)
- **links** — social/contact links; set `visible: false` to hide without deleting
- **projects** — title, scannable outcome, description, tags, URL, and link label
- **SHOW_TERMINAL** — toggle the CLI easter-egg view on/off

Page title, description, canonical URL, and social-preview metadata live directly in `<head>` so crawlers can read them without running JavaScript.

## Design tokens

Colors, fonts, and sizes are CSS custom properties in the `:root {}` block at the top of the `<style>` tag. Edit them there directly.

## Deployment

GitHub Pages — push to `main`, it goes live. No build step needed.

## Validation

Run the standard-library smoke tests before publishing:

```sh
python3 -m unittest discover -s tests -v
```

## Do not suggest

- Splitting into multiple files or adding a build tool — the single-file structure is intentional
- A CMS or external data source — CONFIG editing is the preferred workflow
- Adding a JS framework — vanilla JS is the right fit for this scope
