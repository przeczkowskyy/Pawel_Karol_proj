---
id: legal-rodo-page-required
title: Trasa /rodo istnieje PRZED pierwszym kontaktem handlowym; katalog art. 14 RODO z KONKRETNYMI źródłami danych i prawem sprzeciwu wyróżnionym odrębnie
impact: BLOCKER
tags: [legal, rodo, gdpr, outbound, prerender, footer, privacy, uodo]
source: peer-legal.md §1.1 (twardy bloker; Bisnode 943 470 zł — decyzja Prezesa UODO potwierdzona przez NSA; plan kontroli sektorowych UODO na 2026 z 8.01.2026) / rozstrzygnięcie nadrzędne (1): /rodo kanoniczne, /polityka-prywatnosci = alias 301 / synthesis §2.2 (19 HTML), D-21 (szkielet CC + przegląd radcy) / CLAUDE.md „Do zrobienia"
added: 2026-09-12
---

## Zasada

Trasa `/rodo` (kanoniczna; `/polityka-prywatnosci` = alias 301 w `_redirects`) musi istnieć i być prerenderowana jako `dist/rodo.html`, **zanim wyjdzie pierwszy kontakt handlowy** (list, zaproszenie LinkedIn, permission-mail, telefon, wizytówka z QR). To jeden dokument: klauzula informacyjna z art. 14 RODO + polityka prywatności serwisu.

Obowiązkowy katalog treści (art. 14 ust. 1–2 RODO), każdy punkt jako osobna sekcja z nagłówkiem:
1. **Administrator i kontakt** — pełna nazwa (dziś: JDG Pawła; po konwersji: sp. z o.o.), adres, `kontakt@klarow.com`, telefon; NAP wyłącznie z `src/data/contact.ts` (`code-contact-single-source`).
2. **Źródła danych — KONKRETNE, nazwane co do rodzaju i momentu**: „z ogłoszenia o pracę opublikowanego na portalu `<nazwa>` w dniu `<data>`", „z Krajowego Rejestru Sądowego", „z CEIDG", „ze strony internetowej Państwa firmy", „z profilu firmowego na LinkedIn". **Zakazane sformułowanie: „ze źródeł publicznie dostępnych"** i każdy jego wariant („z ogólnodostępnych rejestrów", „z internetu") — to właśnie zakwestionowano u Bisnode.
3. **Kategorie danych** — wyliczone: nazwa firmy, adres i dane rejestrowe, służbowy adres e-mail, służbowy numer telefonu, imię i nazwisko oraz stanowisko osoby kontaktowej, treść ogłoszenia będącego sygnałem.
4. **Cel i podstawa prawna** — art. 6 ust. 1 lit. f RODO (uzasadniony interes) **z wyjaśnieniem, na czym ten interes polega** („marketing bezpośredni własnych usług kierowany do firm o profilu odpowiadającym naszej ofercie"; motyw 47 RODO), a przy rezerwacji i korespondencji zainicjowanej przez odbiorcę dodatkowo art. 6 ust. 1 lit. b.
5. **Odbiorcy danych** — hosting i usługi wymienione z nazwy (Cloudflare, poczta, w przyszłości Cal.com, analityka), spójnie z `references/integrations-registry.md`; transfer poza EOG i jego podstawa.
6. **Okres przechowywania** — konkretny („do zgłoszenia sprzeciwu, nie dłużej niż 24 miesiące od ostatniego kontaktu"), nigdy „przez okres niezbędny do realizacji celu".
7. **Prawa** — dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie (gdy dotyczy).
8. **PRAWO SPRZECIWU — WYRÓŻNIONE ODRĘBNIE** od pozostałych informacji: własna sekcja z własnym nagłówkiem (`<section id="sprzeciw">`), wizualnie wyróżniona (obrys `--border`, wyższy stopień pisma), umieszczona **nad** listą pozostałych praw, nigdy jako punkt tej listy. Wymaga tego wprost art. 21 ust. 4 RODO („wyraźnie i odrębnie od wszelkich innych informacji").
9. **Mechanizm sprzeciwu** — działający `mailto:kontakt@klarow.com?subject=Sprzeciw` z gotowym tematem; żaden backend nie jest potrzebny. Obietnica: usunięcie z bazy kontaktów i potwierdzenie zwrotne.
10. **Organ nadzorczy** — Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.

Wymagania techniczne: wpis w `pagesSeo.ts` (klucz `rodo`, title ≤ 60 zn., description 130–165 zn., PL + EN), `RodoPage` w routerze `App.tsx`, `RodoShell` w `prerenderAll()` (`seo-prerender-must-keep`: 19 HTML), **link „RODO i prywatność" w stopce na KAŻDEJ trasie**, alias `/polityka-prywatnosci /rodo 301` w `_redirects` (`seo-redirects-registry`), wpis w `llms.txt` (generowany automatycznie). **Do sitemapy `/rodo` NIE wchodzi**, dopóki ma `noindex` (patrz §Wyjątki i `seo-sitemap-llms-generated`: 17 `<loc>`); wchodzi dopiero po zdjęciu `noindex` (D-21), wtedy z priorytetem 0.3. Treść pisze Claude Code jako szkielet, zatwierdza radca prawny (D-21) — do przeglądu strona ma `noindex`, ale jest publicznie dostępna pod adresem, bo linkują do niej wszystkie szablony outboundu.

## Mechanizm awarii (dlaczego)

Art. 14 RODO dotyczy danych pozyskanych **nie od osoby, której dotyczą** — dokładnie tego, co robi Lead-Scout (ogłoszenia o pracę, KRS, CEIDG, strony firm). Obowiązek informacyjny trzeba wykonać **przy pierwszej komunikacji**, nie w drugim mailu i nie drobnym drukiem. Bisnode pobierał dane z rejestrów publicznych i zapłacił **943 470 zł** — decyzja Prezesa UODO potwierdzona przez NSA — **wyłącznie** za niewykonanie tego obowiązku; zakwestionowano m.in. ogólnikowe „ze źródeł publicznie dostępnych" zamiast wskazania konkretnego rejestru. Plan kontroli sektorowych UODO na 2026 (opublikowany 8.01.2026) obejmuje sektor marketingowy, w tym weryfikację baz danych używanych w działaniach marketingowych. Pełna klauzula nie mieści się w zaproszeniu LinkedIn (limit 300 znaków) ani na wizytówce — jedynym nośnikiem jest krótki link, więc brak `dist/rodo.html` to soft-404 pod adresem, do którego odsyła każdy szablon outboundu, i cała podstawa zgodności znika. Prawo sprzeciwu schowane jako siódmy punkt listy praw narusza art. 21 ust. 4 nawet wtedy, gdy sama treść jest poprawna.

## Niepoprawnie

```tsx
// site/src/prerender/entry.tsx — RodoShell: ogólnik + sprzeciw jako punkt listy
<h2>Skąd mamy Twoje dane</h2>
<p>Dane pozyskaliśmy ze źródeł publicznie dostępnych.</p>           {/* dokładnie to zakwestionowano u Bisnode */}
<h2>Przysługujące prawa</h2>
<ul>
  <li>prawo dostępu do danych</li>
  <li>prawo sprostowania</li>
  <li>prawo usunięcia</li>
  <li>prawo wniesienia sprzeciwu</li>                               {/* art. 21 ust. 4: musi być ODRĘBNIE */}
</ul>
<p>Dane przechowujemy przez okres niezbędny do realizacji celu.</p> {/* brak okresu */}
```
```ts
// szablon outboundu bez adresu klauzuli — obowiązek z art. 14 niewykonany
const invite = { pl: "Dzień dobry, budujemy narzędzia pod proces. Umówimy 30 minut?" };
```

## Poprawnie

```ts
// site/src/data/pagesSeo.ts
rodo: {
  title:       { pl: "RODO i prywatność", en: "Privacy and GDPR" },
  description: { pl: "Skąd mamy Twoje dane, na jakiej podstawie je przetwarzamy, jak długo je trzymamy i jak jednym mailem wnieść sprzeciw wobec kontaktu.", en: "…" },
},
```
```tsx
// site/src/prerender/entry.tsx — RodoShell (fragmenty kluczowe)
<h2 id="zrodla">Skąd mamy Twoje dane</h2>
<ul>
  <li>z ogłoszenia o pracę opublikowanego na portalu pracuj.pl w dniu wskazanym w naszej pierwszej wiadomości</li>
  <li>z Krajowego Rejestru Sądowego (KRS) albo z Centralnej Ewidencji i Informacji o Działalności Gospodarczej (CEIDG)</li>
  <li>ze strony internetowej Twojej firmy albo z jej profilu na LinkedIn</li>
</ul>
<p>Nie kupujemy baz danych i nie korzystamy z brokerów danych.</p>

<section id="sprzeciw" className="panel panel-accent">        {/* art. 21 ust. 4: odrębnie i wyraźnie */}
  <h2>Prawo sprzeciwu</h2>
  <p>W każdej chwili możesz wnieść sprzeciw wobec przetwarzania Twoich danych do celów marketingu bezpośredniego.
     Po sprzeciwie natychmiast przestajemy je przetwarzać w tym celu i usuwamy Cię z bazy kontaktów.</p>
  <a href="mailto:kontakt@klarow.com?subject=Sprzeciw%20wobec%20przetwarzania%20danych">kontakt@klarow.com — wnieś sprzeciw</a>
</section>

<h2 id="okres">Jak długo trzymamy dane</h2>
<p>Do zgłoszenia sprzeciwu, a jeśli sprzeciw nie wpłynie — nie dłużej niż 24 miesiące od ostatniego kontaktu.</p>
<h2 id="organ">Skarga do organu</h2>
<p>Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.</p>
```
```text
# site/public/_redirects
/polityka-prywatnosci   /rodo   301
```
```tsx
// site/src/components/Footer.tsx — link na każdej trasie
<Link to="/rodo">{pick({ pl: "RODO i prywatność", en: "Privacy and GDPR" }, lang)}</Link>
```

## Test

```bash
cd site && npm run build && cd ..
test -f site/dist/rodo.html && echo "OK /rodo"                                       # brak pliku = BLOCKER
find site/dist -name "*.html" | wc -l                                                # 19
grep -ciE "źródeł publicznie dostępnych|ogólnodostępnych rejestrów" site/dist/rodo.html   # 0
grep -ciE "Krajowego Rejestru Sądowego|CEIDG" site/dist/rodo.html                    # >= 1
grep -ciE "ogłoszeni[ae] o prac" site/dist/rodo.html                                 # >= 1
grep -coE "id=.sprzeciw." site/dist/rodo.html                                        # 1 (odrębna sekcja)
grep -ciE "mailto:kontakt@klarow.com\?subject=Sprzeciw" site/dist/rodo.html          # >= 1
grep -ciE "Stawki 2" site/dist/rodo.html                                             # 1 (adres UODO)
grep -ciE "okres niezbędny" site/dist/rodo.html                                      # 0 (okres musi być konkretny)
for f in $(find site/dist -name "*.html" ! -name "404.html"); do grep -q "href=\"/rodo\"" "$f" || echo "FAIL brak linku w stopce: $f"; done
grep -nE "^/polityka-prywatnosci[[:space:]]+/rodo[[:space:]]+301" site/public/_redirects   # 1
node ".claude/skills/klarow-guardian/scripts/verify-site.mjs"                        # findings o id legal-rodo-page-required: 0
grep -rciE "klarow.com/rodo" leadscout/playbook-outbound.md                          # >= 1 (każdy szablon niesie adres klauzuli)
```

## Wyjątki

Do przeglądu radcy (D-21) `/rodo` ma `<meta name="robots" content="noindex">`: jest publicznie dostępna, ale nie indeksowana, i wtedy nie wchodzi do `sitemap.xml` (tak jak `404.html`), mimo że liczy się do 19 HTML. Wersja EN jest tłumaczeniem informacyjnym z adnotacją „w razie rozbieżności wiążąca jest wersja polska"; `i18n-pl-en-pair-required` obowiązuje dla nawigacji, nagłówków i meta tej trasy, ale nie wymaga tłumaczenia przysięgłego treści prawnej. `verify-site.mjs` zgłasza findings tej reguły pod pełnym id `legal-rodo-page-required` (`scripts/verify-site.mjs:224, 226`); żaden skrót ani alias id nie istnieje.
