-- Dev-friendly RLS policies to allow anon (no-auth) access via anon key.
-- Run this in Supabase SQL if you are not using auth.

-- Make the script re-runnable
DO $$
BEGIN
  -- personal_details
  EXECUTE 'DROP POLICY IF EXISTS "dev anon read personal_details" ON public.personal_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon insert personal_details" ON public.personal_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon update personal_details" ON public.personal_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon delete personal_details" ON public.personal_details';

  -- education_details
  EXECUTE 'DROP POLICY IF EXISTS "dev anon read education_details" ON public.education_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon insert education_details" ON public.education_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon update education_details" ON public.education_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon delete education_details" ON public.education_details';

  -- experience_details
  EXECUTE 'DROP POLICY IF EXISTS "dev anon read experience_details" ON public.experience_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon insert experience_details" ON public.experience_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon update experience_details" ON public.experience_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon delete experience_details" ON public.experience_details';

  -- project_details
  EXECUTE 'DROP POLICY IF EXISTS "dev anon read project_details" ON public.project_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon insert project_details" ON public.project_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon update project_details" ON public.project_details';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon delete project_details" ON public.project_details';

  -- skills
  EXECUTE 'DROP POLICY IF EXISTS "dev anon read skills" ON public.skills';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon insert skills" ON public.skills';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon update skills" ON public.skills';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon delete skills" ON public.skills';

  -- hobbies
  EXECUTE 'DROP POLICY IF EXISTS "dev anon read hobbies" ON public.hobbies';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon insert hobbies" ON public.hobbies';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon update hobbies" ON public.hobbies';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon delete hobbies" ON public.hobbies';

  -- certifications
  EXECUTE 'DROP POLICY IF EXISTS "dev anon read certifications" ON public.certifications';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon insert certifications" ON public.certifications';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon update certifications" ON public.certifications';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon delete certifications" ON public.certifications';

  -- languages
  EXECUTE 'DROP POLICY IF EXISTS "dev anon read languages" ON public.languages';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon insert languages" ON public.languages';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon update languages" ON public.languages';
  EXECUTE 'DROP POLICY IF EXISTS "dev anon delete languages" ON public.languages';
END $$;

-- Personal details
CREATE POLICY "dev anon read personal_details"
    ON public.personal_details FOR SELECT
    USING (true);

CREATE POLICY "dev anon insert personal_details"
    ON public.personal_details FOR INSERT
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon update personal_details"
    ON public.personal_details FOR UPDATE
    USING (true)
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon delete personal_details"
    ON public.personal_details FOR DELETE
    USING (true);

-- Education
CREATE POLICY "dev anon read education_details"
    ON public.education_details FOR SELECT
    USING (true);

CREATE POLICY "dev anon insert education_details"
    ON public.education_details FOR INSERT
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon update education_details"
    ON public.education_details FOR UPDATE
    USING (true)
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon delete education_details"
    ON public.education_details FOR DELETE
    USING (true);

-- Experience
CREATE POLICY "dev anon read experience_details"
    ON public.experience_details FOR SELECT
    USING (true);

CREATE POLICY "dev anon insert experience_details"
    ON public.experience_details FOR INSERT
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon update experience_details"
    ON public.experience_details FOR UPDATE
    USING (true)
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon delete experience_details"
    ON public.experience_details FOR DELETE
    USING (true);

-- Projects
CREATE POLICY "dev anon read project_details"
    ON public.project_details FOR SELECT
    USING (true);

CREATE POLICY "dev anon insert project_details"
    ON public.project_details FOR INSERT
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon update project_details"
    ON public.project_details FOR UPDATE
    USING (true)
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon delete project_details"
    ON public.project_details FOR DELETE
    USING (true);

-- Skills
CREATE POLICY "dev anon read skills"
    ON public.skills FOR SELECT
    USING (true);

CREATE POLICY "dev anon insert skills"
    ON public.skills FOR INSERT
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon update skills"
    ON public.skills FOR UPDATE
    USING (true)
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon delete skills"
    ON public.skills FOR DELETE
    USING (true);

-- Hobbies
CREATE POLICY "dev anon read hobbies"
    ON public.hobbies FOR SELECT
    USING (true);

CREATE POLICY "dev anon insert hobbies"
    ON public.hobbies FOR INSERT
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon update hobbies"
    ON public.hobbies FOR UPDATE
    USING (true)
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon delete hobbies"
    ON public.hobbies FOR DELETE
    USING (true);

-- Certifications
CREATE POLICY "dev anon read certifications"
    ON public.certifications FOR SELECT
    USING (true);

CREATE POLICY "dev anon insert certifications"
    ON public.certifications FOR INSERT
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon update certifications"
    ON public.certifications FOR UPDATE
    USING (true)
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon delete certifications"
    ON public.certifications FOR DELETE
    USING (true);

-- Languages
CREATE POLICY "dev anon read languages"
    ON public.languages FOR SELECT
    USING (true);

CREATE POLICY "dev anon insert languages"
    ON public.languages FOR INSERT
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon update languages"
    ON public.languages FOR UPDATE
    USING (true)
    WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "dev anon delete languages"
    ON public.languages FOR DELETE
    USING (true);

