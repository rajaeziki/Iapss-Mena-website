-- Run in the Supabase SQL editor (after 002). Safe to re-run.
-- Partners confirmed in the partnership tracker (shown on the public page).
-- The leadership team is built into the website itself, so no team members are added here.
insert into public.site_items (kind, title, subtitle, description, sort)
select * from (values
  ('partner', 'American University of Sharjah', 'University', 'Signed a collaboration with IAPSS MENA.', 0),
  ('partner', 'International Studies Students Association (INSA)', 'Student association', 'Signed a collaboration with IAPSS MENA.', 1)
) as v(kind, title, subtitle, description, sort)
where not exists (
  select 1 from public.site_items s where s.kind = v.kind and s.title = v.title
);

-- Remove the two team members shown earlier under "The wider team".
delete from public.site_items where kind = 'team' and title in ('Mohamed Aziz Cherni', 'Rajae Ziki');
