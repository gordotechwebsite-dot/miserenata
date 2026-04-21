-- Habilita que el admin pueda UPDATE/INSERT/DELETE filas en `packages`.
-- Contexto: la web pública (anon) sólo debe poder SELECT. El admin
-- autenticado (email promotionsmiserenata@gmail.com) debe poder modificar.
-- Si el admin no tiene política de UPDATE, la llamada `.update()` desde
-- Supabase-js vuelve SIN error pero con 0 filas afectadas (comportamiento
-- silencioso de RLS), y el cambio parece "no persistirse".
--
-- Ejecutar todo este bloque en el SQL Editor del proyecto Supabase.
-- (wbdxjonzpnbfawvreulz) → SQL Editor → New query → pegar → Run.

alter table public.packages enable row level security;

-- SELECT público para que el landing pueda leer los paquetes sin auth.
drop policy if exists "packages_public_select" on public.packages;
create policy "packages_public_select"
on public.packages
for select
to anon, authenticated
using (true);

-- Admin puede hacer cualquier cosa sobre packages (insert/update/delete).
-- Acepta que `auth.jwt()->>'email'` coincida con el email configurado
-- como admin. Si algún día cambian de email, hay que editar este string.
drop policy if exists "packages_admin_all" on public.packages;
create policy "packages_admin_all"
on public.packages
for all
to authenticated
using (auth.jwt() ->> 'email' = 'promotionsmiserenata@gmail.com')
with check (auth.jwt() ->> 'email' = 'promotionsmiserenata@gmail.com');
