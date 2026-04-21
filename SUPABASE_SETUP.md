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

---

# Supabase — Paquetes por género

Cada paquete tiene un género (`mariachi`, `nortena` o `banda`). En la página pública, al entrar en la tarjeta grande de un género (p.ej. `#genero-mariachi`), solo se ven los paquetes de ese género.

## 1. Añadir la columna `genre` a la tabla `packages`

Ejecuta una sola vez en el SQL editor de Supabase:

```sql
alter table public.packages
  add column if not exists genre text default 'mariachi';

-- Opcional: marcar los paquetes existentes como mariachi
update public.packages set genre = 'mariachi' where genre is null;
```

## 2. Editar el género de un paquete

- `#admin` → pestaña **Paquetes** → en cada paquete hay un selector **Género**.
- Valores aceptados: `mariachi`, `nortena`, `banda` o "Sin género".

---

# Supabase — Editar nombre e imagen de cada género

La tarjeta grande del landing (Mariachi · Norteña · Banda) y la cabecera de cada página de género usan nombre + imagen editables. Se persisten en la misma tabla `site_settings` con claves:

- `genre_mariachi_name`, `genre_mariachi_image`
- `genre_nortena_name`, `genre_nortena_image`
- `genre_banda_name`, `genre_banda_image`

No hay SQL adicional: se usa la misma tabla `site_settings` del banner.

- `#admin` → pestaña **Géneros** → edita nombre e imagen, Guardar.
- Para la imagen puedes pegar una URL pública (Supabase Storage, Cloudinary, etc.) o una ruta del repo como `/images/mariachi-hero.jpg`.

---

# Supabase — Reservas (tabla `reservations` + vista `booked_slots`)

Las reservas del wizard se guardan en la tabla `reservations` **antes** de abrir WhatsApp. Cuando el admin confirma una reserva, su horario queda bloqueado automáticamente en la pantalla de Disponibilidad.

> Reemplaza `promotionsmiserenata@gmail.com` si cambias el email del admin.

## 1. Tabla `reservations`

Ejecutar una sola vez en el SQL editor de Supabase:

```sql
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  city text not null,
  address text not null,
  message text,
  date date not null,
  time text not null,
  genre text,
  package_id uuid,
  package_name text not null,
  package_price_cop integer not null default 0,
  extras jsonb not null default '[]'::jsonb,
  extras_total_cop integer not null default 0,
  total_cop integer not null default 0,
  payment_method text not null check (payment_method in ('nequi','efectivo','bancolombia')),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled'))
);

create index if not exists reservations_date_time_idx on public.reservations (date, time);
create index if not exists reservations_status_idx on public.reservations (status);

alter table public.reservations enable row level security;
```

## 2. Políticas RLS

```sql
-- Cualquiera puede crear una reserva desde el sitio público
create policy "reservations public insert"
on public.reservations for insert
to anon, authenticated
with check ( true );

-- Solo el admin ve todas las reservas
create policy "reservations admin read"
on public.reservations for select
to authenticated
using ( (auth.jwt() ->> 'email') = 'promotionsmiserenata@gmail.com' );

create policy "reservations admin update"
on public.reservations for update
to authenticated
using ( (auth.jwt() ->> 'email') = 'promotionsmiserenata@gmail.com' )
with check ( (auth.jwt() ->> 'email') = 'promotionsmiserenata@gmail.com' );

create policy "reservations admin delete"
on public.reservations for delete
to authenticated
using ( (auth.jwt() ->> 'email') = 'promotionsmiserenata@gmail.com' );
```

## 3. Vista pública `booked_slots`

La pantalla de Disponibilidad consulta esta vista para marcar horarios como no disponibles. Expone **solo** fecha/hora/género (nada de nombres, teléfonos ni direcciones) y solo las reservas **confirmadas**.

```sql
create or replace view public.booked_slots as
select date, time, genre
from public.reservations
where status = 'confirmed';

grant select on public.booked_slots to anon, authenticated;
```

> Si tu versión de Supabase se queja por `security_invoker`, puedes ejecutar también:
> `alter view public.booked_slots set (security_invoker = true);`

## 4. Listo

- El wizard de reserva guarda la reserva → abre WhatsApp.
- El admin entra a **Reservas** y cambia a **Confirmada** → el horario se bloquea automáticamente en la pantalla de Disponibilidad y aparece como "Reservado" para los demás clientes.
- Para cancelar, cambia el estado a **Cancelada** → el horario se libera otra vez.
