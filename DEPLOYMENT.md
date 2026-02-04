# Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Free - Recommended)

1. **Fork this repository** to your GitHub account

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - Save

3. **Update Repository URL:**
   Edit these files with your username:
   - `package.json` - repository.url
   - `README.md` - All GitHub links
   - `.github/workflows/deploy.yml` - If needed

4. **Deploy:**
   Push to main branch or run workflow manually
   ```bash
   git push origin main
   ```

5. **Access your site:**
   `https://yourusername.github.io/resume-artisan`

---

### Option 2: Vercel (Free - Fastest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/resume-artisan)

Or manual:
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Framework preset: Next.js
4. Build command: `next build`
5. Output directory: `dist`
6. Deploy!

---

### Option 3: Netlify (Free)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/resume-artisan)

Or manual:
1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → Import from GitHub
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

---

### Option 4: Cloudflare Pages (Free)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connect to GitHub
4. Build settings:
   - Framework: Next.js (Static HTML Export)
   - Build command: `npm run build`
   - Output: `dist`
5. Deploy!

---

## 📋 Pre-Deployment Checklist

- [ ] Update repository URLs in:
  - `package.json`
  - `README.md`
  - `DEPLOYMENT.md` (this file)
  
- [ ] Update site metadata:
  - `app/layout.tsx` - title, description
  - `app/page.tsx` - landing page content
  
- [ ] Test build locally:
  ```bash
  npm run build
  ```
  
- [ ] Verify `dist/` folder is created
- [ ] Check no console errors in build
- [ ] Test all pages work correctly

---

## 🔧 Environment Variables

This app requires NO environment variables for deployment.

It uses localStorage for data persistence, so it works 100% client-side.

---

## 🌐 Custom Domain (Optional)

### GitHub Pages Custom Domain:
1. Add `CNAME` file to root with your domain
2. Configure DNS:
   - A record: `185.199.108.153`
   - A record: `185.199.109.153`
   - A record: `185.199.110.153`
   - A record: `185.199.111.153`
   - Or CNAME: `yourusername.github.io`

### Vercel Custom Domain:
1. Project Settings → Domains
2. Add domain and follow verification

---

## 📊 Monitoring

### GitHub Actions Status:
Check deployment status at:
`https://github.com/yourusername/resume-artisan/actions`

### Analytics (Optional):
Add Vercel Analytics or Google Analytics:
1. `npm install @vercel/analytics`
2. Add to `app/layout.tsx`:
   ```tsx
   import { Analytics } from "@vercel/analytics/react"
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>{children}</body>
         <Analytics />
       </html>
     )
   }
   ```

---

## 🔄 Updating After Deployment

1. Make changes locally
2. Test: `npm run dev`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update: description"
   git push origin main
   ```
4. CI/CD automatically deploys!

---

## 🆘 Troubleshooting

### Build fails:
```bash
# Clean and rebuild
rm -rf node_modules dist .next
npm install
npm run build
```

### 404 errors:
- Check `trailingSlash: true` in `next.config.js`
- Verify all routes exist in `app/`

### Styles not loading:
- Check `output: 'export'` in `next.config.js`
- Verify `dist/` folder has CSS files

### Images not showing:
- Images must be in `public/` folder
- Use `unoptimized: true` for static export

---

## 💡 Performance Tips

1. **Enable CDN** (included with Vercel/Netlify)
2. **Compress images** in `public/`
3. **Use lazy loading** for below-fold content
4. **Enable caching** headers

---

**Your app is ready to deploy! 🎉**
