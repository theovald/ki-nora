# Nora Gjøen-Gjøsæter | Personal Website

A clean, minimalist, professional website showcasing experience, skills, and background.

## Features
- **Clean HTML/CSS**: Minimalist design with a focus on readability.
- **Dark/Light Mode**: Full support for system-independent light and dark themes (dark mode default).
- **Responsive**: Mobile-friendly layout.
- **GitHub Pages Ready**: Can be served natively as a static site.
- **Tested**: Includes a test pipeline using `pytest` and `uv` to verify HTML structure.

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