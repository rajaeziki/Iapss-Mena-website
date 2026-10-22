-- Run in the Supabase SQL editor AFTER 002_approval_and_content.sql.
-- Only facts confirmed in the partnership tracker / ICESCO report. Safe to re-run (no duplicates).
-- Check every line before running: this goes on the PUBLIC page.

insert into public.site_items (kind, title, subtitle, description, sort)
select * from (values
  ('team',    'Mohamed Aziz Cherni', 'Liaison Coordinator', '', 0),
  ('team',    'Rajae Ziki',          'Liaison Team',        '', 1),
  ('partner', 'American University of Sharjah', 'University', 'Signed a collaboration with IAPSS MENA.', 0),
  ('partner', 'International Studies Students Association (INSA)', 'Student association', 'Signed a collaboration with IAPSS MENA.', 1)
) as v(kind, title, subtitle, description, sort)
where not exists (
  select 1 from public.site_items s where s.kind = v.kind and s.title = v.title
);
