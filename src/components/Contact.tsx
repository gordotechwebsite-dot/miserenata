import { MessageCircle, Clock, MapPin, Phone } from "lucide-react";
import { WHATSAPP_LINK, PHONE_NUMBER, PHONE_DISPLAY } from "../lib/supabase";
import { trackWhatsAppClick, trackPhoneClick } from "../lib/analytics";

export function Contact() {
  return (
    <section
      id="contacto"
      className="py-16 sm:py-24 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsAppClick}
            className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 hover:border-amber-500/50 transition"
          >
            <MessageCircle className="w-6 h-6 text-amber-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-white mb-1">WhatsApp</h3>
            <p className="text-amber-300 text-sm font-semibold">
              {PHONE_DISPLAY}
            </p>
            <p className="text-stone-500 text-xs mt-1">Respuesta inmediata</p>
          </a>
          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={trackPhoneClick}
            className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 hover:border-amber-500/50 transition"
          >
            <Phone className="w-6 h-6 text-amber-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-white mb-1">Llámanos</h3>
            <p className="text-amber-300 text-sm font-semibold">
              {PHONE_DISPLAY}
            </p>
            <p className="text-stone-500 text-xs mt-1">
              Lun a Dom · 2:00 PM – 12:00 AM
            </p>
          </a>
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
            <MapPin className="w-6 h-6 text-amber-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-white mb-1">Cobertura</h3>
            <p className="text-stone-400 text-sm">Duitama · Paipa · Sogamoso</p>
            <p className="text-stone-500 text-xs mt-1 inline-flex items-center gap-1 justify-center">
              <Clock className="w-3 h-3" /> Todos los días
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsAppClick}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg shadow-xl shadow-green-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Escríbenos por WhatsApp
          </a>
          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={trackPhoneClick}
            className="bg-stone-900 border border-amber-500/50 hover:bg-amber-500/10 text-amber-200 px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 transition-all"
          >
            <Phone className="w-5 h-5" />
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
