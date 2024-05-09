-- Custom Claims & Role-based Access Control (RBAC)
-- https://supabase.com/docs/guides/auth/custom-claims-and-role-based-access-control-rbac

drop table if exists role_permissions;
drop table if exists user_roles;

-- drop type if exists public.user_permission;
-- drop type if exists public.user_role;
-- create type public.user_permission as enum ('posts.delete');
-- create type public.user_role as enum ('guest', 'user', 'admin', 'superadmin');
-- alter type public.type_name add value 'new_type';
-- alter type public.type_name rename value 'old_type' to 'new_type';
-- alter type public.type_name rename to new_type_name;

create table user_roles (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade not null,
  role text default 'guest'::text not null,
  unique (user_id, role)
);
comment on column user_roles.role is 'guest, user, admin, superadmin';

-- Secure the table
alter table user_roles enable row level security;

-- Add row-level security
create policy "Users can view their roles." on user_roles for select to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can insert their own role." on user_roles for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "Users can update their own role." on user_roles for update to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can delete their own role." on user_roles for delete to authenticated using ( (select auth.uid()) = user_id );

-- Update a column timestamp on every update.
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "user_roles", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
drop trigger if exists handle_updated_at on user_roles;

create trigger handle_updated_at before update on user_roles
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create table role_permissions (
  id bigint generated by default as identity primary key,
  role text not null,
  permission text not null,
  unique (role, permission)
);
