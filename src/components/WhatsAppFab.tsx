import { WHATSAPP_LINK } from "../lib/supabase";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-50 bg-white hover:bg-stone-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-green-500/30 shadow-2xl shadow-green-500/20 flex items-center justify-center transition-all hover:scale-110"
      title="Chat por WhatsApp"
    >
      <img
        src="/images/whatsapp-logo.png"
        alt="WhatsApp"
        className="w-7 h-7 sm:w-8 sm:h-8"
      />
    </a>
  );
}
