# Supabase Setup Guide for Resume Artisan

This guide will walk you through setting up Supabase for your Resume Artisan application.

## Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Your Resume Artisan project ready

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project name (e.g., "resume-artisan")
5. Set a secure database password
6. Choose your region (closest to your users)
7. Click "Create new project"

## Step 2: Get Your API Credentials

1. Once your project is created, go to **Project Settings** → **API**
2. Copy the following values:
   - `URL` (Project URL) → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` (API Key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"

This will create all necessary tables with:
- Proper data types
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps

## Step 4: Set Up Storage Buckets

Your app needs storage buckets for file uploads. Set them up:

### Method 1: Via Dashboard (Recommended for beginners)

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:

| Bucket Name | Public Access | Purpose |
|-------------|---------------|---------|
| `profiles` | ✅ Yes | Profile pictures |
| `resumes` | ✅ Yes | Resume PDF exports |
| `projects` | ✅ Yes | Project screenshots |
| `certificates` | ✅ Yes | Certificate images |

3. For each bucket:
   - Click "New bucket"
   - Enter the bucket name
   - Check "Public bucket"
   - Click "Save"

### Method 2: Via SQL (For automation)

Run this SQL in the SQL Editor (note: bucket policies are included in the migration):

```sql
-- Create buckets
insert into storage.buckets (id, name, public) 
values 
  ('profiles', 'profiles', true),
  ('resumes', 'resumes', true),
  ('projects', 'projects', true),
  ('certificates', 'certificates', true);
```

## Step 5: Verify Setup

Test your setup by running the development server:

```bash
npm run dev
```

Go to `http://localhost:3000/create-resume` and try:
1. Filling out the personal details form
2. Uploading a profile picture
3. Saving the form
4. Checking if data appears in your Supabase tables

## Database Schema Overview

### Tables Created

| Table | Purpose |
|-------|---------|
| `personal_details` | User profile info, contact details, profile image |
| `education_details` | Schools, degrees, fields of study |
| `experience_details` | Work history, responsibilities |
| `project_details` | Personal/professional projects |
| `skills` | Technical/professional skills |
| `hobbies` | Personal interests |
| `certifications` | Professional certifications |
| `languages` | Language proficiencies |

### Key Features

- **Foreign Keys**: All tables link to `personal_details(user_id)` with CASCADE delete
- **Auto Timestamps**: `created_at` and `updated_at` auto-managed by triggers
- **RLS Policies**: Users can only access their own data
- **JSONB Fields**: Skills and hobbies stored as JSON for flexibility

## Common Issues & Solutions

### Issue: "Supabase URL and Anon Key are required"

**Solution**: Make sure your `.env.local` file is properly set up and restart your dev server.

### Issue: "Permission denied for table"

**Solution**: The RLS policies might not be applied. Re-run the migration SQL or check RLS settings in Table Editor.

### Issue: "Bucket not found" when uploading files

**Solution**: Ensure storage buckets are created in Step 4. Bucket names must match exactly: `profiles`, `resumes`, `projects`, `certificates`.

### Issue: Files upload but don't display

**Solution**: Check that buckets are set to "Public" and the RLS policies for storage are applied.

## Advanced: Environment-Specific Setup

### Development

```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-key
```

### Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-key
```

## Backup & Migrations

### Export Schema

```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

### Reset Database

⚠️ **Warning**: This deletes all data!

In SQL Editor:
```sql
drop schema public cascade;
create schema public;
-- Re-run migration SQL
```

## Next Steps

1. **Authentication** (Optional): Set up Supabase Auth for user accounts
2. **Edge Functions** (Optional): Create serverless functions for advanced features
3. **Realtime** (Optional): Enable realtime subscriptions for collaborative editing

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Note**: The SQL migration script includes all necessary setup. If you run into any issues, make sure you've run the complete migration without errors.
