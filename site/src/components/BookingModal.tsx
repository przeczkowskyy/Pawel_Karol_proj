import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Mail, Phone, X } from "lucide-react";
import { PHONE_DISPLAY, PHONE_E164, PHONE_HREF, mailHref } from "@/data/contact";
import { MESSAGING } from "@/data/messaging";
import { useLang, pick } from "@/i18n";

/* Dialog „Umów 30 minut”: kalendarz kitu (.cal) + wybór godziny, PL/EN.
   Mechanizm rezerwacji to nadal mailto i telefon (Cal.com dopiero po decyzji
   D-15: integracja = wpis w rejestrze integracji i sekcja o powierzeniu danych
   w /rodo). Miejsce na link zewnętrzny jest przygotowane niżej.

   Semantyka okna modalnego (a11y-dialog-semantics): role="dialog" +
   aria-modal + aria-labelledby, pułapka fokusu na Tab, Esc zamyka, klik
   w tło zamyka (porównanie target === currentTarget, scrim ma
   role="presentation"), fokus wraca na element, z którego okno otwarto.
   ŚWIADOME ODSTĘPSTWO od natywnego <dialog>: przeglądarka dałaby to wszystko
   za darmo, ale <dialog> wymaga własnych stylów (::backdrop, reset ramki UA),
   a arkusze (globals.css, company-ui.css) są w tej fazie własnością innego
   okna. Okno korzysta więc z gotowych klas kitu .modal-overlay-c/.modal-c,
   a migracja na <dialog> wchodzi razem z blokiem .dialog w kicie (plan §5.5).

   NAP i budowa mailto: wyłącznie z data/contact.ts (code-contact-single-source). */

/* Po decyzji D-15 wystarczy wpisać tu adres rezerwacji; przycisk potwierdzenia
   zamieni się wtedy w link zewnętrzny, a mailto zostanie jako droga zapasowa.
   Pusty string = brak integracji, zero żądań do obcego hosta. */
const EXTERNAL_BOOKING_URL: string = "";

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "15:00"];

const T = {
  pl: {
    dow: ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"],
    months: [
      "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
      "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
    ],
    sub: "30 minut online, bez zobowiązań. Wybierz termin, potwierdzimy go mailem tego samego dnia.",
    hourFor: "Godzina",
    confirmMail: "Potwierdź e-mailem",
    external: "Zarezerwuj online",
    prevMonth: "Poprzedni miesiąc",
    nextMonth: "Następny miesiąc",
    close: "Zamknij",
    footer: `Wolisz od razu porozmawiać? Zadzwoń: ${PHONE_DISPLAY} (dni robocze, 9–16).`,
    mailSubject: (d: string, s: string) => `Diagnoza automatyzacji: ${d}, godz. ${s}`,
    mailBody: (d: string, s: string) =>
      `Dzień dobry,\n\nchcę umówić rozmowę o automatyzacji.\nProponowany termin: ${d}, godz. ${s}.\n\nFirma: \nTelefon: \nKrótko o procesie, który boli: \n\nPozdrawiam`,
  },
  en: {
    dow: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    sub: "30 minutes online, no strings attached. Pick a slot and we'll confirm it by email the same day.",
    hourFor: "Time",
    confirmMail: "Confirm by email",
    external: "Book online",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    close: "Close",
    footer: `Prefer to talk right away? Call ${PHONE_E164} (weekdays, 9–16 CET).`,
    mailSubject: (d: string, s: string) => `Automation diagnosis: ${d}, ${s}`,
    mailBody: (d: string, s: string) =>
      `Hello,\n\nI'd like to book a call about automation.\nProposed slot: ${d}, ${s} (CET).\n\nCompany: \nPhone: \nBriefly, the process that hurts: \n\nBest regards`,
  },
};

interface DayCell {
  iso: string;
  day: number;
  isOut: boolean;
  isToday: boolean;
  disabled: boolean;
}

/* Data kalendarzowa BEZ konwersji na UTC. `toISOString()` liczy w strefie
   zerowej, więc lokalna północ w Polsce (UTC+1/+2) wypadała na poprzedni
   dzień i do tematu maila trafiał zły termin (plan §8.7). */
function isoDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
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
      iso: isoDate(d),
      day: d.getDate(),
      isOut,
      isToday: d.getTime() === today.getTime(),
      disabled: isOut || isPast || isWeekend,
    });
  }
  return cells;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const TITLE_ID = "booking-dialog-title";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const days = useMemo(() => buildMonth(ym.y, ym.m), [ym]);

  /* fokus startowy na nagłówku okna, a po zamknięciu z powrotem na przycisku,
     z którego okno otwarto (sprzątanie efektu = zwrot fokusu) */
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    titleRef.current?.focus();
    return () => opener?.focus();
  }, [open]);

  /* Esc zamyka; Tab krąży wewnątrz okna (pułapka fokusu) */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);
      if (e.shiftKey && (!inside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };
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

  const mailTo =
    selDay && selSlot
      ? mailHref(t.mailSubject(selDay, selSlot), t.mailBody(selDay, selSlot))
      : undefined;

  return (
    <div
      className="modal-overlay-c open"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="modal-c"
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        style={{ maxWidth: 560, overscrollBehavior: "contain" }}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label={t.close}>
          <X size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <h2
          id={TITLE_ID}
          ref={titleRef}
          tabIndex={-1}
          className="text-xl font-extrabold text-foreground-strong"
        >
          {pick(lang, MESSAGING.cta.primary)}
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">{t.sub}</p>

        <div className="mt-5 flex flex-col gap-4">
          {/* szerokość i padding inline, bo `.cal` z kitu (arkusz poza warstwami
              Tailwinda) wygrywa kaskadę z utility w @layer utilities */}
          <div className="cal" style={{ maxWidth: "100%", padding: 0 }}>
            <div className="cal-head">
              <button
                className="btn btn-ghost btn-sm btn-ico"
                type="button"
                onClick={() => move(-1)}
                disabled={!canPrev}
                aria-label={t.prevMonth}
              >
                <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
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
                <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
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
                  aria-pressed={selDay === d.iso}
                  onClick={() => {
                    setSelDay(d.iso);
                    setSelSlot(null);
                  }}
                  className={`cal-day${d.isOut ? " is-out" : ""}${d.isToday ? " is-today" : ""}${
                    selDay === d.iso ? " is-sel" : ""
                  }`}
                  /* kit nie ma stanu disabled dla `.cal-day`, a jego `cursor: pointer`
                     stoi poza warstwami Tailwinda, więc przygaszenie idzie inline */
                  style={d.disabled && !d.isOut ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </div>

          {selDay && (
            <div>
              <div className="lbl-sm mb-2">
                {t.hourFor} · {selDay}
              </div>
              {/* wybór godziny to stan, nie CTA: zaznaczenie niesie ikona
                  i aria-pressed, nie sam kolor (design-status-semantics),
                  dzięki czemu biały primary w oknie zostaje jeden */}
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    aria-pressed={selSlot === s}
                    onClick={() => setSelSlot(s)}
                  >
                    {selSlot === s ? (
                      <Check size={16} strokeWidth={1.75} aria-hidden="true" />
                    ) : null}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selDay && selSlot && (
            <div className="actions-bar mt-1">
              {EXTERNAL_BOOKING_URL ? (
                <a
                  className="btn btn-primary"
                  href={EXTERNAL_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.external}
                </a>
              ) : (
                <a className="btn btn-primary" href={mailTo}>
                  <Mail size={16} strokeWidth={1.75} aria-hidden="true" /> {t.confirmMail}
                </a>
              )}
              <a className="btn btn-secondary" href={PHONE_HREF}>
                <Phone size={16} strokeWidth={1.75} aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-foreground-muted">{t.footer}</p>
      </div>
    </div>
  );
}
