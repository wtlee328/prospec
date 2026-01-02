-- Rename search_criteria to input_criteria
ALTER TABLE public.runs RENAME COLUMN search_criteria TO input_criteria;

-- Add run_name column
ALTER TABLE public.runs ADD COLUMN run_name text;

-- Rename is_saved to saved
ALTER TABLE public.runs RENAME COLUMN is_saved TO saved;

-- Rename lead_count to number_of_leads
ALTER TABLE public.runs RENAME COLUMN lead_count TO number_of_leads;

-- Add new columns to leads table
ALTER TABLE public.leads ADD COLUMN city text;
ALTER TABLE public.leads ADD COLUMN state text;
ALTER TABLE public.leads ADD COLUMN country text;
ALTER TABLE public.leads ADD COLUMN company_domain text;
ALTER TABLE public.leads ADD COLUMN company_phone text;
ALTER TABLE public.leads ADD COLUMN company_website text;
ALTER TABLE public.leads ADD COLUMN keywords text;
ALTER TABLE public.leads ADD COLUMN seniority_level text;
ALTER TABLE public.leads ADD COLUMN functional_level text;
ALTER TABLE public.leads ADD COLUMN company_annual_revenue text;
ALTER TABLE public.leads ADD COLUMN company_size text;
