# Plan działania — Karol (dziś, 2026-07-22)

> Jedno zdanie na punkt. Rola: landing + żywe DEMO (narzędzia odtworzone od zera na wzór Nuconic, na fikcyjnych danych).

## Razem z Pawłem (15–30 min na start)
- [ ] Ustalcie, kto trzyma JDG, i podpiszcie jednostronicowe porozumienie 50/50 (wkład każdego, wspólny przychód, konwersja do sp. z o.o. przy pierwszym płatnym kliencie).
- [x] Wybierzcie pierwszy moduł DEMO — rekomendacja: **Raport zarządczy (M2)**, bo jest najbardziej efektowny i w pełni read-only. *(wybrano M2 — demo zbudowane 2026-07-22)*

## Karol — dziś
- [x] Wybierz jedno narzędzie ze swoich wzorców z Nuconic i **odtwórz je od zera** jako czyste, własne DEMO (fikcyjne dane, 100% w przeglądarce, zero backendu). *(M2 — silnik `site/src/lib/report.ts`, zero kodu z Nuconic)*
- [x] Napisz jednostronicową specyfikację DEMO: wejście (wklej / wgraj / „załaduj przykład"), wyjście (3 KPI + wykres per-etap + tabela), zestaw danych fikcyjnych. *(`docs/plan/demo-m2-spec.md`)*
- [x] Zbuduj ten jeden dopracowany DEMO i wepnij go w landing jako główny dowód „zobacz, jak to działa". *(sekcja `#demo`, link w navbarze i hero-CTA)*
- [x] Przeredaguj sekcję „Moduły" na oś **problemową** (problem → co dostajesz → liczba → dni wdrożenia), z działem tylko jako filtr. *(ModulesGrid + pola problem/dept w modules.ts)*
- [x] Dodaj kartę „**prawdziwie zero chmury**": zero API, zero serwera, działa w Twoim Excelu — inaczej niż AI-agenci, którzy i tak wysyłają dane do OpenAI. *(sekcja `#wyrozniki`)*
- [x] Dodaj blok ✕ Tradycyjnie / ✓ Klarow oraz jedno zdanie o determinizmie („kalkulator, nie wróżka — te same dane zawsze dają ten sam wynik, z jawną ścieżką wyliczenia"). *(blok 5 par + panel „ścieżka wyliczenia" w demie)*
- [x] Zrób galerię „gotowe narzędzia" z 2–3 kaflami, każdy z twardą liczbą before/after w nagłówku. *(3 kafle w `#wyrozniki`)*
- [ ] Napisz 1–2 mini-case „rozbiórka najgorszego Excela" na danych syntetycznych (jawnie oznaczonych) — Plan B na dowód zamiast case'a Nuconic.

## Zasada dnia
- [ ] Jeden dopracowany DEMO + dwa mini-case biją osiem połówek — wąsko i głęboko, nie szeroko i płytko.
