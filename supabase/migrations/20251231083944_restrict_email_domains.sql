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
drop trigger if exists on_auth_user_signing_up on auth.users;
create trigger on_auth_user_signing_up
  before insert on auth.users
  for each row execute procedure public.validate_email_domain();
