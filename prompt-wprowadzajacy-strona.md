# Prompt wprowadzający — sesja: rework landingu Klarow + DEMO M2

> **Jak używać.** Wklej całość poniżej linii `— — —` do **nowego okna Claude Code** otwartego
> w katalogu repo Klarow. To sesja **implementacyjna** (budujemy kod), nie Plan Mode.

— — —

# 1. Kontekst i Twoja rola

Pracujesz nad stroną firmy **Klarow** (klarow.com) — usługi automatyzacji, upraszczania i czyszczenia
danych dla MŚP „wyrosłych na Excelu" (produkcja / budownictwo / dystrybucja). Jestem Karol,
współzałożyciel; odpowiadam za landing i żywe DEMO. Zachowuj się jak inżynier-współzałożyciel:
kwestionuj słabe pomysły i proponuj lepsze — nie przytakuj.

**Najpierw przeczytaj (w tej kolejności), zanim cokolwiek zmienisz:**
1. `CLAUDE.md` — przewodnik po repo, twarde zasady i aktualny „Stan operacyjny" (kluczowe decyzje).
2. `docs/plan/plan-dzialania-karol.md` — moja lista zadań na dziś = zakres tej sesji.
3. `docs/plan/plan-strategiczny.md` — kontekst biznesowy, ICP, katalog modułów, architektura strony (sekcja 4).
4. `ui-kit/skills/company-ui/SKILL.md` — **OBOWIĄZKOWY** system projektowy; zero własnych wariantów.

# 2. Cel tej sesji

1. **Przerób sekcję „Moduły"** na oś **problemową**: karta = problem → co dostajesz → wartość liczbą →
   dni wdrożenia → status. Dział tylko jako filtr/tag.
2. **Zbuduj jeden dopracowany DEMO „Raport zarządczy" (M2)** — 100% client-side, dane **fikcyjne**,
   wejście „wklej / wgraj / załaduj przykład", wyjście: 3 KPI + wykres per-etap + tabela z komentarzami.
   Wepnij w landing jako główny dowód „zobacz, jak to działa". To **odtworzenie od zera na wzór**
   narzędzia z Nuconic — **nie kopiujemy kodu**, budujemy własne.
3. **Wpleć drugi wyróżnik** w treść: karta „**prawdziwie zero chmury**" (zero API do LLM, zero serwera,
   działa w Twoim Excelu — inaczej niż AI-agenci, którzy i tak wysyłają dane do OpenAI) + **determinizm**
   („kalkulator, nie wróżka — te same dane zawsze dają ten sam wynik, z jawną ścieżką wyliczenia").
   Dodaj blok ✕ Tradycyjnie / ✓ Klarow i galerię „gotowe narzędzia" (2–3 kafle, każdy z liczbą before/after).

# 3. Twarde zasady (nienaruszalne)

- **UI wyłącznie wg skilla `company-ui`** — akcent stal `#A8B4C2`, **zero złota**, znak marki = tekstowy
  wordmark KLAROW. Zero własnych przycisków / chipów / kolorów.
- **Wykresy statyczne**, krótki fade; wszystkie animacje respektują `prefers-reduced-motion`.
- **Teksty PL + EN** (wzorzec `{ pl, en }` + `pick()` z `src/i18n.tsx`).
- **Marka i liczby Nuconic NIE mogą pojawić się publicznie** — dowód budujemy z DEMO na danych fikcyjnych
  i mini-case „rozbiórka najgorszego Excela", nie z case'a Nuconic.
- **Przed każdym pushem:** `npx tsc --noEmit` + `npx vite build` muszą przejść (w katalogu `site/`).
- **Po każdej skończonej zmianie: commit + push na `origin/main`**
  (`origin` = github.com/przeczkowskyy/Pawel_Karol_proj — wspólne repo). Komunikaty po polsku,
  stopka `Co-Authored-By: Claude ...`.
- **Na koniec sesji: zaktualizuj `CLAUDE.md`** — sekcja „Stan operacyjny" (co zrobione, co dalej) +
  dopisz nauczki. Wiedza ma się kumulować między oknami.

# 4. Na czym gramy wobec konkurencji

Najbliższy konkurent: **MALINSKI.AI**. Mocny, ale: (a) brenduje „AI wszędzie" — my jesteśmy
deterministycznym kalkulatorem; (b) ich narzędzia i tak wysyłają dane do API LLM + potrzebują serwera —
my prawdziwie zero-chmury, Excel lokalnie; (c) brak tożsamości założyciela — my founder-led;
(d) inna nisza (marketing/e-commerce) — my twarde liczby produkcji/budownictwa. **Nie ścigamy ich na
szerokość — wąsko i głęboko.** Jeden dopracowany DEMO + dwa mini-case bije osiem połówek.

# 5. Uruchomienie

```bash
cd site && npm install && npm run dev     # landing dev (HMR): http://localhost:5173
cd site && npm run build                  # build produkcyjny → site/dist
python -m http.server 8765 --directory demo   # wzorzec DEMO M2 do podejrzenia
```

Zacznij od przeczytania plików z sekcji 1, potem **krótko potwierdź plan na tę sesję** i działaj.
