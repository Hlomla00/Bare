-- ============================================================
-- Bare — Gym Slot Marketplace
-- Initial Schema Migration
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
create table if not exists public.users (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text unique not null,
  phone        text,
  avatar_url   text,
  subscription_tier text not null default 'none'
    check (subscription_tier in ('none','starter','explorer','active','daily')),
  credits_remaining int not null default 0,
  vitality_id  text,
  location_suburb text,
  created_at   timestamptz not null default now()
);

alter table public.users enable row level security;
create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- ============================================================
-- GYMS
-- ============================================================
create table if not exists public.gyms (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid references public.users(id) on delete cascade,
  name          text not null,
  description   text,
  suburb        text not null,
  lat           double precision,
  lng           double precision,
  address       text,
  photos        text[] default '{}',
  amenities     text[] default '{}',
  vibe_tags     text[] default '{}',
  has_generator boolean default false,
  parking       boolean default false,
  verified      boolean default false,
  bare_score    numeric(3,1) default 0,
  created_at    timestamptz not null default now()
);

alter table public.gyms enable row level security;
create policy "Anyone can read gyms" on public.gyms
  for select using (true);
create policy "Partners manage own gym" on public.gyms
  for all using (auth.uid() = owner_id);

-- ============================================================
-- SLOTS
-- ============================================================
create table if not exists public.slots (
  id               uuid primary key default uuid_generate_v4(),
  gym_id           uuid references public.gyms(id) on delete cascade,
  class_type       text not null,
  title            text not null,
  start_time       timestamptz not null,
  end_time         timestamptz not null,
  total_capacity   int not null,
  bare_allocation  int not null,
  spots_remaining  int not null,
  price            int not null,  -- ZAR cents or whole rand
  is_flash         boolean default false,
  flash_expires_at timestamptz,
  status           text not null default 'open'
    check (status in ('open','full','cancelled','completed')),
  created_at       timestamptz not null default now(),
  constraint spots_within_allocation check (spots_remaining >= 0 and spots_remaining <= bare_allocation)
);

alter table public.slots enable row level security;
create policy "Anyone can read open slots" on public.slots
  for select using (true);
create policy "Partners manage own slots" on public.slots
  for all using (
    auth.uid() = (select owner_id from public.gyms where id = slots.gym_id)
  );

-- Index for fast discovery queries
create index if not exists slots_gym_status_start on public.slots(gym_id, status, start_time);
create index if not exists slots_flash on public.slots(is_flash, flash_expires_at) where is_flash = true;

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists public.bookings (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.users(id) on delete cascade,
  slot_id       uuid references public.slots(id) on delete restrict,
  gym_id        uuid references public.gyms(id) on delete restrict,
  status        text not null default 'confirmed'
    check (status in ('confirmed','checked_in','no_show','cancelled')),
  amount_paid   int not null,
  gym_payout    int not null,  -- 80% of amount_paid
  qr_code       text unique not null,
  checked_in_at timestamptz,
  created_at    timestamptz not null default now()
);

alter table public.bookings enable row level security;
create policy "Users read own bookings" on public.bookings
  for select using (auth.uid() = user_id);
create policy "Partners read gym bookings" on public.bookings
  for select using (
    auth.uid() = (select owner_id from public.gyms where id = bookings.gym_id)
  );
create policy "Users create bookings" on public.bookings
  for insert with check (auth.uid() = user_id);
create policy "Partners update check-in" on public.bookings
  for update using (
    auth.uid() = (select owner_id from public.gyms where id = bookings.gym_id)
  );

create index if not exists bookings_user on public.bookings(user_id, created_at desc);
create index if not exists bookings_slot on public.bookings(slot_id);

-- Trigger: decrement spots_remaining on new confirmed booking
create or replace function public.decrement_slot_spots()
returns trigger language plpgsql security definer as $$
begin
  update public.slots
  set
    spots_remaining = spots_remaining - 1,
    status = case when spots_remaining - 1 = 0 then 'full' else status end
  where id = NEW.slot_id
    and spots_remaining > 0;

  if not found then
    raise exception 'No spots remaining for this slot';
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_booking_created on public.bookings;
create trigger on_booking_created
  after insert on public.bookings
  for each row execute function public.decrement_slot_spots();

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists public.subscriptions (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references public.users(id) on delete cascade,
  tier             text not null check (tier in ('starter','explorer','active','daily')),
  visits_included  int not null,
  visits_used      int not null default 0,
  billing_date     date not null,
  status           text not null default 'active'
    check (status in ('active','cancelled','expired')),
  created_at       timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
create policy "Users read own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ============================================================
-- FRIENDSHIPS
-- ============================================================
create table if not exists public.friendships (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id) on delete cascade,
  friend_id  uuid references public.users(id) on delete cascade,
  status     text not null default 'pending'
    check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  unique(user_id, friend_id)
);

alter table public.friendships enable row level security;
create policy "Users manage own friendships" on public.friendships
  for all using (auth.uid() = user_id or auth.uid() = friend_id);

-- ============================================================
-- ACTIVE SESSIONS (drives the Active Dot system)
-- ============================================================
create table if not exists public.active_sessions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id) on delete cascade,
  gym_id     uuid references public.gyms(id) on delete cascade,
  started_at timestamptz not null default now(),
  is_live    boolean not null default true
);

alter table public.active_sessions enable row level security;
-- Friends can read each other's live sessions
create policy "Accepted friends can see sessions" on public.active_sessions
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and (
          (f.user_id = auth.uid() and f.friend_id = active_sessions.user_id)
          or (f.friend_id = auth.uid() and f.user_id = active_sessions.user_id)
        )
    )
  );
create policy "Users manage own sessions" on public.active_sessions
  for all using (auth.uid() = user_id);

create index if not exists active_sessions_live on public.active_sessions(is_live, started_at desc) where is_live = true;

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade,
  gym_id      uuid references public.gyms(id) on delete cascade,
  booking_id  uuid references public.bookings(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  body        text,
  created_at  timestamptz not null default now(),
  unique(user_id, booking_id)
);

alter table public.reviews enable row level security;
create policy "Anyone can read reviews" on public.reviews for select using (true);
create policy "Users write own reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- Trigger: update bare_score on new review
create or replace function public.update_bare_score()
returns trigger language plpgsql security definer as $$
begin
  update public.gyms
  set bare_score = (
    select round(avg(rating)::numeric, 1)
    from public.reviews
    where gym_id = NEW.gym_id
  )
  where id = NEW.gym_id;
  return NEW;
end;
$$;

drop trigger if exists on_review_created on public.reviews;
create trigger on_review_created
  after insert on public.reviews
  for each row execute function public.update_bare_score();

-- ============================================================
-- GYM EARNINGS
-- ============================================================
create table if not exists public.gym_earnings (
  id          uuid primary key default uuid_generate_v4(),
  gym_id      uuid references public.gyms(id) on delete cascade,
  booking_id  uuid references public.bookings(id) on delete cascade,
  amount      int not null,  -- 80% of booking amount_paid
  status      text not null default 'pending'
    check (status in ('pending','paid_out')),
  paid_out_at timestamptz
);

alter table public.gym_earnings enable row level security;
create policy "Partners read own earnings" on public.gym_earnings
  for select using (
    auth.uid() = (select owner_id from public.gyms where id = gym_earnings.gym_id)
  );

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users(id) on delete cascade,
  type       text not null
    check (type in ('flash_slot','booking_confirmed','friend_live','check_in_reminder','payout')),
  title      text not null,
  body       text not null,
  data       jsonb default '{}',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
create policy "Users read own notifications" on public.notifications
  for select using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

create index if not exists notifications_user_unread on public.notifications(user_id, read, created_at desc);

-- ============================================================
-- REALTIME — enable for live slot counters and active dots
-- ============================================================
alter publication supabase_realtime add table public.slots;
alter publication supabase_realtime add table public.active_sessions;
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.notifications;
