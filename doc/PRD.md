Development Plan: Lead Crawling Web Application

1. Executive Summary Product Goal: Build a B2B lead generation platform that
   leverages Apify to crawl leads based on user criteria. Users utilize a credit
   system to pay for data. Key Mechanism: Crawl: User inputs criteria → System
   calls Apify Actor. Review: Leads are stored in a temporary "Archive" state.
   Action: User must "Save" runs to keep them permanently. Unsaved runs are
   auto-deleted after 3 days. Tech Stack: Frontend: Vercel (Next.js 14+ App
   Router, React, Tailwind CSS). Backend: Supabase (Auth, Postgres Database,
   Edge Functions). Crawler: Apify (Actor: IoSHqwTR9YGhzccez).
2. System Architecture The application follows a generic serverless architecture
   to ensure scalability and cost-efficiency. High-Level Data Flow Client:
   Submits search criteria via Server Action. Server (Next.js): Validates
   credits, logs the "Run" in Supabase, and triggers Apify via API. Apify:
   Executes the scraping job asynchronously. Sync (Webhook): When Apify
   finishes, it triggers a Next.js API Route (Webhook). Processing: Next.js
   fetches results, deducts credits, and inserts leads into Supabase. Cleanup:
   Supabase pg_cron checks daily for expired archived runs.
3. Database Schema (Supabase) We will use a relational structure. Key tables are
   profiles, runs, and leads. 3.1. Tables profiles (extends auth.users) Stores
   user-specific settings and credit balance. | Column | Type | Description | |
   :--- | :--- | :--- | | id | UUID | PK, References auth.users.id. | |
   credits_balance | Integer | Current available credits. Default: 0. | | tier |
   Text | 'free', 'pro' (for future billing logic). | | created_at | Timestamptz
   | | runs Represents a single search/crawl event. | Column | Type |
   Description | | :--- | :--- | :--- | | id | UUID | PK. | | user_id | UUID |
   FK -> profiles.id. | | apify_run_id | Text | The generic ID returned by
   Apify. | | status | Text | 'pending', 'running', 'completed', 'failed'. | |
   search_criteria| JSONB | Snapshot of filters used (City, Job, etc.). | |
   is_saved | Boolean | Default false. If true, protects from auto-deletion. | |
   archived_at | Timestamptz | Timestamp when the run finished. Null if running.
   | | expires_at | Timestamptz | Calculated: archived_at + 3 days. | |
   lead_count | Integer | Number of leads found. | | created_at | Timestamptz |
   | leads The actual data scraped. Linked to a run. | Column | Type |
   Description | | :--- | :--- | :--- | | id | UUID | PK. | | run_id | UUID | FK
   -> runs.id (ON DELETE CASCADE). | | user_id | UUID | FK -> profiles.id (For
   fast "search all" queries). | | first_name | Text | | | last_name | Text | |
   | email | Text | | | job_title | Text | Indexed for search. | | company_name
   | Text | Indexed for search. | | industry | Text | | | location | Text | | |
   linkedin_url | Text | | | raw_data | JSONB | Full payload from Apify (future
   proofing). | credit_logs Audit trail for credit usage. | Column | Type |
   Description | | :--- | :--- | :--- | | id | UUID | PK. | | user_id | UUID |
   FK -> profiles.id. | | amount | Integer | Negative for usage, positive for
   purchases. | | run_id | UUID | Optional FK -> runs.id. | | description | Text
   | "Run #XYZ deduction". |
4. API Integration (Apify) Target Actor: IoSHqwTR9YGhzccez (Note: Verify input
   schema in Apify Console). 4.1 Input Mapping The frontend form must map to the
   Actor's JSON input. code JSON // Example Actor Input Payload { "queries":
   ["Company Name"], // or specialized inputs based on docs "jobTitles": ["CEO",
   "Founder"], "locations": ["New York"], "industries": ["Software"],
   "maxItems": 50 // Limit to control credit usage } 4.2 Integration Flow
   (Webhook Pattern) Since scraping can take minutes, we cannot keep the HTTP
   request open. Start: Next.js calls
   apifyClient.actor('IoSHqwTR9YGhzccez').call(input, { webhooks: [...] }).
   Webhook Configuration: Pass a URL:
   https://your-app.com/api/webhooks/apify?secret=XYZ. Handler: Validates
   Secret. Fetches dataset items using
   apifyClient.dataset(defaultDatasetId).listItems(). Maps items to leads table
   schema. Inserts to Supabase. Updates runs status to 'completed'. Triggers
   Credit Deduction.
5. Feature Specifications 5.1 Usage & Credit Logic Pre-Check: When user clicks
   "Start", check profiles.credits_balance > 0. Display: Component in Navbar
   showing Balance: 120. Calculation: Assumption: 1 Lead = 1 Credit. Deduction
   happens after leads are successfully retrieved to ensure fairness. Warning:
   If credits < 10, show warning toast. 5.2 Archive & Auto-Deletion Logic: Runs
   are is_saved: false by default. Runs have an expires_at set to NOW() + 3 days
   upon completion. The "Sweeper" (Cleanup): Tool: Supabase pg_cron (if enabled)
   OR a Vercel Cron Job hitting a Supabase Edge Function. Query: code SQL DELETE
   FROM runs WHERE is_saved = false AND expires_at < NOW(); Note: Because leads
   table has ON DELETE CASCADE referencing runs, deleting the run automatically
   wipes the leads. 5.3 Search & Filtering Scope: User searches leads table.
   Filter Logic: UI sends filters: { job_title: 'Manager', saved_only: false }.
   Supabase Query: code SQL SELECT * FROM leads JOIN runs ON leads.run_id =
   runs.id WHERE leads.user_id = current_user_id AND ( runs.is_saved = true OR
   (runs.is_saved = false AND runs.expires_at > NOW()) ) AND leads.job_title
   ILIKE '%Manager%';
6. Frontend Pages & UX Reference: Prospec.io (Sidebar navigation, clean tables,
   white/gray minimalist theme). 6.1 Dashboard / Home Stats: "Total Leads
   Crawled", "Credits Left", "Runs in last 30 days". Quick Start: A prominent
   card or button to "Start New Search". 6.2 The "Finder" (New Crawl) Layout:
   Split screen. Left side = Inputs. Right side = Illustration/Console Output.
   Inputs: Job Title: Multi-select chips. Location: Country dropdown + City text
   input. Industry: Select list. Company Size: Range slider or checkboxes.
   Action: "Find Leads" (shows estimated credit cost if possible). 6.3 Run
   Management (The "Inbox") View: Table of Runs. Columns: Date, Search Criteria
   Summary, Lead Count, Status (Saved/Expiring in X days). Actions: Save:
   Toggles is_saved to true. Removes expiration timer. View Results: Navigates
   to Lead View. 6.4 Lead View (Results) Context: Shows leads specific to a Run
   OR "All Leads" view. Table: Name, Title, Company, Email (masked until clicked
   or fully visible), LinkedIn (icon). Export: CSV Export button (optional MVP
   feature).
7. Implementation Roadmap Phase 1: Foundation & Auth Initialize Next.js project.
   Setup Supabase client & Auth (Google/Email). Create Database Tables and RLS
   (Row Level Security) policies to ensure users only see their own data. Phase
   2: The Engine (Apify Integration) Build the startCrawl Server Action.
   Implement the Webhook endpoint /api/webhooks/apify. Test data ingestion from
   Apify to Supabase. Phase 3: The Manager (UI/UX) Build the "Finder" form.
   Build the "Runs" table. Implement the "Save" vs "Archive" toggle logic in the
   UI. Build the "Leads" data table with filters. Phase 4: Credits & Cleanup
   Implement pg_cron or Vercel Cron for deleting expired runs. Add logic to
   block runs if credits are low. Add Credit History view.
8. Assumptions & Risks Apify Cost: We assume the Actor allows setting a maxItems
   limit to prevent draining the user's credits in one go. Data Quality: We rely
   entirely on the Apify Actor for email/LinkedIn validity. Vercel Timeouts: We
   are using Webhooks to avoid 60s serverless timeouts. Database Size: If users
   crawl thousands of leads, leads table will grow fast. RLS and Indexing on
   user_id is critical for performance.
9. API & Secrets Checklist Ensure the following environment variables are set in
   Vercel: code Env NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... (For Webhook
   data insertion) APIFY_API_TOKEN=... APIFY_WEBHOOK_SECRET=...
