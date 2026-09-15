/* ── loopConductor ──────────────────────────────────────────────────────────
   JEDEN DYRYGENT NA CAŁĄ STRONĘ. Osiem paneli prezentacji ma własną pętlę,
   ale w każdej chwili wolno grać DOKŁADNIE JEDNEJ.

   Po co, skoro panele i tak są poza ekranem: `<video>` zapauzowane, ale
   odtwarzane wcześniej, trzyma dekoder sprzętowy. Kilka dekoderów naraz to na
   zintegrowanej grafice spadek płynności całej strony i grzanie, a na iOS
   dodatkowy kontekst GPU — czyli dokładnie ten mechanizm, który w lipcu
   wyprodukował buga „samo tło" (CLAUDE.md, 2026-07-24). Reguła
   `media-one-autoplay-per-route` mówi o tym wprost: „nigdy dwa dekodery naraz".

   ZASADA WYBORU: gra ten panel, którego widać NAJWIĘCEJ. Przy szwie między
   scenami dwa panele są widoczne po połowie i zwycięzca zmienia się raz, w
   punkcie przecięcia — bez migotania, bo porównujemy powierzchnię, a nie sam
   fakt przecięcia.

   PAUZA UŻYTKOWNIKA (WCAG 2.2.2 Pause, Stop, Hide): ruch, który startuje sam
   i trwa dłużej niż 5 s, musi dać się zatrzymać. Stan jest GLOBALNY i wspólny
   z `HeroMedia` (ten sam klucz w `sessionStorage`), bo dla człowieka „zatrzymaj
   ruch" jest jedną decyzją o stronie, a nie osobną decyzją o każdym pliku.

   ZERO PRACY NA KLATKĘ: zmiany kolejkują się do jednej ramki
   (`requestAnimationFrame`), więc seria zdarzeń obserwatora podczas szybkiego
   przewijania kończy się JEDNYM przeliczeniem, a nie ośmioma. */

const KLUCZ = "klarow:media:paused";

type Wpis = {
  /** ułamek panelu widoczny w oknie, 0–1 */
  ratio: number;
  play: () => void;
  pause: () => void;
};

const wpisy = new Map<string, Wpis>();
const sluchacze = new Set<(paused: boolean) => void>();
const obecni = new Set<(aktywne: boolean) => void>();

let pauza = odczytajPauze();
let ramka = 0;
let podpiety = false;

function odczytajPauze(): boolean {
  /* try/catch obowiązkowo: w oknie prywatnym i przy zablokowanych danych witryny
     sam ODCZYT `sessionStorage` rzuca, a strona ma wtedy działać, nie paść. */
  try {
    return typeof window !== "undefined" && window.sessionStorage.getItem(KLUCZ) === "1";
  } catch {
    return false;
  }
}

function zapiszPauze(v: boolean) {
  try {
    window.sessionStorage.setItem(KLUCZ, v ? "1" : "0");
  } catch {
    /* brak zapisu nie zmienia zachowania w tej sesji */
  }
}

/** Przelicza, kto gra. Wywoływana wyłącznie z ramki. */
function rozstrzygnij() {
  let zwyciezca: string | null = null;
  let najlepszy = 0;

  const wolno = !pauza && typeof document !== "undefined" && !document.hidden;
  if (wolno) {
    for (const [id, w] of wpisy) {
      /* Próg 0,05 chroni przed wybraniem panelu, z którego widać pasek pikseli:
         start dekodera kosztuje więcej niż taki panel może dać widzowi. */
      if (w.ratio > najlepszy && w.ratio > 0.05) {
        najlepszy = w.ratio;
        zwyciezca = id;
      }
    }
  }

  for (const [id, w] of wpisy) {
    if (id === zwyciezca) w.play();
    else w.pause();
  }
}

function zaplanuj() {
  if (ramka || typeof window === "undefined") return;
  ramka = window.requestAnimationFrame(() => {
    ramka = 0;
    rozstrzygnij();
  });
}

/* Karta w tle nie ma prawa trzymać dekodera. Listener zakładany LENIWIE, przy
   pierwszym panelu, i zdejmowany, gdy zniknie ostatni: moduł zaimportowany
   przez trasę bez prezentacji nie zostawia po sobie niczego. */
function naWidocznosc() {
  zaplanuj();
}

function podepnij() {
  if (podpiety || typeof document === "undefined") return;
  document.addEventListener("visibilitychange", naWidocznosc);
  podpiety = true;
}

function odepnij() {
  if (!podpiety || typeof document === "undefined") return;
  document.removeEventListener("visibilitychange", naWidocznosc);
  podpiety = false;
  if (ramka) {
    window.cancelAnimationFrame(ramka);
    ramka = 0;
  }
}

function powiadomObecnosc() {
  const aktywne = wpisy.size > 0;
  for (const f of obecni) f(aktywne);
}

/** Zgłasza panel do dyrygenta. Zwraca funkcję sprzątającą (`motion-cleanup-required`). */
export function zglosPanel(id: string, play: () => void, pause: () => void): () => void {
  wpisy.set(id, { ratio: 0, play, pause });
  podepnij();
  powiadomObecnosc();
  zaplanuj();
  return () => {
    wpisy.delete(id);
    if (wpisy.size === 0) odepnij();
    else zaplanuj();
    powiadomObecnosc();
  };
}

/* Czy w ogóle jest co pauzować. Przycisk pauzy MUSI pojawiać się wyłącznie
   wtedy, gdy pętle naprawdę istnieją: przycisk widoczny po odrzuceniu bramek
   (telefon, ograniczony ruch, Data Saver) byłby kontrolką URUCHAMIAJĄCĄ ruch,
   a taka jest zakazana wprost w regule `media-video-gating`. Liczba
   zarejestrowanych paneli jest jedynym uczciwym źródłem tej odpowiedzi —
   powtarzanie bramek w chromie rozjechałoby się z `ScenePanel` przy pierwszej
   zmianie któregokolwiek warunku. */
export function subskrybujObecnosc(f: (aktywne: boolean) => void): () => void {
  obecni.add(f);
  f(wpisy.size > 0);
  return () => {
    obecni.delete(f);
  };
}

/** Melduje, ile panelu widać. Wywoływane z `IntersectionObserver`. */
export function zglosWidocznosc(id: string, ratio: number) {
  const w = wpisy.get(id);
  if (!w || w.ratio === ratio) return;
  w.ratio = ratio;
  zaplanuj();
}

export function czyPauza(): boolean {
  return pauza;
}

export function ustawPauze(v: boolean) {
  if (pauza === v) return;
  pauza = v;
  zapiszPauze(v);
  for (const f of sluchacze) f(v);
  zaplanuj();
}

/** Subskrypcja stanu pauzy dla przycisku w chromie. */
export function subskrybujPauze(f: (paused: boolean) => void): () => void {
  sluchacze.add(f);
  return () => {
    sluchacze.delete(f);
  };
}
