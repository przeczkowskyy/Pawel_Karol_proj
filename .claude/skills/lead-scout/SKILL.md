---
name: lead-scout
description: Agent researchu leadów Klarow — znajduje firmy pasujące do ICP (PL/US), weryfikuje je, ocenia, dopisuje do leadscout/leads.json i wysyła digest na Telegram (@Klarow_BOT). Wywołuj przez /lead-scout (jedna runda) albo cyklicznie przez /loop.
---

# Lead-Scout — agent pozyskiwania leadów Klarow

Cel jednej rundy: **5–10 NOWYCH, zweryfikowanych firm** pasujących do ICP,
dopisanych do bazy i wysłanych digestem na Telegram founderów.

## Kogo szukamy (ICP)

Klarow (klarow.com) sprzedaje automatyzację raportowania i pracy na danych dla MŚP
„wyrosłych na Excelu": narzędzia on-premise (dane nie wychodzą z firmy, zero chmury,
deterministyczne — „kalkulator, nie wróżka"), wdrożenie 5–10 dni, stała cena, praca na
kopii plików. 12 działających narzędzi w 5 działach (kontroling, finanse, produkcja,
dane, administracja) — wejściowe: **Audyt jakości danych** (read-only) i **Raport
zarządczy**; nisza USA: **fakturowanie AIA G702/G703**.

**Idealna firma:** 50–150 osób (akceptowalnie 20–250) · produkcja dyskretna /
budowlano-montażowa / dystrybucja i hurt B2B · przychód ~20–150 mln PLN · Windows +
Excel · ERP jest (Comarch Optima/XL, enova365, Subiekt GT/nexo, Navireo, Symfonia),
ale kontroling i raportowanie żyją w Excelu · wąskie gardło = jedna osoba
„człowiek-Excel". **Decydent:** właściciel (do ~100 osób) lub CFO; champion: główna
księgowa / kierownik kontrolingu. **USA (od ~6. miesiąca):** modular construction
manufacturers i specialty subcontractors 50–250 osób wystawiający AIA G702/G703.

**Sygnały zakupu** (firma z sygnałem > firma bez sygnału):
ogłoszenie o pracę „kontroler finansowy / analityk / specjalista ds. raportowania"
z wymogiem Excel/VBA (najsilniejszy — ktoś właśnie odszedł albo toną w robocie) ·
nowy CFO / zmiana w zarządzie · szybki wzrost (Gazele Biznesu, Diamenty Forbesa,
nowa hala, duży kontrakt) · audyt / due diligence · trwające albo utknięte wdrożenie
ERP · wymogi raportowe dużego klienta korporacyjnego.

## Scoring (0–10; do digestu trafia ≥6)

- +3 sektor rdzeniowy (produkcja / budowlano-montażowa / dystrybucja B2B)
- +2 zatrudnienie 50–150 potwierdzone źródłem (+1, gdy tylko w widełkach 20–250)
- +3 aktywny sygnał zakupu z URL-em (ogłoszenie o kontrolera z Excelem = pełne +3;
  nowy CFO / nowa hala / wdrożenie ERP = +2; sam szybki wzrost = +1)
- +1 decyzyjność właścicielska (firma rodzinna, właściciel aktywny operacyjnie)
- +1 widoczny stack Windows/Excel/ERP z listy (np. w ogłoszeniach o pracę firmy)
- −3 oddział korporacji / grupy kapitałowej albo rozbudowany dział IT
- **odrzuć**: firma niepotwierdzona źródłem, domena nie działa, <20 osób,
  softwarehouse / konkurent, poza PL i USA

## Procedura rundy

1. **Wczytaj stan:** `leadscout/leads.json` (lista znanych firm — dedupe po nazwie
   I po domenie) oraz `leadscout/nastepne-rundy.md` (kolejka tematów researchu —
   weź 2–3 z góry; wykonane wykreśl na końcu rundy).
2. **Research** (WebSearch + WebFetch; jeśli odroczone — załaduj przez ToolSearch).
   Strategie, rotuj między rundami:
   - **Ogłoszenia o pracę** (najlepsze leady): pracuj.pl / rocketjobs.pl / LinkedIn
     Jobs — frazy „kontroler finansowy Excel", „analityk finansowy VBA", „specjalista
     ds. raportowania" + filtr branży produkcja/budownictwo/handel B2B.
   - **Listy szybkiego wzrostu:** laureaci Gazele Biznesu / Diamenty Forbesa
     w produkcji i budownictwie (roczniki bieżące i poprzedni).
   - **Katalogi wystawców targów:** ITM Poznań, Budma, Warsaw Industry Week, Symas.
   - **Agregatory rejestrów:** rejestr.io, aleo.com — filtry PKD + zatrudnienie.
   - **Prasa gospodarcza regionalna:** nowe hale, rozbudowy, duże kontrakty.
   - **USA:** Modular Building Institute member directory, wystawcy World of Modular,
     AGC/ABC chapters, Indeed „pay application" / „project accountant".
3. **Weryfikacja każdej firmy** (bez tego lead nie istnieje): domena działa i należy
   do tej firmy · rozmiar 20–250 osób z podanym źródłem szacunku · branża się zgadza.
   Nie wymyślaj firm ani domen — lepiej 5 pewnych niż 10 wątpliwych.
4. **Scoring + hook:** oceń wg tabeli; dla każdego leada napisz 1 zdanie otwarcia
   kontaktu nawiązujące do JEGO sytuacji (sygnału) i haka „przyślij nam swój
   najgorszy Excel — w 30 minut pokażemy, co z nim zrobimy". Bez słowa „AI".
5. **Zapisz** nowe firmy do `leadscout/leads.json` ze statusem `nowy` (format niżej).
6. **Digest** do `leadscout/digesty/digest-RRRR-MM-DD.md` (data = dzisiejsza):
   nagłówek (ile nowych / ile w bazie), potem każdy lead: nazwa · www · lokalizacja ·
   rozmiar · ocena/10 · sygnał (z URL-em) · hook. Na końcu: „następna runda: …".
   Digest pisz zwykłym tekstem bez tabel (czytelny na telefonie w Telegramie).
7. **Wyślij:** `node leadscout/notify.mjs --file leadscout/digesty/digest-RRRR-MM-DD.md`
   (uwaga: w tym repo `npx` nie działa — wywołuj `node` wprost; skrypt sam wykrywa
   chat_id, warunek: founder napisał kiedyś cokolwiek do @Klarow_BOT).
8. **Domknij:** zaktualizuj `nastepne-rundy.md` (wykreśl zrobione, dopisz świeże
   pomysły z rundy), commit po polsku + push na `main`.

## Format leadscout/leads.json

```json
{
  "leady": [
    {
      "nazwa": "…",
      "www": "https://…",
      "lokalizacja": "miasto, województwo / stan",
      "segment": "pl-produkcja | pl-budownictwo | pl-dystrybucja | us-construction",
      "rozmiar": "np. ~80 osób (źródło: aleo.com)",
      "ocena": 7,
      "sygnal": "opis sygnału zakupu albo null",
      "zrodlo_url": "URL potwierdzający firmę/sygnał",
      "hook": "1 zdanie otwarcia kontaktu",
      "status": "nowy",
      "data_dodania": "RRRR-MM-DD"
    }
  ]
}
```

**Statusy:** `nowy` → `wyslany` (poszedł w digestcie na Telegram; ustaw w tej samej
rundzie) → `kontakt` (founderzy napisali) → `rozmowa` / `odrzucony` (founderzy
aktualizują ręcznie albo poleceniem w sesji).
