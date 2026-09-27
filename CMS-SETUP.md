# mobeats Music CMS — Setup

## 1. Supabase verbinden
In `supabase-config.js` eintragen:
- `supabaseUrl`
- `supabasePublishableKey`

Supabase's browser client uses the project URL and publishable key. Keep secret/service-role keys out of GitHub Pages.

## 2. Datenbank
Den kompletten Inhalt von `supabase-schema.sql` im Supabase SQL Editor ausführen.

## 3. Admin
In Supabase Authentication einen Benutzer mit E-Mail/Passwort anlegen.
Danach in SQL ausführen:

```sql
insert into public.admin_users(user_id)
select id from auth.users where email='DEINE-ADMIN-EMAIL';
```

## 4. CMS
Öffnen:
`https://mobeats.de/cms.html`

Dort können Artists, MP3-Tracks und Playlists angelegt werden. MP3s landen im Storage-Bucket `music`, Cover in `covers`.

## 5. Veröffentlichung
Tracks mit `öffentlich` werden automatisch auf der öffentlichen mobeats-Seite geladen.
