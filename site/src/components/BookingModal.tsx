import { useEffect, useMemo, useState } from "react";
import { X, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

/* Modal „Umów diagnozę” — kalendarz kitu (.cal) + wybór godziny.
   Bez backendu (v0.1): wybrany termin składa się w e-mail (mailto) albo
   telefon. Po zakupie domeny podepniemy realną rezerwację (Cal.com). */

export const PHONE_DISPLAY = "786 296 426";
export const PHONE_HREF = "tel:+48786296426";
const MAIL = "kontakt@klarow.com";

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "15:00"];
const DOW = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];

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
          `Diagnoza automatyzacji — ${selDay}, godz. ${selSlot}`
        )}&body=${encodeURIComponent(
          `Dzień dobry,\n\nchcę umówić bezpłatną diagnozę automatyzacji.\nProponowany termin: ${selDay}, godz. ${selSlot}.\n\nFirma: \nTelefon: \nKrótko o procesie, który boli: \n\nPozdrawiam`
        )}`
      : undefined;

  return (
    <div className="modal-overlay-c open" onClick={onClose}>
      <div
        className="modal-c"
        style={{ maxWidth: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Zamknij">
          <X size={15} />
        </button>

        <h3 className="text-[19px] font-extrabold" style={{ color: "var(--heading)" }}>
          Umów bezpłatną diagnozę
        </h3>
        <p className="mt-1 text-[13px]" style={{ color: "var(--muted-foreground)" }}>
          30 minut, online. Wybierz dogodny termin — potwierdzimy go mailowo tego samego dnia.
        </p>

        <div ref={animParent} className="mt-5 flex flex-col gap-4">
          <div className="cal" style={{ maxWidth: "100%", padding: 0 }}>
            <div className="cal-head">
              <button
                className="btn btn-ghost btn-sm btn-ico"
                type="button"
                onClick={() => move(-1)}
                disabled={!canPrev}
                aria-label="Poprzedni miesiąc"
              >
                <ChevronLeft size={15} />
              </button>
              <strong>
                {MONTHS[ym.m]} {ym.y}
              </strong>
              <button
                className="btn btn-ghost btn-sm btn-ico"
                type="button"
                onClick={() => move(1)}
                aria-label="Następny miesiąc"
              >
                <ChevronRight size={15} />
              </button>
            </div>
            <div className="cal-grid">
              {DOW.map((d) => (
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
                Godzina · {selDay}
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
                <Mail size={15} /> Potwierdź e-mailem
              </a>
              <a className="btn btn-secondary" href={PHONE_HREF}>
                <Phone size={15} /> {PHONE_DISPLAY}
              </a>
            </div>
          )}
        </div>

        <p className="mt-4 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>
          Wolisz od razu porozmawiać? Zadzwoń: <strong>{PHONE_DISPLAY}</strong> (pn–pt, 9–16).
          Rezerwacja online pojawi się wraz z uruchomieniem domeny klarow.com.
        </p>
      </div>
    </div>
  );
}
