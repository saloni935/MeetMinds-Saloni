-- ============================================================
-- MeetMinds – Supabase Schema + Sample Data
-- Run this entire file in Supabase → SQL Editor → New query
-- ============================================================

-- 1. Create the events table
create table if not exists public.events (
  id           serial primary key,
  company      text    not null,                          -- Company / org name
  logo         text    not null,                          -- 1–2 char abbreviation shown on card
  color        text    not null,                          -- Brand hex color e.g. '#4285F4'
  type         text    not null
                 check (type in ('Workshop','Hackathon','Seminar')),
  mode         text    not null
                 check (mode in ('offline','virtual','hybrid')),
  title        text    not null,
  date         date    not null,                          -- YYYY-MM-DD
  time         text    not null,                          -- Display string e.g. '10:00 AM'
  venue        text    not null,
  distance     numeric default 0,                         -- km from city centre; 0 for online
  city         text    not null,                          -- Drives the city filter dropdown
  paid         boolean default false,
  price        integer default 0,                         -- INR; only matters when paid=true
  freebies     text[]  default '{}',                      -- e.g. ARRAY['Certificate','T-Shirt']
  eligibility  text[]  default '{}',                      -- e.g. ARRAY['CSE','IT','All Branches']
  link         text    not null,                          -- Registration / info URL
  tags         text[]  default '{}',                      -- Topic tags e.g. ARRAY['AI','ML']
  total_seats  integer not null,
  taken        integer default 0,
  created_at   timestamptz default now()
);

-- 2. Row-Level Security – anon key can only read; writes require service role
alter table public.events enable row level security;

drop policy if exists "Public read-only"   on public.events;
drop policy if exists "Anon insert"        on public.events;
drop policy if exists "Anon update"        on public.events;
drop policy if exists "Anon delete"        on public.events;

-- Read: everyone (including the public event listing)
create policy "Public read-only"
  on public.events for select
  using (true);

-- Write: anon key (lets the in-app admin panel create/edit/delete)
-- Restrict to auth.role() = 'authenticated' once you add login
create policy "Anon insert"
  on public.events for insert
  with check (true);

create policy "Anon update"
  on public.events for update
  using (true);

create policy "Anon delete"
  on public.events for delete
  using (true);

-- 3. Enable Realtime (broadcasts INSERT / UPDATE / DELETE to subscribers)
alter publication supabase_realtime add table public.events;


-- ============================================================
-- Sample data – 12 real-style events
-- Delete or modify freely; every change appears in the app live
-- ============================================================

insert into public.events
  (company, logo, color, type, mode, title, date, time,
   venue, distance, city, paid, price,
   freebies, eligibility, link, tags, total_seats, taken)
values

-- 1
('Google',    'G',  '#4285F4', 'Workshop',  'offline',
 'AI/ML Bootcamp 2025',
 '2025-06-10', '10:00 AM', 'JEC Auditorium, Jaipur',  2.1, 'Jaipur',
 false, 0,
 ARRAY['Certificate','Google Swag Kit','Lunch'],
 ARRAY['CSE','IT','ECE','All Branches'],
 'https://events.google.com', ARRAY['AI','ML'], 120, 83),

-- 2
('Microsoft', 'M',  '#00A4EF', 'Hackathon', 'offline',
 'Azure Cloud Challenge',
 '2025-06-14', '9:00 AM',  'MNIT, Jaipur',            4.5, 'Jaipur',
 false, 0,
 ARRAY['Certificate','Azure Credits','T-Shirt'],
 ARRAY['CSE','IT'],
 'https://microsoft.com/events', ARRAY['Cloud','Azure'], 200, 61),

-- 3
('Amazon',    'A',  '#FF9900', 'Seminar',   'virtual',
 'AWS re:Invent Student Day',
 '2025-06-20', '11:00 AM', 'Online (Zoom)',            0,   'Online',
 false, 0,
 ARRAY['Certificate','Amazon Gift Voucher'],
 ARRAY['All Branches'],
 'https://aws.amazon.com/events', ARRAY['Cloud','DevOps'], 300, 120),

-- 4
('IBM',       'I',  '#1F70C1', 'Workshop',  'offline',
 'Quantum Computing Intro',
 '2025-06-18', '2:00 PM',  'BITS Pilani, Pilani',     80,  'Pilani',
 true, 199,
 ARRAY['Certificate','IBM Badge'],
 ARRAY['CSE','ECE','Physics'],
 'https://ibm.com/events', ARRAY['Quantum','Research'], 60, 52),

-- 5
('Infosys',   'In', '#007CC3', 'Workshop',  'offline',
 'Full Stack Dev Sprint',
 '2025-06-08', '10:00 AM', 'Infosys Campus, Jaipur',  3.7, 'Jaipur',
 false, 0,
 ARRAY['Certificate','Infosys Goodie Bag','Snacks'],
 ARRAY['CSE','IT','All Branches'],
 'https://infosys.com/events', ARRAY['WebDev','MERN'], 150, 98),

-- 6
('TCS',       'T',  '#5B2D8E', 'Hackathon', 'hybrid',
 'TCS CodeVita Campus Edition',
 '2025-06-22', '8:00 AM',  'Rajasthan University + Online', 5.1, 'Jaipur',
 false, 0,
 ARRAY['Certificate','TCS Goodies','Cash Prize'],
 ARRAY['CSE','IT'],
 'https://tcs.com/codevita', ARRAY['Coding','Competitive'], 500, 211),

-- 7
('Wipro',     'W',  '#341C79', 'Seminar',   'virtual',
 'Cybersecurity Awareness Day',
 '2025-07-01', '10:00 AM', 'Online (Google Meet)',    0,   'Online',
 false, 0,
 ARRAY['Certificate','Pen Drive'],
 ARRAY['All Branches'],
 'https://wipro.com/events', ARRAY['Security','Cyber'], 250, 88),

-- 8
('Adobe',     'Ad', '#FF0000', 'Workshop',  'offline',
 'UX Design Fundamentals',
 '2025-06-25', '11:00 AM', 'IIT Jodhpur',             95,  'Jodhpur',
 true, 299,
 ARRAY['Certificate','Adobe Creative Cloud Trial','Tote Bag'],
 ARRAY['CSE','Design','All Branches'],
 'https://adobe.com/events', ARRAY['Design','UX'], 80, 71),

-- 9
('Qualcomm',  'Q',  '#3253DC', 'Workshop',  'offline',
 'Embedded Systems & IoT Bootcamp',
 '2025-06-12', '9:30 AM',  'Manipal University Jaipur', 7.2, 'Jaipur',
 false, 0,
 ARRAY['Certificate','IoT Kit','Snacks'],
 ARRAY['ECE','EE','CSE'],
 'https://qualcomm.com/events', ARRAY['IoT','Embedded'], 90, 34),

-- 10
('Meta',      'Me', '#1877F2', 'Hackathon', 'hybrid',
 'Open Source Contribution Sprint',
 '2025-07-05', '10:00 AM', 'Jaipur Innovation Hub + Online', 3.0, 'Jaipur',
 false, 0,
 ARRAY['Certificate','Meta Swag','Mentorship Session'],
 ARRAY['CSE','IT','All Branches'],
 'https://meta.com/events', ARRAY['OpenSource','Dev'], 200, 57),

-- 11
('NVIDIA',    'N',  '#76B900', 'Workshop',  'virtual',
 'Deep Learning with CUDA',
 '2025-06-28', '9:00 AM',  'Online (Teams)',           0,   'Online',
 true, 149,
 ARRAY['Certificate','NVIDIA Developer Kit'],
 ARRAY['CSE','IT','Data Science'],
 'https://nvidia.com/events', ARRAY['AI','GPU'], 75, 60),

-- 12
('Cisco',     'C',  '#1BA0D7', 'Seminar',   'offline',
 'Networking Fundamentals Day',
 '2025-06-30', '2:00 PM',  'Apex University, Jaipur', 4.9, 'Jaipur',
 false, 0,
 ARRAY['Certificate','Cisco NetAcad Access'],
 ARRAY['CSE','ECE','IT'],
 'https://cisco.com/events', ARRAY['Networking','CCNA'], 180, 43);
