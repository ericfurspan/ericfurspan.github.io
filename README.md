# Eric Furspan — Personal Site

A focused, single-page portfolio for recruiters, hiring managers, and engineers evaluating my work across full-stack development, cloud/DevOps, and application security.

## Architecture

The site is intentionally dependency-free: one `index.html` file contains the markup, styles, content configuration, and small amount of interaction code. There is no framework, package installation, or production build step.

This keeps the deployment surface small while still providing:

- Responsive desktop, mobile, and short-landscape layouts
- Keyboard-accessible project navigation and focus management
- Reduced-motion support
- Static social-preview metadata
- A default-deny Content Security Policy

## Run locally

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Validate

The smoke tests use only Python's standard library and the Node.js syntax checker:

```sh
python3 -m unittest discover -s tests -v
```

The same checks run in GitHub Actions for pushes and pull requests.

## Edit content

Portfolio content lives in the `CONFIG` object near the top of `index.html`. Page and social-preview metadata live directly in `<head>` so crawlers can read them without executing JavaScript.

## Deployment

GitHub Pages publishes the `main` branch directly at [ericfurspan.github.io](https://ericfurspan.github.io/).
