import { useEffect, useState } from "react";
import { DEFAULT_BANNER_TEXT, getSiteSetting } from "../lib/supabase";

export function BottomBanner() {
  const [text, setText] = useState<string>(DEFAULT_BANNER_TEXT);

  useEffect(() => {
    let mounted = true;
    getSiteSetting("banner_text").then((value) => {
      if (mounted && value && value.trim().length > 0) setText(value);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const chunk = (
    <span className="marquee-chunk">
      {text}
      <span className="px-4 text-white/80">•</span>
    </span>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-sky-400 overflow-hidden py-3 shadow-lg shadow-sky-500/30 pointer-events-none">
      <div className="marquee-track whitespace-nowrap text-white font-semibold text-base sm:text-lg tracking-wide">
        {chunk}
        {chunk}
        {chunk}
        {chunk}
      </div>
    </div>
  );
}
