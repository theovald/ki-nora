# Nora Gjøen-Gjøsæter | Personal Website

A clean, minimalist, professional website showcasing experience, skills, and background.

## Features
- **Clean HTML/CSS**: Minimalist design with a focus on readability.
- **Dark/Light Mode**: Full support for system-independent light and dark themes (dark mode default).
- **Responsive**: Mobile-friendly layout.
- **GitHub Pages Ready**: Can be served natively as a static site.
- **Tested**: Includes a test pipeline using `pytest` and `uv` to verify HTML structure.

## Kompetanseprofil for agenter

Siden har en egen profil skrevet for KI-agenter og andre maskinlesere:

- `for-agenter/index.html`: lesbar side med ledelse, rådgivning, teknisk
  kompetanse, alle Flowcase-ferdigheter, prosjekter, foredrag og verv.
  Merket `noindex`.
- `llms.txt` og `llms-full.txt`: samme innhold som ren tekst.
- `nora.json`: JSON-LD `Person` med strukturerte ferdigheter, prosjekter,
  foredrag og verv.

Hovedsiden lenker til filene med `<link rel="alternate">` i `<head>`, uten
synlig lenke. Kilde er CV-eksporten fra Flowcase (mars 2026) i
`_assets/cv/nora-cv.pdf` i arbeidsområdet, pluss arbeid fra 2025 og 2026. Kunder er anonymisert med bransje i alle
filene.
Når Flowcase oppdateres, oppdater `for-agenter/index.html` og `nora.json`
og generer `llms-full.txt` på nytt fra siden.

## Local Development

The site is purely static (HTML/CSS/JS). You can view it by simply opening `index.html` in your browser.

To run tests:
```bash
# Install dependencies using uv
uv sync

# Run tests
uv run pytest
```

## Deployment
Pushing to the `main` branch automatically triggers a GitHub Actions workflow that:
1. Runs the tests.
2. Deploys the static files to GitHub Pages.