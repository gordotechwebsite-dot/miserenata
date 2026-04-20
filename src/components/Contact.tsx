import { MessageCircle, Clock, MapPin } from "lucide-react";
import { WHATSAPP_LINK } from "../lib/supabase";

export function Contact() {
  return (
    <section
      id="contacto"
      className="py-16 sm:py-24 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
          ¿Listo para
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
            {" "}sorprender?
          </span>
        </h2>
        <p className="text-stone-400 text-lg max-w-2xl mx-auto mb-10">
          Contáctanos directamente por WhatsApp o llámanos. Estamos disponibles
          para ti todos los días de la semana.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
            <MessageCircle className="w-6 h-6 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">WhatsApp</h3>
            <p className="text-stone-400 text-sm">Respuesta inmediata</p>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
            <Clock className="w-6 h-6 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">Horario</h3>
            <p className="text-stone-400 text-sm">
              Lunes a Domingo
              <br />
              2:00 PM - 12:00 AM
            </p>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
            <MapPin className="w-6 h-6 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">Cobertura</h3>
            <p className="text-stone-400 text-sm">
              Duitama · Paipa · Sogamoso
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg shadow-xl shadow-green-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
