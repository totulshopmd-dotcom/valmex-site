-- VALMEX Auto Lead Tracker: persistent lead inbox for website forms and chat.
create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('website_form','roof_calculator','facade_calculator','amk_calculator','contact_form','chat','other')),
  visitor_name text,
  phone text,
  locality text,
  service text,
  page_url text,
  conversation_id uuid references public.chat_conversations(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  status text not null default 'nou' check (status in ('nou','in_lucru','convertit','inchis')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create unique index if not exists lead_events_conversation_id_uidx
  on public.lead_events(conversation_id) where conversation_id is not null;
create index if not exists lead_events_created_at_idx on public.lead_events(created_at desc);
create index if not exists lead_events_status_idx on public.lead_events(status);
create index if not exists lead_events_source_idx on public.lead_events(source);

alter table public.lead_events enable row level security;
revoke all on public.lead_events from anon;
grant select, update on public.lead_events to authenticated;
grant all on public.lead_events to service_role;

drop policy if exists "Active employees view lead events" on public.lead_events;
create policy "Active employees view lead events"
  on public.lead_events for select to authenticated
  using ((select public.current_user_role()) is not null);

drop policy if exists "Sales and administrators update lead events" on public.lead_events;
create policy "Sales and administrators update lead events"
  on public.lead_events for update to authenticated
  using ((select public.current_user_role()) in ('administrator','vanzari'))
  with check ((select public.current_user_role()) in ('administrator','vanzari'));

create or replace function public.sync_chat_conversation_lead()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.lead_events (
    source, visitor_name, phone, service, conversation_id, details,
    created_at, updated_at, last_activity_at
  )
  values (
    'chat',
    nullif(trim(coalesce(new.visitor_name, '')), ''),
    nullif(trim(coalesce(new.visitor_phone, '')), ''),
    'Chat website',
    new.id,
    jsonb_build_object(
      'conversation_status', new.status,
      'visitor_email', new.visitor_email,
      'consent_at', new.consent_at
    ),
    coalesce(new.created_at, now()),
    now(),
    coalesce(new.last_message_at, new.created_at, now())
  )
  on conflict (conversation_id) where conversation_id is not null
  do update set
    visitor_name = coalesce(nullif(trim(excluded.visitor_name), ''), public.lead_events.visitor_name),
    phone = coalesce(nullif(trim(excluded.phone), ''), public.lead_events.phone),
    service = 'Chat website',
    details = public.lead_events.details || excluded.details,
    updated_at = now(),
    last_activity_at = greatest(public.lead_events.last_activity_at, excluded.last_activity_at);
  return new;
end;
$$;

revoke all on function public.sync_chat_conversation_lead() from public;
drop trigger if exists trg_sync_chat_conversation_lead on public.chat_conversations;
create trigger trg_sync_chat_conversation_lead
after insert or update on public.chat_conversations
for each row execute function public.sync_chat_conversation_lead();

-- Backfill existing chat threads so the tracker also shows conversations already received.
insert into public.lead_events (
  source, visitor_name, phone, service, conversation_id, details,
  created_at, updated_at, last_activity_at
)
select
  'chat',
  nullif(trim(coalesce(c.visitor_name, '')), ''),
  nullif(trim(coalesce(c.visitor_phone, '')), ''),
  'Chat website',
  c.id,
  jsonb_build_object('conversation_status', c.status, 'visitor_email', c.visitor_email, 'consent_at', c.consent_at),
  c.created_at,
  now(),
  coalesce(c.last_message_at, c.created_at, now())
from public.chat_conversations c
on conflict (conversation_id) where conversation_id is not null do nothing;
