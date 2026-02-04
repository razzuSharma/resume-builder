# Contributing to Resume Artisan

Thank you for your interest in contributing! This guide will help you get started.

## 📁 Project Structure

```
resume-builder/
├── app/                          # Next.js app directory
│   ├── components/               # React components
│   │   ├── resume-templates/     # Resume template components
│   │   └── *.tsx                 # UI components
│   ├── pages/                    # Form page components
│   ├── lib/                      # Utility libraries
│   ├── types/                    # TypeScript types
│   └── utils/                    # Helper utilities
├── lib/                          # Shared libraries (shadcn)
├── public/                       # Static assets
└── ...config files
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `app/components/` | Reusable React components |
| `app/pages/` | Multi-step form sections |
| `app/lib/` | Core utilities (storage, etc.) |
| `app/types/` | TypeScript type definitions |
| `app/utils/` | Validation schemas |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd resume-builder

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Architecture

### Data Flow
1. **User fills form** → Auto-saves to `localStorage`
2. **Live Preview** → Listens for changes, updates in real-time
3. **Export** → Generates PDF from localStorage data

### Storage System
We use **localStorage** (not a backend database):

```typescript
// lib/storage.ts
export const savePersonalDetails = (data) => 
  localStorage.setItem('resume_personal_details', JSON.stringify(data));

export const loadPersonalDetails = () => 
  JSON.parse(localStorage.getItem('resume_personal_details'));
```

**Key Principles:**
- All data stays in the user's browser
- No API calls for data persistence
- Export/Import as JSON for backup

## 📝 Code Guidelines

### Component Structure
```typescript
"use client";  // For client components

import React from "react";
import { motion } from "framer-motion";
// Group imports: React → Libraries → Components → Utils

interface ComponentProps {
  // Define props interface
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    // JSX
  );
};

export default Component;
```

### Styling (Tailwind CSS)
- Use Tailwind classes exclusively
- Dark mode support: always add `dark:` variants
- Follow existing color patterns (teal, purple, amber, etc.)

```tsx
// Good example
<div className="bg-white dark:bg-gray-800 rounded-xl p-6">
  <h2 className="text-gray-900 dark:text-white">Title</h2>
</div>
```

### Form Components
Forms use **Formik** + **Yup**:

```typescript
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  name: Yup.string().required("Required"),
});

// In component
<Formik
  initialValues={{ name: "" }}
  validationSchema={schema}
  onSubmit={handleSubmit}
>
  <Form>
    <Field name="name" />
    <ErrorMessage name="name" />
  </Form>
</Formik>
```

### Adding a New Form Section

1. Create component in `app/pages/NewSection.tsx`
2. Add to `app/create-resume/page.tsx` steps array
3. Add storage functions to `app/lib/storage.ts`
4. Update LivePreview to display the new data

## 🎨 UI Components

We use **shadcn/ui** components stored in `components/ui/`. To add a new one:

```bash
npx shadcn add button
```

## 🧪 Testing

Currently, we rely on manual testing:

1. **Test data persistence**: Fill form, refresh, verify data remains
2. **Test export/import**: Export JSON, clear data, import, verify restore
3. **Test PDF generation**: Download PDF, verify formatting
4. **Test dark mode**: Toggle theme, verify all components

## 📋 Pull Request Process

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/my-feature`
3. **Make changes** with clear commit messages
4. **Test** your changes thoroughly
5. **Submit PR** with description of changes

### PR Checklist
- [ ] Code builds without errors (`npm run build`)
- [ ] No console errors
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Follows existing code style

## 🐛 Bug Reports

Include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/OS info
5. Screenshots if applicable

## 💡 Feature Requests

Open an issue with:
- Clear description
- Use case
- Proposed implementation (optional)

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## Need Help?

- Check existing code for patterns
- Ask in discussions
- Review closed PRs for examples
