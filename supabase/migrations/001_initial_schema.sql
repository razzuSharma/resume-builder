-- ============================================
-- Resume Artisan - Initial Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STORAGE BUCKETS SETUP
-- Run these in Supabase Dashboard > Storage
-- Or use the Storage API
-- ============================================

-- Note: Buckets need to be created via the UI or Storage API
-- Go to Supabase Dashboard > Storage > New Bucket
-- Create bucket named: 'resumes' (for PDF uploads)
-- Create bucket named: 'profiles' (for profile pictures)
-- Set both to 'public' for easy access

-- ============================================
-- TABLES
-- ============================================

-- 1. Personal Details Table
CREATE TABLE IF NOT EXISTS public.personal_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT,
    summary TEXT,
    linkedin TEXT,
    website TEXT,
    github TEXT,
    profile_image_url TEXT,
    resume_pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Education Details Table
CREATE TABLE IF NOT EXISTS public.education_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    school_name TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    present BOOLEAN DEFAULT FALSE,
    gpa TEXT,
    description TEXT,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT education_user_fk FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE
);

-- 3. Experience Details Table
CREATE TABLE IF NOT EXISTS public.experience_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    position TEXT NOT NULL,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    present BOOLEAN DEFAULT FALSE,
    responsibilities TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    company_logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT experience_user_fk FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE
);

-- 4. Project Details Table
CREATE TABLE IF NOT EXISTS public.project_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    present BOOLEAN DEFAULT FALSE,
    link TEXT,
    github_link TEXT,
    description TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    project_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT project_user_fk FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    skills JSONB NOT NULL DEFAULT '[]',
    categories JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT skills_user_fk FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE
);

-- 6. Hobbies/Interests Table
CREATE TABLE IF NOT EXISTS public.hobbies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    hobbies JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT hobbies_user_fk FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE
);

-- 7. Certifications Table (Bonus)
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id TEXT,
    credential_url TEXT,
    certificate_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT certification_user_fk FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE
);

-- 8. Languages Table (Bonus)
CREATE TABLE IF NOT EXISTS public.languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    language TEXT NOT NULL,
    proficiency TEXT NOT NULL, -- Native, Fluent, Conversational, Basic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT language_user_fk FOREIGN KEY (user_id) REFERENCES public.personal_details(user_id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_education_user_id ON public.education_details(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_user_id ON public.experience_details(user_id);
CREATE INDEX IF NOT EXISTS idx_project_user_id ON public.project_details(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS idx_hobbies_user_id ON public.hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON public.certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_languages_user_id ON public.languages(user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_personal_details_updated_at
    BEFORE UPDATE ON public.personal_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_details_updated_at
    BEFORE UPDATE ON public.education_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_details_updated_at
    BEFORE UPDATE ON public.experience_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_details_updated_at
    BEFORE UPDATE ON public.project_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hobbies_updated_at
    BEFORE UPDATE ON public.hobbies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
    BEFORE UPDATE ON public.certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own personal details" 
    ON public.personal_details FOR SELECT 
    USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can read own education" 
    ON public.education_details FOR SELECT 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can read own experience" 
    ON public.experience_details FOR SELECT 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can read own projects" 
    ON public.project_details FOR SELECT 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can read own skills" 
    ON public.skills FOR SELECT 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can read own hobbies" 
    ON public.hobbies FOR SELECT 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can read own certifications" 
    ON public.certifications FOR SELECT 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can read own languages" 
    ON public.languages FOR SELECT 
    USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own personal details" 
    ON public.personal_details FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can insert own education" 
    ON public.education_details FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own experience" 
    ON public.experience_details FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own projects" 
    ON public.project_details FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own skills" 
    ON public.skills FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own hobbies" 
    ON public.hobbies FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own personal details" 
    ON public.personal_details FOR UPDATE 
    USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can update own education" 
    ON public.education_details FOR UPDATE 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own experience" 
    ON public.experience_details FOR UPDATE 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own projects" 
    ON public.project_details FOR UPDATE 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own skills" 
    ON public.skills FOR UPDATE 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own hobbies" 
    ON public.hobbies FOR UPDATE 
    USING (auth.uid()::text = user_id);

-- Policy: Users can delete their own data
CREATE POLICY "Users can delete own personal details" 
    ON public.personal_details FOR DELETE 
    USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can delete own education" 
    ON public.education_details FOR DELETE 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own experience" 
    ON public.experience_details FOR DELETE 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own projects" 
    ON public.project_details FOR DELETE 
    USING (auth.uid()::text = user_id);

-- ============================================
-- STORAGE BUCKET POLICIES (Run after creating buckets)
-- ============================================

-- For 'profiles' bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Anyone can upload an avatar" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'profiles');

CREATE POLICY "Anyone can update their own avatar" ON storage.objects
    FOR UPDATE USING (bucket_id = 'profiles');

-- For 'resumes' bucket
CREATE POLICY "Resume PDFs are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can upload a resume PDF" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- For 'projects' bucket
CREATE POLICY "Project images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY "Anyone can upload project images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'projects');

-- For 'certificates' bucket
CREATE POLICY "Certificates are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'certificates');

CREATE POLICY "Anyone can upload certificates" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'certificates');
