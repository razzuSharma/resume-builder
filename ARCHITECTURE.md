# Architecture Overview

## System Design

Resume Artisan is a **pure client-side application** with no backend server required.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  User Input  │  │ localStorage │  │  PDF Export  │      │
│  │   (Forms)    │◄─┤   (Data)     │──┤  (html2canvas│      │
│  └──────┬───────┘  └──────────────┘  └──────────────┘      │
│         │                                                   │
│  ┌──────▼───────┐                                          │
│  │ Live Preview │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Input
```
User types in form
    ↓
Formik handles validation
    ↓
Auto-save to localStorage (debounced)
    ↓
notifyResumeUpdate() event fired
```

### 2. Live Preview
```
LivePreview component mounts
    ↓
Subscribes to 'resumeDataUpdated' events
    ↓
On event: reload data from localStorage
    ↓
Re-render template with new data
```

### 3. Export to PDF
```
User clicks "Download PDF"
    ↓
html2canvas captures DOM as image
    ↓
jsPDF creates multi-page PDF
    ↓
Auto-download triggered
```

### 4. Backup/Restore
```
Export: localStorage → JSON file
Import: JSON file → localStorage
```

## Key Decisions

### Why localStorage?

| Approach | Pros | Cons | Our Choice |
|----------|------|------|------------|
| localStorage | Fast, private, offline, free | Limited to 5-10MB, per-browser | ✅ |
| Backend DB | Cross-device, persistent | Server costs, privacy concerns, complexity | ❌ |
| IndexedDB | Larger storage | More complex API | ❌ (overkill) |

### Why Next.js App Router?

- Static export capability
- Clean component organization
- Built-in optimizations
- Easy deployment to Vercel/Netlify

### Why no Redux?

Originally used Redux for Supabase data fetching. After switching to localStorage:
- Forms manage their own state
- LivePreview polls for changes
- No global state needed

## Storage Schema

```typescript
// localStorage keys
{
  "resume_user_id": "user_123456789",
  "resume_personal_details": { /* object */ },
  "resume_education_details": [ /* array */ ],
  "resume_experience_details": [ /* array */ ],
  "resume_project_details": [ /* array */ ],
  "resume_skills": ["JavaScript", "React"],
  "resume_hobbies": ["Reading", "Gaming"],
  "theme": "dark",
  "colorVariant": "teal"
}
```

## Export Format

```json
{
  "version": "1.0",
  "exportedAt": "2024-01-15T10:30:00Z",
  "personal": { /* personal details */ },
  "education": [ /* education array */ ],
  "experience": [ /* experience array */ ],
  "projects": [ /* projects array */ ],
  "skills": ["JavaScript", "React"],
  "hobbies": ["Reading", "Gaming"]
}
```

## Component Communication

Since we removed Redux, components communicate via:

1. **Props** - Parent to child
2. **Events** - Custom events for cross-component updates
3. **localStorage** - Persistent shared state

```typescript
// Trigger update
notifyResumeUpdate();

// Listen for updates
useEffect(() => {
  const unsubscribe = subscribeToResumeUpdates(() => {
    // Reload data
  });
  return unsubscribe;
}, []);
```

## Security Considerations

1. **XSS Protection**: All user input is escaped by React
2. **No Sensitive Data**: We don't store passwords or payment info
3. **CSP Ready**: No inline scripts or eval()

## Performance Optimizations

1. **Code Splitting**: Each route is a separate chunk
2. **Lazy Loading**: Templates loaded on demand
3. **Debounced Saves**: Prevents excessive writes
4. **Memoization**: Components memoized where beneficial

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13.1+
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment

### Static Export
```bash
npm run build
# Outputs to /dist
# Can be deployed to any static host
```

### Recommended Hosts
- Vercel (zero config)
- Netlify
- GitHub Pages
- Cloudflare Pages

---

## Future Considerations

If we add user accounts later:

```
Option 1: Keep localStorage primary, cloud as backup
  - Zero changes to current architecture
  - Sync on login
  - Fallback to local if offline

Option 2: Move to backend
  - More complex
  - Requires database
  - Better for multi-device
```

Recommendation: **Option 1** - keeps the simplicity while adding cloud backup.
