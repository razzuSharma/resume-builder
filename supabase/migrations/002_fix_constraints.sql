-- ============================================
-- Fix Unique Constraints for Upsert Operations
-- ============================================

-- Add unique constraint on user_id for skills table
ALTER TABLE public.skills 
DROP CONSTRAINT IF EXISTS skills_user_id_unique;

ALTER TABLE public.skills 
ADD CONSTRAINT skills_user_id_unique UNIQUE (user_id);

-- Add unique constraint on user_id for hobbies table  
ALTER TABLE public.hobbies 
DROP CONSTRAINT IF EXISTS hobbies_user_id_unique;

ALTER TABLE public.hobbies 
ADD CONSTRAINT hobbies_user_id_unique UNIQUE (user_id);

-- Add unique constraint on user_id for personal_details table
ALTER TABLE public.personal_details 
DROP CONSTRAINT IF EXISTS personal_details_user_id_unique;

ALTER TABLE public.personal_details 
ADD CONSTRAINT personal_details_user_id_unique UNIQUE (user_id);

-- Add unique constraint on user_id for certifications table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'certifications') THEN
        ALTER TABLE public.certifications 
        DROP CONSTRAINT IF EXISTS certifications_user_id_unique;
        
        -- Note: certifications can have multiple per user, so we don't add unique here
        -- Instead, we'll handle it via the id column
    END IF;
END $$;

-- Add unique constraint on user_id for languages table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'languages') THEN
        ALTER TABLE public.languages 
        DROP CONSTRAINT IF EXISTS languages_user_id_unique;
        
        -- Note: languages can have multiple per user, so we don't add unique here
    END IF;
END $$;

-- ============================================
-- Alternative: Fix upsert to use ID instead of user_id for tables with multiple entries
-- ============================================

-- For education_details, experience_details, project_details which can have multiple entries per user
-- We'll keep using user_id but without ON CONFLICT - we'll handle duplicates differently

-- Create a function to handle upsert for array-type tables (skills, hobbies)
CREATE OR REPLACE FUNCTION upsert_skills(
    p_user_id TEXT,
    p_skills JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.skills (user_id, skills)
    VALUES (p_user_id, p_skills)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        skills = EXCLUDED.skills,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION upsert_hobbies(
    p_user_id TEXT,
    p_hobbies JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.hobbies (user_id, hobbies)
    VALUES (p_user_id, p_hobbies)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        hobbies = EXCLUDED.hobbies,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Fix: Allow multiple entries for related tables
-- ============================================

-- For tables that can have multiple entries (education, experience, projects),
-- we need to handle them differently - delete existing and insert new

-- Create function to handle education upsert
CREATE OR REPLACE FUNCTION upsert_education(
    p_user_id TEXT,
    p_educations JSONB
) RETURNS VOID AS $$
BEGIN
    -- Delete existing education entries for this user
    DELETE FROM public.education_details WHERE user_id = p_user_id;
    
    -- Insert new entries
    INSERT INTO public.education_details (
        user_id, school_name, degree, field_of_study, 
        start_date, end_date, present, gpa, description
    )
    SELECT 
        p_user_id,
        (edu->>'school_name')::TEXT,
        (edu->>'degree')::TEXT,
        (edu->>'field_of_study')::TEXT,
        (edu->>'start_date')::DATE,
        CASE WHEN edu->>'end_date' = 'null' OR edu->>'end_date' IS NULL 
             THEN NULL 
             ELSE (edu->>'end_date')::DATE 
        END,
        (edu->>'present')::BOOLEAN,
        (edu->>'gpa')::TEXT,
        (edu->>'description')::TEXT
    FROM jsonb_array_elements(p_educations) AS edu;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle experience upsert
CREATE OR REPLACE FUNCTION upsert_experience(
    p_user_id TEXT,
    p_experiences JSONB
) RETURNS VOID AS $$
BEGIN
    -- Delete existing experience entries for this user
    DELETE FROM public.experience_details WHERE user_id = p_user_id;
    
    -- Insert new entries
    INSERT INTO public.experience_details (
        user_id, company_name, position, location,
        start_date, end_date, present, responsibilities, achievements
    )
    SELECT 
        p_user_id,
        (exp->>'company_name')::TEXT,
        (exp->>'position')::TEXT,
        (exp->>'location')::TEXT,
        (exp->>'start_date')::DATE,
        CASE WHEN exp->>'end_date' = 'null' OR exp->>'end_date' IS NULL 
             THEN NULL 
             ELSE (exp->>'end_date')::DATE 
        END,
        (exp->>'present')::BOOLEAN,
        ARRAY(SELECT jsonb_array_elements_text(exp->'responsibilities')),
        ARRAY(SELECT jsonb_array_elements_text(exp->'achievements'))
    FROM jsonb_array_elements(p_experiences) AS exp;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle projects upsert
CREATE OR REPLACE FUNCTION upsert_projects(
    p_user_id TEXT,
    p_projects JSONB
) RETURNS VOID AS $$
BEGIN
    -- Delete existing project entries for this user
    DELETE FROM public.project_details WHERE user_id = p_user_id;
    
    -- Insert new entries
    INSERT INTO public.project_details (
        user_id, name, start_date, end_date, present,
        link, github_link, description, technologies
    )
    SELECT 
        p_user_id,
        (proj->>'name')::TEXT,
        (proj->>'start_date')::DATE,
        CASE WHEN proj->>'end_date' = 'null' OR proj->>'end_date' IS NULL 
             THEN NULL 
             ELSE (proj->>'end_date')::DATE 
        END,
        (proj->>'present')::BOOLEAN,
        (proj->>'link')::TEXT,
        (proj->>'github_link')::TEXT,
        (proj->>'description')::TEXT,
        ARRAY(SELECT jsonb_array_elements_text(proj->'technologies'))
    FROM jsonb_array_elements(p_projects) AS proj;
END;
$$ LANGUAGE plpgsql;
