# btrailor.github.io

Personal portfolio website showcasing creative coding, electronic music, design work, and writing. Built with Hugo and featuring interactive generative visuals and audio.

## Features

- **Interactive Mycelial Network**: Generative p5.js visualization with organic growth patterns
- **Glitch Effects**: Hover animations with visual corruption and audio feedback
- **Generative Ambient Audio**: Three-layer drone synthesis with network sonification
- **Responsive Design**: Optimized layouts across desktop, tablet, and mobile viewports

## Tech Stack

- **Hugo** v0.152.2+extended (Static Site Generator)
- **p5.js** v1.7.0 (Creative Coding)
- **Web Audio API** (Generative Sound)
- **SCSS** (Styling)
- **GitHub Actions** (CI/CD)

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/btrailor/btrailor.github.io.git
   cd btrailor.github.io
   ```

2. Navigate to the Hugo site directory:

   ```bash
   cd hugo-site
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   hugo server -D --port 1314
   ```

5. Visit [http://localhost:1314](http://localhost:1314) in your browser

## Project Structure

```
hugo-site/
├── assets/scss/          # SCSS stylesheets
├── content/              # Markdown content
│   ├── code/            # Code projects
│   ├── design/          # Design work
│   ├── images/          # Visual art
│   ├── sounds/          # Music releases
│   ├── words/           # Writing
│   └── info/            # About & contact
├── layouts/             # HTML templates
├── static/              # Static assets
│   ├── images/         # Image files
│   └── javascript/     # Interactive features
│       ├── mycelial_network.js
│       ├── glitch_effects.js
│       └── ambient_audio.js
└── hugo.toml           # Hugo configuration
```

## Deployment

The site automatically deploys to GitHub Pages via GitHub Actions on push to `main`. The workflow builds the Hugo site and deploys to the `gh-pages` branch.

## License

© 2025 Brett Gershon. All rights reserved.
