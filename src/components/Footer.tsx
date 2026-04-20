import { Music4, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { WHATSAPP_LINK, PHONE_NUMBER, PHONE_DISPLAY } from "../lib/supabase";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-stone-950 border-t border-stone-900 pt-14 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Music4 className="w-5 h-5 text-stone-950" />
              </div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Miserenata<span className="text-amber-400">.</span>co
              </span>
            </div>
            <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
              El arte de sorprender. Serenatas, mariachis y artistas en vivo
              para los momentos que merecen música de verdad.
            </p>
          </div>

          <div>
            <div className="font-display text-white font-semibold mb-3">
              Secciones
            </div>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li><a href="#generos" className="hover:text-amber-300">Géneros</a></li>
              <li><a href="#servicios" className="hover:text-amber-300">Paquetes</a></li>
              <li><a href="#ocasiones" className="hover:text-amber-300">Ocasiones</a></li>
              <li><a href="#reservar" className="hover:text-amber-300">Reservar</a></li>
              <li><a href="#faq" className="hover:text-amber-300">FAQ</a></li>
            </ul>
          </div>

          <div>
            <div className="font-display text-white font-semibold mb-3">
              Contacto
            </div>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Duitama · Paipa · Sogamoso
              </li>
              <li>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center gap-2 hover:text-amber-300"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                promotionsmiserenata@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-amber-400" />
                @miserenata.co
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-2 items-center gap-2 px-3 py-1.5 rounded-xl border border-green-500/40 text-green-300 hover:bg-green-500/10 transition"
                >
                  WhatsApp directo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-500 text-xs sm:text-sm text-center">
            © {year} Miserenata.co · El arte de sorprender. Todos los derechos
            reservados.
          </p>
          <p className="text-stone-600 text-xs">Hecho con amor en Boyacá.</p>
        </div>
      </div>
    </footer>
  );
}
