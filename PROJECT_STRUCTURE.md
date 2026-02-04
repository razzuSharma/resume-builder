# Project Structure

This document explains the organization of the Resume Artisan codebase.

## Directory Overview

```
resume-builder/
├── app/                     # Next.js App Router
│   ├── components/          # React components
│   ├── pages/               # Form sections
│   ├── lib/                 # Core libraries
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   ├── contact-us/          # Contact page
│   ├── create-resume/       # Resume builder page
│   ├── resume/              # Preview & export page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── lib/                     # Shared libraries (shadcn)
├── public/                  # Static assets
└── components.json          # shadcn config
```

## Detailed Breakdown

### `/app/components/`

Reusable React components organized by purpose:

| File | Purpose |
|------|---------|
| `Button.tsx` | Custom button component |
| `DataManager.tsx` | Export/Import modal for backup |
| `Footer.tsx` | Site footer |
| `LivePreview.tsx` | Real-time resume preview panel |
| `ResumeAnimation.tsx` | Animated hero illustration |
| `ResumeLayout.tsx` | Resume wrapper component |
| `SuccessMessageToast.tsx` | Success notification |
| `ThemeProvider.tsx` | Dark/light mode context |
| `ThemeToggle.tsx` | Theme switcher button |

**Subdirectory:** `resume-templates/`
- `ModernTemplate.tsx` - Modern resume layout
- (More templates can be added here)

### `/app/pages/`

Multi-step form sections, each handling one part of the resume:

| File | Manages |
|------|---------|
| `PersonalDetails.tsx` | Name, contact, summary, photo |
| `EducationDetails.tsx` | Schools, degrees, GPA |
| `ExperienceDetails.tsx` | Work history, responsibilities |
| `ProjectDetails.tsx` | Portfolio projects |
| `SkillsDetails.tsx` | Technical/professional skills |
| `HobbiesDetails.tsx` | Personal interests |

Each file:
- Uses Formik for form handling
- Auto-saves to localStorage
- Has validation schema
- Triggers LivePreview updates

### `/app/lib/`

Core utility libraries:

| File | Purpose |
|------|---------|
| `storage.ts` | All localStorage operations |

**Why `lib/`?** Follows Next.js convention for shared utilities that don't depend on React.

### `/app/types/`

TypeScript type definitions:

```typescript
// Example: types/index.ts
export interface PersonalDetails {
  first_name: string;
  last_name: string;
  // ...
}
```

### `/app/utils/`

Helper utilities:

| File | Purpose |
|------|---------|
| `validationSchemas.ts` | Yup validation schemas for forms |

### Route Groups

| Route | File | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Landing page with hero |
| `/create-resume` | `create-resume/page.tsx` | Multi-step form wizard |
| `/resume` | `resume/page.tsx` | Preview & PDF export |
| `/contact-us` | `contact-us/page.tsx` | Contact form |

## Key Patterns

### 1. Component Organization

```typescript
// Order of elements in a component file:
1. "use client" directive (if needed)
2. Imports (React → Libraries → Components → Utils)
3. TypeScript interfaces
4. Helper functions
5. Main component
6. Export
```

### 2. Storage Pattern

All data persistence goes through `lib/storage.ts`:

```typescript
// Good
import { savePersonalDetails } from "../lib/storage";

// Bad - Don't access localStorage directly in components
localStorage.setItem("key", value);
```

### 3. Form Pattern

Forms follow this structure:

```typescript
const Component = ({ onNext }) => {
  // Load saved data on mount
  useEffect(() => {
    const saved = loadData();
    if (saved) setInitialValues(saved);
  }, []);

  const handleSubmit = (values) => {
    saveData(values);      // Save to localStorage
    notifyResumeUpdate();  // Trigger preview update
    onNext();              // Go to next step
  };

  return (
    <Formik ...>
      {/* Form fields */}
    </Formik>
  );
};
```

### 4. Styling Pattern

Always include dark mode variants:

```tsx
<div className="
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-white
  border-gray-200 dark:border-gray-700
">
```

## Adding New Features

### New Form Section

1. Create `app/pages/NewSection.tsx`
2. Add Yup schema to `app/utils/validationSchemas.ts`
3. Add storage functions to `app/lib/storage.ts`
4. Add to steps array in `app/create-resume/page.tsx`
5. Update `LivePreview.tsx` to display the data

### New Resume Template

1. Create `app/components/resume-templates/TemplateName.tsx`
2. Accept same props as `ModernTemplate.tsx`
3. Add to template selector in `app/create-resume/page.tsx`
4. Add to LivePreview component

### New Storage Field

1. Add to `STORAGE_KEYS` in `app/lib/storage.ts`
2. Create save/load functions
3. Add to `exportResumeData()` and `importResumeData()`

## File Naming Conventions

- **Components**: PascalCase (`LivePreview.tsx`)
- **Utilities**: camelCase (`storage.ts`)
- **Pages**: camelCase (`create-resume/page.tsx`)
- **Types**: PascalCase (`PersonalDetails.ts`)

## Import Paths

Use relative imports within a directory:

```typescript
// In app/pages/PersonalDetails.tsx
import { savePersonalDetails } from "../lib/storage";
import { InputField } from "../components/InputField";
```

## Questions?

Refer to [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue.
