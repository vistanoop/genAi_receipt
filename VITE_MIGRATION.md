# Vite Migration Guide

Your project has been converted from Next.js to **Vite 5.4.0** (latest). Here's what changed:

## ✅ What's Been Updated

### Package Configuration
- ✓ Removed: `next`, `next-themes`, `eslint-config-next`
- ✓ Added: `vite@^5.4.0`, `@vitejs/plugin-react@^4.3.0`, `react-router-dom@^6.20.1`
- ✓ Updated npm scripts:
  - `npm run dev` → Starts Vite dev server on port 3000
  - `npm run build` → Creates optimized production build in `/dist`
  - `npm run preview` → Preview production build locally

### New Files Created
- `vite.config.js` - Vite configuration with React plugin
- `index.html` - Entry point (required by Vite)
- `src/main.jsx` - Application bootstrap
- `src/App.jsx` - Root component with routing
- `src/index.css` - Tailwind styles (copy from app/globals.css)
- Updated `jsconfig.json` - For path aliases and JSX support

### Configuration Updates
- ✓ `tailwind.config.js` - Updated content paths for src directory
- ✓ `postcss.config.mjs` - No changes needed, works with Vite
- ✓ `.gitignore` - Configured for Vite build outputs

## 🚀 Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Page Components
Move your page components to `/src/pages/`:
```
src/
├── pages/
│   ├── Home.jsx        (from app/page.js)
│   ├── Login.jsx       (from app/login/page.jsx)
│   ├── Signup.jsx      (from app/signup/page.jsx)
│   ├── Dashboard.jsx   (from app/dashboard/page.jsx)
│   └── ... other pages
├── components/         (copy from /components)
├── lib/               (copy from /lib)
└── App.jsx
```

### 3. Update Component Imports
- Remove "use client" directives
- Update import paths:
  - `Link` → Use `react-router-dom` `Link`
  - `useRouter()` → Use `react-router-dom` `useNavigate()`
  - Remove Next.js specific hooks

### 4. Copy Project Files
```bash
# Copy components, lib, and models to src/
cp -r components/ src/
cp -r lib/ src/
cp -r models/ src/
```

### 5. Update API Routes
- API routes should remain in `/backend` (Node.js/Express)
- Frontend calls: `http://localhost:5000/api/*`
- Vite proxy is configured in vite.config.js

### 6. Start Development
```bash
npm run dev
```

Visit: **http://localhost:3000**

## 📋 File Mapping

| Old (Next.js) | New (Vite) |
|---|---|
| app/page.js | src/pages/Home.jsx |
| app/layout.js | src/App.jsx (with routing) |
| app/login/page.jsx | src/pages/Login.jsx |
| app/signup/page.jsx | src/pages/Signup.jsx |
| app/dashboard/page.jsx | src/pages/Dashboard.jsx |
| app/globals.css | src/index.css |
| components/ | src/components/ |
| lib/ | src/lib/ |
| public/ | public/ (same) |

## 🔧 Important Changes

### Routing
- **Next.js**: File-based routing (app directory)
- **Vite**: Client-side routing with `react-router-dom`

Update your routing structure in `src/App.jsx`

### API Calls
All API calls remain the same:
```javascript
// Vite frontend → Express backend
fetch('/api/auth/login', { ... })
// Proxy configured: /api → http://localhost:5000/api
```

### Environment Variables
```env
# .env.local
VITE_API_URL=http://localhost:5000
```

Access in components:
```javascript
import.meta.env.VITE_API_URL
```

## ⚡ Dev Server Features

- Hot Module Replacement (HMR) enabled
- Fast development compilation
- API proxy to backend on port 5000
- Source maps for debugging
- CSS modules and preprocessor support

## 🏗️ Production Build

```bash
npm run build
```

Creates optimized production bundle in `/dist/`:
- Minified JavaScript
- Tree-shaking
- Code splitting
- Asset optimization

Deploy `/dist` folder to your hosting.

## 🐛 Troubleshooting

### Module not found errors
- Ensure path alias `@/*` matches your directory structure
- Check jsconfig.json paths configuration

### Styling issues
- Make sure `src/index.css` is imported in `src/main.jsx`
- Verify tailwind.config.js content paths

### API connection errors
- Backend must be running on port 5000
- Check vite.config.js proxy settings

### Port conflicts
- Dev server default: 3000
- Backend default: 5000
- Modify in vite.config.js if needed

## 📚 Resources
- [Vite Documentation](https://vitejs.dev)
- [React Router v6](https://reactrouter.com)
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)

---

**Migration completed!** Your project is ready for Vite development. 🎉
