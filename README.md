# IAPSS platform

Next.js 14 + Supabase (Postgres, Auth, Realtime) + Claude-powered chatbot.

## Setup

1. Create a project at https://supabase.com.
2. In the Supabase **SQL editor**, paste and run `supabase/schema.sql`.
3. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project settings > API)
   - `ANTHROPIC_API_KEY` (optional, paid Claude API). Without it the chatbot answers from built-in IAPSS knowledge.
4. (Dev convenience) In Supabase **Authentication > Providers > Email**, turn off "Confirm email".
5. Run:

```bash
npm install
npm run dev
```

6. Open http://localhost:3000/signup. **The first account created becomes super admin.**

## Roles

| Role | Can do |
| --- | --- |
| Super admin | Create/delete groups, set leaders, add/remove members, create tasks anywhere, change roles (People page) |
| Group leader (set per group) | Add/remove members and create, assign, delete tasks in their group |
| Member | See their groups, move their own tasks, chat, personal to-do |

Permissions are enforced by Postgres row-level security in `schema.sql`, not just by the UI.

## Pages

`/` public site · `/login` `/signup` · `/dashboard` overview · `/dashboard/groups` (+ `[id]`: Kanban board, group chat, members) · `/dashboard/tasks` tracking · `/dashboard/chat` · `/dashboard/todo` · `/dashboard/people`
