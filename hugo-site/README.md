# Digital Artifacts - Hugo Site

This is the Hugo version of the Digital Artifacts website, migrated from Jekyll.

## Tech Stack

- **Hugo** v0.152.2 (Extended)
- **Bootstrap** 5.3.1
- **SASS/SCSS** for custom styling
- **GitHub Pages** for hosting

## Local Development

### Prerequisites

- Hugo Extended (v0.152.2 or later)
- Node.js (for Bootstrap dependencies)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   hugo server --buildDrafts
   ```

3. View the site at `http://localhost:1313`

### Building for Production

```bash
hugo --gc --minify
```

The built site will be in the `public/` directory.

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions.

The workflow file is located at `.github/workflows/hugo.yml`.

## Site Structure

```
hugo-site/
├── archetypes/        # Content templates
├── assets/            # SASS/SCSS files
│   └── scss/
│       └── main.scss
├── content/           # Markdown content
│   ├── _index.md      # Homepage
│   ├── about.md
│   ├── image.md
│   ├── sound.md
│   └── blog/          # Blog posts
├── layouts/           # Hugo templates
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── list.html
│   │   └── single.html
│   ├── partials/
│   │   ├── head.html
│   │   ├── nav.html
│   │   ├── footer.html
│   │   └── script.html
│   └── index.html
├── static/            # Static assets (images, JS, favicons)
├── hugo.toml          # Site configuration
└── package.json       # Node dependencies (Bootstrap)
```

## Content Management

### Adding a New Page

```bash
hugo new content/page-name.md
```

### Adding a Blog Post

```bash
hugo new content/blog/post-title.md
```

### Front Matter Format

```yaml
---
title: "Page Title"
layout: page
---
```

## Custom Domain

The site uses the custom domain `digitalartifacts.media` configured via the `CNAME` file in the `static/` directory.
