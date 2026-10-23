-- Run in the Supabase SQL editor (after 004). Safe to re-run.
-- 1) allow a "news" kind of public content (the News section of the site)
alter table public.site_items drop constraint if exists site_items_kind_check;
alter table public.site_items
  add constraint site_items_kind_check check (kind in ('team','partner','project','news'));

-- 2) Best Diplomats: IAPSS MENA member-benefit collaboration (from the official IAPSS MENA site)
insert into public.site_items (kind, title, subtitle, description, link, sort)
select 'partner', 'Best Diplomats', 'Member benefit collaboration',
       'Eligible IAPSS MENA members can request discounted rates for the Best Diplomats Türkiye Conference and UN Immersion Program. Programs are run independently by Best Diplomats.',
       '', 2
where not exists (select 1 from public.site_items where kind = 'partner' and title = 'Best Diplomats');

-- 3) website for the American University of Sharjah (from the partnership tracker), so its logo shows on the site
update public.site_items set link = 'https://www.aus.edu'
where kind = 'partner' and title = 'American University of Sharjah' and link = '';
