-- Optional cleanup (safe to run, safe to re-run).
-- The Chair, Deputy Chair and Media Director are now shown by the website itself (bilingual, from the official IAPSS MENA site),
-- so this removes the earlier database copy of the Chair to avoid a duplicate card.
delete from public.site_items where kind = 'team' and title = 'Mohanad Albayati';
