
-- 1. Add missing columns to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS mobile_number text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS personal_email text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS headline text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_linkedin text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_description text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_annual_revenue_clean text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_total_funding text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_total_funding_clean text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_technologies text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company_founded_year text;

-- 2. Add missing RLS policies for leads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leads' AND policyname = 'Users can insert own leads'
    ) THEN
        CREATE POLICY "Users can insert own leads" ON public.leads
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Add missing RLS policies for credit_logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'credit_logs' AND policyname = 'Users can insert own credit logs'
    ) THEN
        CREATE POLICY "Users can insert own credit logs" ON public.credit_logs
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
