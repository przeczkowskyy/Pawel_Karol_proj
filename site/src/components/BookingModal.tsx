import { useEffect, useMemo, useState } from "react";
import { X, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLang, pick } from "@/i18n";

/* Modal „Umów diagnozę” — kalendarz kitu (.cal) + wybór godziny, PL/EN.
   Bez backendu (v0.3): wybrany termin składa się w e-mail (mailto) albo
   telefon. Po zakupie domeny podepniemy realną rezerwację (Cal.com). */

export const PHONE_DISPLAY = "786 296 426";
export const PHONE_HREF = "tel:+48786296426";
const MAIL = "kontakt@klarow.com";

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "15:00"];

const T = {
  pl: {
    dow: ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"],
    months: [
      "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
      "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
    ],
    title: "Umów bezpłatną diagnozę",
    sub: "30 minut, online. Wybierz dogodny termin — potwierdzimy go mailowo tego samego dnia.",
    hourFor: "Godzina",
    confirmMail: "Potwierdź e-mailem",
    prevMonth: "Poprzedni miesiąc",
    nextMonth: "Następny miesiąc",
    close: "Zamknij",
    footer: `Wolisz od razu porozmawiać? Zadzwoń: ${PHONE_DISPLAY} (pn–pt, 9–16). Rezerwacja online pojawi się wraz z uruchomieniem domeny klarow.com.`,
    mailSubject: (d: string, s: string) => `Diagnoza automatyzacji — ${d}, godz. ${s}`,
    mailBody: (d: string, s: string) =>
      `Dzień dobry,\n\nchcę umówić bezpłatną diagnozę automatyzacji.\nProponowany termin: ${d}, godz. ${s}.\n\nFirma: \nTelefon: \nKrótko o procesie, który boli: \n\nPozdrawiam`,
  },
  en: {
    dow: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    title: "Book a free diagnosis",
    sub: "30 minutes, online. Pick a slot that suits you — we'll confirm it by email the same day.",
    hourFor: "Time",
    confirmMail: "Confirm by email",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    close: "Close",
    footer: `Prefer to talk right away? Call: +48 ${PHONE_DISPLAY} (Mon–Fri, 9–16 CET). Online booking arrives with the klarow.com domain.`,
    mailSubject: (d: string, s: string) => `Automation diagnosis — ${d}, ${s}`,
    mailBody: (d: string, s: string) =>
      `Hello,\n\nI'd like to book a free automation diagnosis.\nProposed slot: ${d}, ${s} (CET).\n\nCompany: \nPhone: \nBriefly, the process that hurts: \n\nBest regards`,
  },
};

interface DayCell {
  iso: string;
  day: number;
  isOut: boolean;
  isToday: boolean;
  disabled: boolean;
}

function buildMonth(year: number, month: number): DayCell[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // poniedziałek = 0
  const cells: DayCell[] = [];
  const start = new Date(year, month, 1 - startOffset);
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = (d.getDay() + 6) % 7;
    const isOut = d.getMonth() !== month;
    const isPast = d < today;
    const isWeekend = dow >= 5;
    cells.push({
      iso: d.toISOString().slice(0, 10),
      day: d.getDate(),
      isOut,
      isToday: d.getTime() === today.getTime(),
      disabled: isOut || isPast || isWeekend,
    });
  }
  return cells;
}

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const t = pick(lang, T);
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selDay, setSelDay] = useState<string | null>(null);
  const [selSlot, setSelSlot] = useState<string | null>(null);
  const [animParent] = useAutoAnimate();

  const days = useMemo(() => buildMonth(ym.y, ym.m), [ym]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canPrev = ym.y > now.getFullYear() || ym.m > now.getMonth();
  const move = (delta: number) => {
    setYm(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
    setSelDay(null);
    setSelSlot(null);
  };

  const mailHref =
    selDay && selSlot
      ? `mailto:${MAIL}?subject=${encodeURIComponent(
          t.mailSubject(selDay, selSlot)
        )}&body=${encodeURIComponent(t.mailBody(selDay, selSlot))}`
      : undefined;

  return (
    <div className="modal-overlay-c open" onClick={onClose}>
      <div
        className="modal-c"
        style={{ maxWidth: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label={t.close}>
          <X size={15} />
        </button>

        <h3 className="text-[19px] font-extrabold" style={{ color: "var(--heading)" }}>
          {t.title}
        </h3>
        <p className="mt-1 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
          {t.sub}
        </p>

        <div ref={animParent} className="mt-5 flex flex-col gap-4">
          <div className="cal" style={{ maxWidth: "100%", padding: 0 }}>
            <div className="cal-head">
              <button
                className="btn btn-ghost btn-sm btn-ico"
                type="button"
                onClick={() => move(-1)}
                disabled={!canPrev}
                aria-label={t.prevMonth}
              >
                <ChevronLeft size={15} />
              </button>
              <strong>
                {t.months[ym.m]} {ym.y}
              </strong>
              <button
                className="btn btn-ghost btn-sm btn-ico"
                type="button"
                onClick={() => move(1)}
                aria-label={t.nextMonth}
              >
                <ChevronRight size={15} />
              </button>
            </div>
            <div className="cal-grid">
              {t.dow.map((d) => (
                <span key={d} className="cal-dow">
                  {d}
                </span>
              ))}
              {days.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  disabled={d.disabled}
                  onClick={() => {
                    setSelDay(d.iso);
                    setSelSlot(null);
                  }}
                  className={`cal-day${d.isOut ? " is-out" : ""}${d.isToday ? " is-today" : ""}${
                    selDay === d.iso ? " is-sel" : ""
                  }`}
                  style={d.disabled && !d.isOut ? { opacity: 0.35, cursor: "not-allowed" } : undefined}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </div>

          {selDay && (
            <div key="slots">
              <div className="lbl-sm" style={{ marginBottom: 8 }}>
                {t.hourFor} · {selDay}
              </div>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`btn btn-sm ${selSlot === s ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setSelSlot(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selDay && selSlot && (
            <div key="confirm" className="actions-bar" style={{ marginTop: 4 }}>
              <a className="btn btn-primary" href={mailHref}>
                <Mail size={15} /> {t.confirmMail}
              </a>
              <a className="btn btn-secondary" href={PHONE_HREF}>
                <Phone size={15} /> {PHONE_DISPLAY}
              </a>
            </div>
          )}
        </div>

        <p className="mt-4 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>
          {t.footer}
        </p>
      </div>
    </div>
  );
}
