import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ADMIN_EMAIL,
  DEFAULT_BANNER_TEXT,
  getSiteSetting,
  setSiteSetting,
  supabase,
} from "../lib/supabase";
import { DEFAULT_PACKAGES, type PackageData, formatCop } from "../lib/constants";
import {
  Shield,
  LogOut,
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Images,
  Package,
  Upload,
  AlertTriangle,
  Megaphone,
} from "lucide-react";

const GALLERY_BUCKET = "gallery";

type GalleryFile = {
  name: string;
  url: string;
  createdAt: string | null;
};

type Tab = "packages" | "gallery" | "banner";

type PackageRow = {
  id: string;
  name: string;
  price_cop: number;
  duration_minutes: number;
  songs_count: number;
  musicians_count: number;
  description: string;
  features: string[];
  popular: boolean;
  sort_order: number;
  image_path: string | null;
  image_url: string | null;
  fallback_url: string | null;
};

function rowToPackage(row: PackageRow): PackageData {
  const local = DEFAULT_PACKAGES.find((p) => p.name === row.name);
  return {
    id: row.id,
    name: row.name,
    priceCop: row.price_cop,
    durationMinutes: row.duration_minutes,
    songsCount: row.songs_count,
    musiciansCount: row.musicians_count,
    description: row.description,
    features: row.features || [],
    popular: row.popular,
    sortOrder: row.sort_order,
    imagePath: row.image_path,
    imageUrl: row.image_url,
    fallbackUrl:
      row.fallback_url || local?.fallbackUrl || "https://placehold.co/400x300/1a1a2e/d4af37?text=Miserenata",
    localImage: local?.localImage || "/images/mariachi-hero.jpg",
  };
}

export function AdminPanel({ onExit }: { onExit: () => void }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const [tab, setTab] = useState<Tab>("packages");

  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [bannerText, setBannerText] = useState<string>(DEFAULT_BANNER_TEXT);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerSaving, setBannerSaving] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSavedAt, setBannerSavedAt] = useState<number | null>(null);

  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setLoadingAuth(false);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    void loadPackages();
    void loadGallery();
    void loadBanner();
  }, [isAdmin]);

  const loadBanner = async () => {
    setBannerLoading(true);
    setBannerError(null);
    const value = await getSiteSetting("banner_text");
    if (value !== null) setBannerText(value);
    setBannerLoading(false);
  };

  const saveBanner = async () => {
    setBannerSaving(true);
    setBannerError(null);
    const { error: err } = await setSiteSetting("banner_text", bannerText);
    if (err) setBannerError(err);
    else setBannerSavedAt(Date.now());
    setBannerSaving(false);
  };

  const loadPackages = async () => {
    setLoadingPackages(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("packages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (err) {
      setError(err.message || "No se pudieron cargar los paquetes");
    } else if (Array.isArray(data)) {
      setPackages(data.map((row) => rowToPackage(row as PackageRow)));
    }
    setLoadingPackages(false);
  };

  const loadGallery = async () => {
    setLoadingGallery(true);
    setGalleryError(null);
    const { data, error: err } = await supabase.storage
      .from(GALLERY_BUCKET)
      .list("", {
        limit: 200,
        sortBy: { column: "created_at", order: "desc" },
      });
    if (err) {
      setGalleryError(
        err.message ||
          `No se pudo cargar la galería. Verifica que el bucket "${GALLERY_BUCKET}" exista en Supabase Storage.`
      );
      setLoadingGallery(false);
      return;
    }
    const files =
      data
        ?.filter(
          (f) =>
            f.name &&
            !f.name.startsWith(".") &&
            /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f.name)
        )
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from(GALLERY_BUCKET).getPublicUrl(f.name).data
            .publicUrl,
          createdAt: f.created_at || null,
        })) || [];
    setGalleryFiles(files);
    setLoadingGallery(false);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setGalleryError(null);
    setUploadProgress({ done: 0, total: files.length });

    let hadError: string | null = null;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safe = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .slice(0, 40);
      const key = `${Date.now()}-${i}-${safe}.${ext}`;
      const { error: err } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(key, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });
      if (err && !hadError) hadError = err.message;
      setUploadProgress({ done: i + 1, total: files.length });
    }

    if (hadError) setGalleryError(hadError);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    await loadGallery();
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`¿Eliminar la foto "${name}"?`)) return;
    setDeletingFile(name);
    const { error: err } = await supabase.storage
      .from(GALLERY_BUCKET)
      .remove([name]);
    if (err) setGalleryError(err.message);
    setDeletingFile(null);
    await loadGallery();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSigningIn(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (err) setAuthError(err.message);
    setSigningIn(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const updateField = (id: string, patch: Partial<PackageData>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  };

  const savePackage = async (pkg: PackageData) => {
    if (!pkg.id) return;
    setSaving(pkg.id);
    const { error: err } = await supabase
      .from("packages")
      .update({
        name: pkg.name,
        price_cop: pkg.priceCop,
        duration_minutes: pkg.durationMinutes,
        songs_count: pkg.songsCount,
        musicians_count: pkg.musiciansCount,
        description: pkg.description,
        features: pkg.features,
        popular: pkg.popular,
        sort_order: pkg.sortOrder,
      })
      .eq("id", pkg.id);
    if (err) setError(err.message);
    setSaving(null);
  };

  const deletePackage = async (id: string) => {
    if (!confirm("¿Eliminar este paquete?")) return;
    const { error: err } = await supabase.from("packages").delete().eq("id", id);
    if (err) setError(err.message);
    else await loadPackages();
  };

  const createInitialPackages = async () => {
    setCreating(true);
    setError(null);
    const rows = DEFAULT_PACKAGES.map((p) => ({
      name: p.name,
      price_cop: p.priceCop,
      duration_minutes: p.durationMinutes,
      songs_count: p.songsCount,
      musicians_count: p.musiciansCount,
      description: p.description,
      features: p.features,
      popular: p.popular,
      sort_order: p.sortOrder,
      fallback_url: p.fallbackUrl,
    }));
    const { error: err } = await supabase.from("packages").insert(rows);
    if (err) setError(err.message);
    else await loadPackages();
    setCreating(false);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-400">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-display font-bold">Panel de Administrador</div>
              <div className="text-xs text-stone-500">Miserenata.co</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al sitio
            </button>
            {session && (
              <button
                onClick={handleSignOut}
                className="bg-stone-800 hover:bg-stone-700 border border-stone-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!session ? (
          <div className="max-w-md mx-auto bg-stone-900/80 border border-stone-800 rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold mb-2">
              Iniciar sesión
            </h2>
            <p className="text-stone-400 text-sm mb-6">
              Acceso solo para administradores autorizados.
            </p>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-300 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-300 mb-1 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              {authError && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  {authError}
                </div>
              )}
              <button
                type="submit"
                disabled={signingIn}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {signingIn ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          </div>
        ) : !isAdmin ? (
          <div className="max-w-md mx-auto text-center bg-stone-900/80 border border-stone-800 rounded-3xl p-8">
            <Shield className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <p className="text-stone-300 mb-2">
              Sesión iniciada como: {session.user?.email}
            </p>
            <p className="text-stone-500 text-sm">
              Este usuario no tiene permisos de admin.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/60 border border-stone-800 rounded-2xl px-5 py-3">
              <div className="text-sm text-stone-400">
                Conectado como:{" "}
                <span className="text-amber-400 font-semibold">
                  {session.user?.email}
                </span>
              </div>
              <div className="inline-flex rounded-xl bg-stone-950/60 border border-stone-800 p-1">
                <button
                  onClick={() => setTab("packages")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    tab === "packages"
                      ? "bg-amber-500/20 text-amber-200"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <Package className="w-4 h-4" /> Paquetes
                </button>
                <button
                  onClick={() => setTab("gallery")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    tab === "gallery"
                      ? "bg-amber-500/20 text-amber-200"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <Images className="w-4 h-4" /> Galería
                </button>
                <button
                  onClick={() => setTab("banner")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    tab === "banner"
                      ? "bg-amber-500/20 text-amber-200"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <Megaphone className="w-4 h-4" /> Banner
                </button>
              </div>
            </div>

            {tab === "packages" && (
              <div className="space-y-5">
                <div className="flex items-center justify-end">
                  <button
                    onClick={createInitialPackages}
                    disabled={creating || packages.length > 0}
                    className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" /> Crear paquetes iniciales
                  </button>
                </div>

                {error && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                {loadingPackages ? (
                  <div className="text-stone-400 text-center py-8">
                    Cargando paquetes...
                  </div>
                ) : packages.length === 0 ? (
                  <div className="text-center text-stone-400 bg-stone-900/60 border border-stone-800 rounded-2xl py-12">
                    No hay paquetes todavía. Haz clic en "Crear paquetes
                    iniciales" para empezar.
                  </div>
                ) : (
                  packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 sm:p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-400 mb-1">
                          Nombre
                        </label>
                        <input
                          value={pkg.name}
                          onChange={(e) =>
                            updateField(pkg.id!, { name: e.target.value })
                          }
                          className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-400 mb-1">
                          Precio (COP)
                        </label>
                        <input
                          type="number"
                          value={pkg.priceCop}
                          onChange={(e) =>
                            updateField(pkg.id!, {
                              priceCop: Number(e.target.value),
                            })
                          }
                          className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                        <div className="text-xs text-stone-500 mt-1">
                          ${formatCop(pkg.priceCop)} COP
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-400 mb-1">
                          Duración (min)
                        </label>
                        <input
                          type="number"
                          value={pkg.durationMinutes}
                          onChange={(e) =>
                            updateField(pkg.id!, {
                              durationMinutes: Number(e.target.value),
                            })
                          }
                          className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-400 mb-1">
                          Canciones
                        </label>
                        <input
                          type="number"
                          value={pkg.songsCount}
                          onChange={(e) =>
                            updateField(pkg.id!, {
                              songsCount: Number(e.target.value),
                            })
                          }
                          className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-400 mb-1">
                          Músicos
                        </label>
                        <input
                          type="number"
                          value={pkg.musiciansCount}
                          onChange={(e) =>
                            updateField(pkg.id!, {
                              musiciansCount: Number(e.target.value),
                            })
                          }
                          className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-400 mb-1">
                          Orden
                        </label>
                        <input
                          type="number"
                          value={pkg.sortOrder}
                          onChange={(e) =>
                            updateField(pkg.id!, {
                              sortOrder: Number(e.target.value),
                            })
                          }
                          className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={pkg.description}
                        rows={2}
                        onChange={(e) =>
                          updateField(pkg.id!, { description: e.target.value })
                        }
                        className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Features (una por línea)
                      </label>
                      <textarea
                        value={pkg.features.join("\n")}
                        rows={4}
                        onChange={(e) =>
                          updateField(pkg.id!, {
                            features: e.target.value
                              .split("\n")
                              .map((f) => f.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <label className="mt-4 flex items-center gap-2 text-sm text-stone-300">
                      <input
                        type="checkbox"
                        checked={pkg.popular}
                        onChange={(e) =>
                          updateField(pkg.id!, { popular: e.target.checked })
                        }
                      />
                      Marcar como "Más popular"
                    </label>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => savePackage(pkg)}
                        disabled={saving === pkg.id}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 px-4 py-2 rounded-xl font-bold disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />{" "}
                        {saving === pkg.id ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id!)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 rounded-xl text-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))
                )}
              </div>
            )}

            {tab === "banner" && (
              <div className="space-y-5">
                <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-1">
                    <Megaphone className="w-5 h-5 text-sky-400" />
                    <div className="font-display font-bold text-lg text-white">
                      Banner inferior
                    </div>
                  </div>
                  <p className="text-stone-400 text-sm mb-4">
                    Texto que corre de derecha a izquierda en la franja azul
                    pegada al borde inferior de la página. Se repite en loop
                    continuo.
                  </p>

                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Texto del banner
                  </label>
                  <textarea
                    value={bannerText}
                    rows={3}
                    onChange={(e) => setBannerText(e.target.value)}
                    disabled={bannerLoading || bannerSaving}
                    placeholder={DEFAULT_BANNER_TEXT}
                    className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                  <div className="text-xs text-stone-500 mt-1">
                    Si lo dejas vacío se usa el texto por defecto:{" "}
                    <span className="text-stone-300">
                      "{DEFAULT_BANNER_TEXT}"
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl bg-sky-400 overflow-hidden py-2 px-4">
                    <div className="text-white font-semibold text-sm truncate">
                      Vista previa: {bannerText || DEFAULT_BANNER_TEXT}
                    </div>
                  </div>

                  {bannerError && (
                    <div className="mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">
                          No se pudo guardar el banner
                        </div>
                        <div className="text-stone-300">{bannerError}</div>
                        <div className="text-stone-400 text-xs mt-1">
                          Crea en Supabase la tabla{" "}
                          <code className="text-amber-300">site_settings</code>{" "}
                          y configura políticas RLS. Ver SUPABASE_SETUP.md en el
                          repo.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={saveBanner}
                      disabled={bannerSaving || bannerLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 px-4 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />{" "}
                      {bannerSaving ? "Guardando..." : "Guardar"}
                    </button>
                    {bannerSavedAt && !bannerSaving && !bannerError && (
                      <span className="text-sm text-emerald-300">
                        Guardado. Recarga el sitio para ver el cambio en vivo.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === "gallery" && (
              <div className="space-y-5">
                <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="font-display font-bold text-lg text-white">
                        Subir fotos
                      </div>
                      <p className="text-stone-400 text-sm">
                        Selecciona una o varias imágenes (JPG, PNG, WEBP).
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleUpload(e.target.files)}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 px-5 py-2.5 rounded-xl font-bold disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading
                          ? `Subiendo ${uploadProgress.done}/${uploadProgress.total}...`
                          : "Seleccionar fotos"}
                      </button>
                    </div>
                  </div>
                  {galleryError && (
                    <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">
                          No se pudo acceder a la galería
                        </div>
                        <div className="text-stone-300">{galleryError}</div>
                        <div className="text-stone-400 text-xs mt-1">
                          Crea en Supabase un Storage bucket llamado{" "}
                          <code className="text-amber-300">
                            {GALLERY_BUCKET}
                          </code>{" "}
                          (público para lectura) y configura políticas RLS para
                          que el admin pueda subir/eliminar. Ver
                          SUPABASE_SETUP.md en el repo.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {loadingGallery ? (
                  <div className="text-stone-400 text-center py-8">
                    Cargando galería...
                  </div>
                ) : galleryFiles.length === 0 ? (
                  <div className="text-center text-stone-400 bg-stone-900/60 border border-stone-800 rounded-2xl py-12">
                    Aún no hay fotos. Sube la primera arriba.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {galleryFiles.map((f) => (
                      <div
                        key={f.name}
                        className="relative group rounded-2xl overflow-hidden border border-stone-800 bg-stone-900/60"
                      >
                        <img
                          src={f.url}
                          alt={f.name}
                          className="w-full aspect-square object-cover"
                          loading="lazy"
                        />
                        <button
                          onClick={() => handleDelete(f.name)}
                          disabled={deletingFile === f.name}
                          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950/90 to-transparent px-2 py-1.5 text-xs text-stone-300 truncate">
                          {f.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
