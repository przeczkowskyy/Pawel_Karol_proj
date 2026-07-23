import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLang, pick } from "@/i18n";
import { FAQ_I18N } from "@/data/faq";

/* FAQ = typowe obiekcje + nasze kontry (plan strategiczny §2.5), PL/EN.
   Dane w src/data/faq.ts (wspólne z FAQPage JSON-LD i prerenderem).
   Akordeon animowany auto-animate — ref na rodzicu zwijanej treści,
   stabilne klucze, szanuje prefers-reduced-motion. */

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const [parent] = useAutoAnimate();
  return (
    <div ref={parent} className="card" style={{ padding: 0 }}>
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="text-[14px] font-bold" style={{ color: "var(--heading)" }}>
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--primary)" }}
        />
      </button>
      {open && (
        <p
          key="answer"
          className="px-5 pb-5 text-[13px] leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

export default function Faq() {
  const { lang } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const items = pick(lang, FAQ_I18N);

  return (
    <div className="flex flex-col gap-3">
      {items.map((f) => (
        <FaqItem
          key={f.id}
          q={f.q}
          a={f.a}
          open={openId === f.id}
          onToggle={() => setOpenId(openId === f.id ? null : f.id)}
        />
      ))}
    </div>
  );
}
