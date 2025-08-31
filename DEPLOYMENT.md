# Deployment Guide

This project is configured for deployment to GitHub Pages using GitHub Actions.

## Automatic Deployment (Recommended)

The project is configured with GitHub Actions for automatic deployment:

1. **Push to main branch** - Automatically triggers deployment
2. **Manual trigger** - Go to Actions tab and manually trigger the workflow
3. **Pull requests** - Builds and tests without deploying

### GitHub Pages Setup

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. The workflow will automatically deploy to `https://carolinapowers.github.io/gnow-craft/`

### Build Configuration

- **CI Build**: Uses `npm run build:ci` (skips TypeScript checking for intentional exercise bugs)
- **Local Build**: Uses `npm run build` (includes TypeScript checking)
- **Exercise Files**: Debugging exercise files contain intentional TypeScript errors for learning purposes

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Install gh-pages (run once)
npm install --save-dev gh-pages

# Build and deploy manually
npm run deploy
```

## Configuration

- **Base URL**: `/gnow-craft/` (configured in `vite.config.ts`)
- **Build Output**: `./dist` directory
- **Node Version**: 18 (specified in GitHub Actions)

## Environment Variables

The following environment variables are configured:

- `NODE_ENV=production` - Enables production build optimizations
- `__VUE_PROD_DEVTOOLS__=true` - Enables Vue DevTools in production for debugging

## Deployment Checklist

- [ ] Repository has GitHub Pages enabled
- [ ] Source is set to "GitHub Actions"
- [ ] Workflow has proper permissions (contents: read, pages: write, id-token: write)
- [ ] Base URL is correctly set for your repository name
- [ ] Build succeeds locally with `npm run build`

## Troubleshooting

**404 on deployed site**: Check that the base URL in `vite.config.ts` matches your repository name.

**Assets not loading**: Ensure all asset paths are relative and use the configured base URL.

**Build fails**: Check that all TypeScript errors are resolved and excluded debugging exercise files don't break the build.