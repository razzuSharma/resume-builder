# Resume Artisan

A modern, professional resume builder built with Next.js, TypeScript, Tailwind CSS, and Supabase.

![Resume Artisan](public/ResumeArtisan.jpeg)

## Features

- ✨ **Beautiful, Modern UI** - Clean, professional design with smooth animations
- 📝 **Multi-Step Form** - Easy-to-use wizard for entering resume details
- 🎨 **Real-time Preview** - See your resume as you build it
- 📄 **PDF Export** - Download your resume as a high-quality PDF
- 📸 **Profile Image Upload** - Add a professional photo to your resume
- 💾 **Auto-Save** - Data persists in localStorage and Supabase
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🎯 **Form Validation** - Client-side validation with helpful error messages
- ♿ **Accessible** - Built with accessibility in mind
- 🔒 **Row Level Security** - Your data is protected with Supabase RLS

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI, Lucide React icons
- **State Management:** Redux Toolkit
- **Forms:** Formik + Yup validation
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage
- **PDF Generation:** html2canvas + jsPDF

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/resume-artisan.git
cd resume-artisan
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Supabase Setup

### Step 1: Create a Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note your project URL and anon key (in Project Settings → API)

### Step 2: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"

This creates all necessary tables:
- `personal_details` - User profile info
- `education_details` - Education history
- `experience_details` - Work experience
- `project_details` - Personal/professional projects
- `skills` - Technical/professional skills
- `hobbies` - Personal interests
- `certifications` - Professional certifications
- `languages` - Language proficiencies

### Step 3: Set Up Storage Buckets

For file uploads (profile images, certificates, etc.):

1. Go to **Storage** in your Supabase dashboard
2. Create these buckets (set to Public):
   - `profiles` - Profile pictures
   - `resumes` - Resume PDF exports
   - `projects` - Project screenshots
   - `certificates` - Certificate images

Detailed setup instructions: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## Project Structure

```
app/
├── components/          # Reusable components
│   ├── Button.tsx      # Button component with variants
│   ├── Footer.tsx      # Site footer
│   ├── ResumeLayout.tsx # Resume display component
│   └── SuccessMessageToast.tsx
├── pages/              # Form step components
│   ├── PersonalDetails.tsx    # Profile photo upload
│   ├── EducationDetails.tsx
│   ├── ExperienceDetails.tsx
│   ├── ProjectDetails.tsx
│   ├── SkillsDetails.tsx
│   └── HobbiesDetails.tsx
├── types/              # TypeScript type definitions
│   └── index.ts        # All data types
├── redux/              # Redux store configuration
│   ├── features/
│   │   └── dataSlice.ts
│   ├── hooks.ts
│   ├── provider.tsx
│   └── store.ts
├── utils/              # Utility functions
│   ├── supabaseClient.ts      # Supabase client setup
│   ├── supabaseUtils.ts       # Database operations
│   ├── fetchDataFromTables.ts # Data fetching
│   ├── fileUpload.ts          # File upload utilities
│   └── validationSchemas.ts   # Form validation
├── contact-us/
│   └── page.tsx
├── create-resume/
│   └── page.tsx       # Main resume builder page
├── navbar/
│   └── page.tsx       # Navigation component
├── resume/
│   └── page.tsx       # Resume preview & download page
├── layout.tsx         # Root layout
└── page.tsx           # Home page

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema
```

## Form Sections

1. **Personal Details** - Name, contact info, summary, profile photo
2. **Education** - Schools, degrees, GPAs, certificates
3. **Work Experience** - Companies, positions, responsibilities, achievements
4. **Projects** - Personal/professional projects with links, technologies
5. **Hobbies** - Personal interests
6. **Skills** - Technical and professional skills

## File Upload Features

### Profile Image
- Supported formats: JPG, PNG, GIF, WebP
- Max size: 2MB
- Displayed in resume header

### Project Screenshots (Optional)
- Can be added to showcase projects
- Stored in `projects` bucket

### Certificate Images (Optional)
- Can be added to education/certifications
- Stored in `certificates` bucket

## Building for Production

```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |

## Database Schema

All tables use:
- **UUID** for primary keys
- **user_id** for linking data to users
- **created_at** and **updated_at** timestamps
- **Row Level Security (RLS)** policies for data protection
- **Foreign key constraints** with CASCADE delete

See `supabase/migrations/001_initial_schema.sql` for complete schema.

## Customization

### Colors

The app uses Tailwind CSS with custom gradients. Each form section has its own color theme:

| Section | Colors |
|---------|--------|
| Personal | Teal → Cyan |
| Education | Purple → Pink |
| Experience | Amber → Orange |
| Projects | Emerald → Teal |
| Hobbies | Pink → Rose |
| Skills | Blue → Indigo |

### Fonts

Fonts are configured in `app/fonts.ts`. The app uses:
- Inter (body text)
- Roboto Mono (headings)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### "Supabase URL and Anon Key are required"
Make sure your `.env.local` file is properly set up and restart the dev server.

### "Permission denied for table"
The RLS policies might not be applied. Re-run the migration SQL.

### "Bucket not found" when uploading files
Ensure storage buckets are created in Supabase Storage.

### Profile image doesn't display
Check that:
1. The `profiles` bucket is set to Public
2. The image URL is being saved to `personal_details.profile_image_url`

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!

---

Made with ❤️ by [Raju Sharma](https://rajusarma.com.np/)
