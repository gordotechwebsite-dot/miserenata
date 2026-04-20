# Supabase — Configuración del bucket `gallery`

La sección **Galería** del sitio y la pestaña **Galería** del panel de admin usan un Storage bucket llamado `gallery` en Supabase.

## 1. Crear el bucket

1. Dashboard de Supabase → tu proyecto → **Storage**.
2. **New bucket** → Name: `gallery` → **Public bucket**: ✔ Sí → Save.

## 2. Políticas RLS

### Lectura pública

```sql
create policy "Gallery public read"
on storage.objects for select
to public
using ( bucket_id = 'gallery' );
```

### Subida / borrado solo para el admin autenticado

Reemplaza `miseranataco@gmail.com` si cambias el email del admin.

```sql
create policy "Gallery admin insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'gallery'
  and (auth.jwt() ->> 'email') = 'miseranataco@gmail.com'
);

create policy "Gallery admin delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'gallery'
  and (auth.jwt() ->> 'email') = 'miseranataco@gmail.com'
);

create policy "Gallery admin update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'gallery'
  and (auth.jwt() ->> 'email') = 'miseranataco@gmail.com'
);
```

## 3. Listo

- Con sesión de admin (`#admin` + login) aparecerá la pestaña **Galería** para subir/eliminar múltiples fotos.
- La sección pública `#galeria` del sitio mostrará automáticamente todas las imágenes del bucket, con lightbox.

---

# Supabase — Tabla `site_settings` (banner inferior editable)

El banner azul pegado al borde inferior del sitio se edita desde la pestaña **Banner** del panel admin y se persiste en la tabla `site_settings`.

## 1. Crear la tabla

Ejecuta esto en el SQL editor de Supabase:

```sql
create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
```

## 2. Políticas RLS

### Lectura pública (todo el mundo lee los ajustes)

```sql
create policy "site_settings public read"
on public.site_settings for select
to anon, authenticated
using ( true );
```

### Escritura solo para el admin autenticado

Reemplaza `miseranataco@gmail.com` si cambias el email del admin.

```sql
create policy "site_settings admin insert"
on public.site_settings for insert
to authenticated
with check ( (auth.jwt() ->> 'email') = 'miseranataco@gmail.com' );

create policy "site_settings admin update"
on public.site_settings for update
to authenticated
using ( (auth.jwt() ->> 'email') = 'miseranataco@gmail.com' )
with check ( (auth.jwt() ->> 'email') = 'miseranataco@gmail.com' );
```

## 3. Valor inicial (opcional)

El frontend usa un texto por defecto si la fila no existe. Si quieres precargarla:

```sql
insert into public.site_settings (key, value)
values ('banner_text', 'Reserva serenatas desde $300.000 en Duitama, Paipa y Sogamoso')
on conflict (key) do nothing;
```

## 4. Listo

- En `#admin` → pestaña **Banner**: editar el texto y guardar.
- El cambio se refleja en el siguiente reload del sitio (el banner consulta la tabla al cargar).
