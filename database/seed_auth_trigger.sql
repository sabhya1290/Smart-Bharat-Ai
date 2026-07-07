-- Smart Bharat AI — Supabase Auth Trigger
-- Run this in the Supabase SQL Editor ONCE after schema.sql.
-- It auto-creates a row in public.users whenever a new user signs up
-- via Supabase Auth (email or Google OAuth) so profile data is available.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (
    id,
    email,
    full_name,
    phone,
    password_hash
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    'supabase-auth'  -- placeholder; credentials are managed by Supabase Auth
  )
  on conflict (id) do nothing;  -- safe to re-run; won't overwrite existing rows
  return new;
end;
$$;

-- Drop existing trigger if present (idempotent)
drop trigger if exists on_auth_user_created on auth.users;

-- Fire after every new Supabase Auth user is inserted
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
