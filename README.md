# Resume Artisan

A beautiful, free resume builder that works entirely in your browser. No signup required, no data sent to servers - your privacy is guaranteed.

[![Deploy to GitHub Pages](https://github.com/yourusername/resume-artisan/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/resume-artisan/actions/workflows/deploy.yml)

![Resume Artisan](https://img.shields.io/badge/Resume-Artisan-teal)
![Next.js](https://img.shields.io/badge/Next.js-13-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)

## ✨ Features

- 🎨 **Beautiful Templates** - Modern and Classic designs with 6 color variants
- 🔒 **Privacy First** - All data stays in your browser (localStorage)
- ⚡ **Live Preview** - See changes in real-time as you type
- 📱 **Mobile Friendly** - Works on all devices
- 🌙 **Dark Mode** - Full dark theme support
- 📄 **PDF Export** - High-quality PDF generation
- 💾 **Auto-Save** - Never lose your progress
- 📤 **Export/Import** - Backup and restore your data
- 🆓 **100% Free** - No hidden costs or premium features

## 🚀 Quick Start

### Online (Recommended)
Visit: [https://yourusername.github.io/resume-artisan](https://yourusername.github.io/resume-artisan)

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/resume-artisan.git
cd resume-artisan

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Architecture

### Pure Client-Side Application

Unlike most resume builders, we don't use a backend database:

```
User Input → localStorage → PDF Export
     ↓
Live Preview (real-time)
```

**Benefits:**
- ⚡ Instant saves (no network latency)
- 🔒 Complete privacy
- 💰 Zero hosting costs
- 📴 Works offline

### Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 13 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Formik | Form handling |
| Framer Motion | Animations |
| html2canvas + jsPDF | PDF generation |

## 📁 Project Structure

```
app/
├── components/           # React components
│   ├── resume-templates/ # Resume templates
│   ├── DataManager.tsx   # Export/Import UI
│   ├── LivePreview.tsx   # Real-time preview
│   └── ...
├── pages/               # Form sections
├── lib/                 # Core utilities
│   └── storage.ts       # localStorage functions
└── ...
```

## 🚀 Deployment

### Deploy to GitHub Pages (Free)

1. Fork this repository
2. Go to Settings → Pages
3. Set source to "GitHub Actions"
4. Push to main branch - automatic deployment!

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/resume-artisan)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/resume-artisan)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Quick start:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Workflow

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: description of changes"

# Push and create PR
git push origin feature/your-feature-name
```

## 📝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Built with ❤️ for job seekers everywhere.

[Report Bug](https://github.com/yourusername/resume-artisan/issues) · [Request Feature](https://github.com/yourusername/resume-artisan/issues)
