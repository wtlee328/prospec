-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, service_role;

-- Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  credits_balance integer default 0,
  tier text check (tier in ('free', 'pro')) default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Runs Table
create table public.runs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  apify_run_id text,
  status text check (status in ('pending', 'running', 'completed', 'failed')),
  search_criteria jsonb,
  is_saved boolean default false,
  archived_at timestamp with time zone,
  expires_at timestamp with time zone,
  lead_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.runs enable row level security;
create policy "Users can view own runs" on runs for select using (auth.uid() = user_id);
create policy "Users can insert own runs" on runs for insert with check (auth.uid() = user_id);
create policy "Users can update own runs" on runs for update using (auth.uid() = user_id);
create policy "Users can delete own runs" on runs for delete using (auth.uid() = user_id);

-- Leads Table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  run_id uuid references public.runs(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  first_name text,
  last_name text,
  email text,
  job_title text,
  company_name text,
  industry text,
  location text,
  linkedin_url text,
  raw_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.leads enable row level security;
create policy "Users can view own leads" on leads for select using (auth.uid() = user_id);

-- Credit Logs Table
create table public.credit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  amount integer not null,
  run_id uuid references public.runs(id),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.credit_logs enable row level security;
create policy "Users can view own credit logs" on credit_logs for select using (auth.uid() = user_id);

-- Indexes
create index leads_job_title_idx on leads (job_title);
create index leads_company_name_idx on leads (company_name);
create index leads_user_id_idx on leads (user_id);
create index runs_user_id_idx on runs (user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, credits_balance, tier)
  values (new.id, 0, 'free');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to validate email domain
create or replace function public.validate_email_domain()
returns trigger as $$
begin
  if (new.email !~* '@(arktop\.com|crownsync\.ai)$') then
    raise exception 'Registration is restricted to authorized domains only.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for email domain validation
create trigger on_auth_user_signing_up
  before insert on auth.users
  for each row execute procedure public.validate_email_domain();

-- RPC for credit deduction
create or replace function public.deduct_credits(
  p_user_id uuid,
  p_amount integer
) returns void as $$
begin
  update public.profiles
  set credits_balance = credits_balance - p_amount
  where id = p_user_id;
end;
$$ language plpgsql security definer;
