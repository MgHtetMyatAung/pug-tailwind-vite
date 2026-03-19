# Modern Pug + Vite + Tailwind CSS v4

A professional-grade Multi-Page Application (MPA) starter focused on speed, visual excellence, and a modern developer experience.

## 🚀 Key Features

- **Vite (MPA Mode)**: High-performance build tool with a custom multi-page routing system.
- **Pug**: Clean, concise templating engine with layouts and components.
- **Tailwind CSS v4**: The latest in utility-first CSS, built for performance and modern web design.
- **Dynamic Routing**: Automatic mapping from `.pug` files to `.html` URLs during development.
- **Data-Driven**: Global site data, navigation, and mock data injection for dynamic content.

## 📁 Project Structure

```text
├── src/
│   ├── app/            # Main JavaScript entry (main.js)
│   ├── components/     # Reusable Pug mixins and snippets (.pug)
│   ├── constants/      # Shared static constants (e.g., navigation)
│   ├── mock/           # Mock data files for dynamic components (.js)
│   ├── pages/          # Your application pages (.pug)
│   ├── styles/         # Global and component-specific CSS
│   └── utils/          # Utility scripts and helper functions
├── scripts/            # Build and utility scripts
├── public/             # Static assets (images, fonts, robots.txt)
├── vite.config.js      # Advanced Vite and Pug routing configuration
└── package.json        # Dependencies and build scripts
```

## 🛠 Getting Started

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Development Mode

```bash
npm run dev
```

The server will start at `http://localhost:8000`. Any page added to `src/pages/*.pug` will be automatically accessible at `http://localhost:8000/pagename`.

### 3. Build for Production

```bash
npm run build
```

This script performs a pre-build step to generate entry points, builds with Vite, and cleans up temporary files. Optimized files will be in the `/dist` folder.

## 📝 How-To Guides

### Adding a New Page

1.  Create a new `.pug` file in `src/pages/` (e.g., `services.pug`).
2.  Extend the base layout: `extends ../components/layout.pug`.
3.  Add your content in the `block content`.
4.  Navigate to `/services` in your browser.

### Using Global Data

Data from `src/utils/siteData.js`, `src/constants/navigation.js`, and `src/mock/*.js` is automatically available in all Pug templates under the `site` object.
Example: `h1= site.pages.index.title`

### Styling

Use Tailwind CSS classes directly in your Pug files. Global styles can be found and extended in `src/styles/global.css`.

## ⚙️ Build Process Internals

- **Pre-build (`scripts/pre-build.js`)**: Automatically scans the `src/pages` directory and creates temporary `.html` files in the root to act as entry points for Rollup.
- **Vite Custom Middleware**: Intercepts requests during dev mode and serves the correct Pug template without needing physical `.html` files.
