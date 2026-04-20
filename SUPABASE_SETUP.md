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
