import { Link } from "react-router-dom";
import { Calculator, Check, CloudOff, Play, X as XIcon } from "lucide-react";
import { useLang, pick } from "@/i18n";

/* Sekcja wyróżników (decyzja founderów 2026-07-22): on-prem to już za mało,
   gramy „prawdziwie zero chmury" (zero API do LLM, zero serwera, działa
   w Excelu) + determinizm („kalkulator, nie wróżka"). Do tego blok
   ✕ Tradycyjnie / ✓ Klarow i galeria gotowych narzędzi z liczbą
   before/after (liczby z wdrożeń wewnętrznych, opisane anonimowo). */

const T = {
  pl: {
    zeroTitle: "Prawdziwie zero chmury",
    zeroBody:
      "Modni „AI-agenci” i tak wysyłają Twoje dane do API modeli językowych i potrzebują serwera albo hostingu. Nasze narzędzia — nie. Działają w Twoim Excelu, na Twoim komputerze.",
    zeroBullets: [
      "Zero API do modeli językowych — żadna liczba nie opuszcza firmy",
      "Zero serwera i kont w chmurze — narzędzie uruchamiasz dwuklikiem",
      "Działa w Twoim Excelu, także bez internetu",
    ],
    detTitle: "Determinizm — kalkulator, nie wróżka",
    detBody:
      "AI pomaga nam budować narzędzie (stąd tempo wdrożenia). Ale samo narzędzie liczy zwykłym, deterministycznym kodem — żadna liczba nie powstaje „z modelu”.",
    detBullets: [
      "Te same dane zawsze dają ten sam wynik",
      "Jawna ścieżka wyliczenia — każdą liczbę sprawdzisz ręcznie (zobacz w demie powyżej)",
      "Sanity-check sum co do grosza i log każdej operacji",
    ],
    cmpBad: "Tradycyjnie: automatyzacja „z chmurą i AI”",
    cmpGood: "Klarow",
    cmp: [
      {
        bad: "Dane lecą do API modelu językowego i na serwer dostawcy",
        good: "Dane zostają w Twoim Excelu, na Twoim komputerze",
      },
      {
        bad: "Wynik „z modelu” — za każdym razem może wyjść inaczej",
        good: "Deterministyczny kalkulator — ten sam wynik i jawna ścieżka wyliczenia",
      },
      {
        bad: "Wdrożenie liczone w miesiącach, faktury za godziny",
        good: "Stała cena, ≤10 dni, druga rata po działającym odbiorze",
      },
      {
        bad: "Migracja do nowego systemu i szkolenia zespołu",
        good: "Excel zostaje — narzędzie wchodzi obok Twoich plików",
      },
      {
        bad: "Vendor lock-in: bez dostawcy wszystko staje",
        good: "Kod, dokumentacja i runbook zostają u Ciebie",
      },
    ],
    galleryLbl: "Gotowe narzędzia — wzorce z wdrożeń",
    tools: [
      {
        name: "Raport zarządczy",
        val: "z ~6 godz. do kilkunastu sekund",
        foot: "jednoplikowy raport HTML składany z dziesiątek plików",
        linkLabel: "Zobacz żywe demo",
        to: "/#demo",
        demo: true,
      },
      {
        name: "Import kosztów z ERP",
        val: "z 2 dni do kilkunastu minut",
        foot: "~10 000 wierszy miesięcznie: klasyfikacja słownikiem, backup, log audytowy",
        linkLabel: "Szczegóły modułu",
        to: "/moduly/importy-erp",
        demo: false,
      },
      {
        name: "Zamknięcie cyklu",
        val: "z pół dnia do kilkunastu sekund",
        foot: "~30 projektów opublikowanych jednym przyciskiem, z archiwum wersji",
        linkLabel: "Szczegóły modułu",
        to: "/moduly/zamkniecie-cyklu",
        demo: false,
      },
    ],
    galleryNote:
      "Liczby z wdrożeń wewnętrznych w firmie produkcyjno-budowlanej (portfel ~30 równoległych projektów, klienci w USA). Narzędzia w ofercie odtwarzamy od zera na tych wzorcach — na Twoich danych i Twoich plikach.",
  },
  en: {
    zeroTitle: "Truly zero cloud",
    zeroBody:
      "Fashionable “AI agents” still send your data to LLM APIs and need a server or hosting. Our tools don't. They run in your Excel, on your computer.",
    zeroBullets: [
      "Zero LLM API calls — no number ever leaves your company",
      "Zero servers and cloud accounts — you launch the tool with a double-click",
      "Runs in your Excel, even without internet",
    ],
    detTitle: "Determinism — a calculator, not a fortune teller",
    detBody:
      "AI helps us build the tool (that's where the speed comes from). But the tool itself computes with plain, deterministic code — no number ever comes “from a model”.",
    detBullets: [
      "The same data always gives the same result",
      "An explicit calculation path — you can check every number by hand (see the demo above)",
      "Totals sanity-checked to the cent and a log of every operation",
    ],
    cmpBad: "The usual way: “cloud + AI” automation",
    cmpGood: "Klarow",
    cmp: [
      {
        bad: "Data flows to an LLM API and the vendor's server",
        good: "Data stays in your Excel, on your computer",
      },
      {
        bad: "Results “from a model” — they can come out different every time",
        good: "A deterministic calculator — same result, explicit calculation path",
      },
      {
        bad: "Deployment measured in months, invoices for hours",
        good: "Fixed price, ≤10 days, second instalment after a working handover",
      },
      {
        bad: "Migration to a new system and team trainings",
        good: "Excel stays — the tool works alongside your files",
      },
      {
        bad: "Vendor lock-in: everything stops without the vendor",
        good: "Code, documentation and runbook stay with you",
      },
    ],
    galleryLbl: "Ready tools — patterns from deployments",
    tools: [
      {
        name: "Board report",
        val: "from ~6 hours to seconds",
        foot: "a single-file HTML report assembled from dozens of files",
        linkLabel: "See the live demo",
        to: "/#demo",
        demo: true,
      },
      {
        name: "ERP cost imports",
        val: "from 2 days to minutes",
        foot: "~10,000 rows a month: dictionary classification, backup, audit log",
        linkLabel: "Module details",
        to: "/moduly/importy-erp",
        demo: false,
      },
      {
        name: "Cycle close",
        val: "from half a day to seconds",
        foot: "~30 projects published with one click, with a version archive",
        linkLabel: "Module details",
        to: "/moduly/zamkniecie-cyklu",
        demo: false,
      },
    ],
    galleryNote:
      "Numbers from internal deployments at a manufacturing-and-construction company (~30 parallel projects, US clients). The tools we sell are rebuilt from scratch on these patterns — on your data and your files.",
  },
};

export default function Differentiators() {
  const { lang } = useLang();
  const t = pick(lang, T);

  return (
    <div className="flex flex-col gap-4">
      {/* dwa twarde wyróżniki */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: CloudOff, title: t.zeroTitle, body: t.zeroBody, bullets: t.zeroBullets },
          { icon: Calculator, title: t.detTitle, body: t.detBody, bullets: t.detBullets },
        ].map((c) => (
          <div key={c.title} className="card" style={{ padding: 22 }}>
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center"
              style={{ background: "rgba(168,180,194,.14)", color: "var(--primary)" }}
            >
              <c.icon size={19} />
            </div>
            <h3 className="mt-3 text-[17px] font-extrabold" style={{ color: "var(--heading)" }}>
              {c.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--foreground)" }}>
              {c.body}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--foreground)" }}>
                  <Check size={14} style={{ color: "var(--funded)", flex: "0 0 auto", marginTop: 2 }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ✕ Tradycyjnie / ✓ Klarow */}
      <div className="card" style={{ padding: 22 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div className="lbl-sm flex items-center gap-2">
            <XIcon size={13} style={{ color: "var(--rejected)" }} /> {t.cmpBad}
          </div>
          <div className="lbl-sm hidden md:flex items-center gap-2">
            <Check size={13} style={{ color: "var(--funded)" }} /> {t.cmpGood}
          </div>
          {t.cmp.map((row) => (
            <div key={row.bad} className="contents">
              <div
                className="flex items-start gap-2 text-[13px] pb-4 border-b md:border-b-0"
                style={{ color: "var(--muted-foreground)", borderColor: "var(--border)" }}
              >
                <XIcon size={14} style={{ color: "var(--rejected)", flex: "0 0 auto", marginTop: 2 }} />
                {row.bad}
              </div>
              <div
                className="flex items-start gap-2 text-[13px] pb-4 border-b last:border-b-0 md:border-b-0"
                style={{ color: "var(--foreground)", borderColor: "var(--border)" }}
              >
                <Check size={14} style={{ color: "var(--funded)", flex: "0 0 auto", marginTop: 2 }} />
                {row.good}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* galeria gotowych narzędzi (before/after) */}
      <div>
        <div className="lbl-sm" style={{ margin: "8px 0 12px" }}>{t.galleryLbl}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.to}
              className="card h-full flex flex-col gap-2"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <div className="lbl-sm">{tool.name}</div>
              <div className="text-[19px] font-extrabold leading-snug tracking-tight" style={{ color: "var(--heading)" }}>
                {tool.val}
              </div>
              <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
                {tool.foot}
              </p>
              <span
                className="inline-flex items-center gap-1.5 text-[12.5px] font-bold"
                style={{ color: "var(--accent-foreground)" }}
              >
                {tool.demo && <Play size={13} />} {tool.linkLabel}
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[11.5px]" style={{ color: "var(--muted-foreground)" }}>
          {t.galleryNote}
        </p>
      </div>
    </div>
  );
}
