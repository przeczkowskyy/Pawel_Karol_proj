---
id: copy-excel-as-symptom-not-identity
title: Excel = symptom, wejście i hak; nigdy definicja klienta w H1, meta, JSON-LD, llms.txt, promptcie bota
impact: HIGH
tags: [copy, excel, positioning, messaging, seo]
source: strategy.md T1, D2, §2.5 („Firmy, które wyrosły na Excelu" schodzi z H1/meta/JSON-LD/llms), §2.6 (mapa Excel-locka: 11 miejsc), §9 p.2 / synthesis D-02, §2.8 p.5, brand-excel-symptom / CLAUDE.md 2026-07-27 (reframe: szeroki wachlarz)
added: 2026-09-12
---

## Zasada

Słowo „Excel" (i „arkusz", „Windows + Excel", „wyrosły na Excelu") NIE występuje w: H1, `pagesSeo.*`, `ORG_JSONLD.description`, `llms.txt` (nagłówek i opis firmy), `index.html` meta, prompcie bota, nagłówkach LinkedIn, chipach hero, sekcji „Co budujemy". Występuje WYŁĄCZNIE jako: (1) symptom w kartach bólu i FAQ „ERP" („gdzie ERP się kończy, a zaczyna Excel"); (2) wejście w opisach narzędzi (`tools.ts`: „wklejasz tabelę z Excela", „ERP → Excel bez przeklejania"); (3) hak sprzedażowy „Przyślij nam swój najgorszy Excel" na `/oferta`, na podstronach narzędzi (CTA drugorzędne) i w outboundzie; (4) przypis kwalifikatora na `/oferta`: „Narzędzia, które piszą do Twoich plików Excel, wymagają Windows + Excel na stanowisku; integracje i panele stawiamy na Twoim komputerze lub serwerze." Nowe FAQ „Czy to tylko Excel?" odpowiada „Nie". Wyróżnik „zero chmury" nie mówi „w Twoim Excelu", lecz „u Ciebie: na Twoim komputerze lub serwerze".

## Mechanizm awarii (dlaczego)

Reframe 2026-07-27 przeniósł pozycjonowanie z „12 narzędzi dla firm wyrosłych na Excelu" na „budujemy pod proces: kontroling, integracje (KSeF, ERP), importy, obieg, panele". KSeF (Flask + SQLite + React na serwerze) nie ma nic wspólnego z Excelem; H1 z Excelem mówi CFO „to firma od makr", a integracje i panele wypadają z jego wyobrażenia (T1). Jednocześnie hak „najgorszy Excel" jest najskuteczniejszym otwarciem rozmowy (playbook: 4 szablony) i musi zostać, ale jako mechanizm, nie tożsamość. Mapa Excel-locka (`strategy.md` §2.6) wskazuje 11 miejsc do zmiany; audyt pilnuje, żeby nie wróciły.

## Niepoprawnie

```ts
h1: { pl: "Automatyzacja i porządek w danych dla firm, które wyrosły na Excelu." }
description: { pl: "Porządek w danych dla firm 20–250 osób wyrosłych na Excelu. 12 działających demo…" }
zeroCloud: { pl: "Działa w Twoim Excelu, także bez internetu. Dane zostają w Twoim Excelu." }
llms: "> Custom narzędzia pod proces dla firm 20–250 osób, które „wyrosły na Excelu" (Windows + Excel)…"
```

## Poprawnie

```ts
h1: MESSAGING.oneLiner   // „Narzędzia pod Twój proces. Działają w dni, dane zostają u Ciebie."
painCard: { pl: "Zamknięcie miesiąca to 3 dni sklejania arkuszy z ERP, magazynu i plików." }          // symptom
toolIo: { pl: "Wejście: tabela wklejona z Excela albo CSV. Wyjście: 3 KPI, wykres, tabela." }         // wejście
ofertaHook: { pl: "Przyślij nam swój najgorszy Excel. W 30 minut pokażemy, co da się z nim zrobić." } // hak
ofertaFootnote: { pl: "Narzędzia, które piszą do Twoich plików Excel, wymagają Windows + Excel na stanowisku; integracje i panele stawiamy na Twoim komputerze lub serwerze." }
faq: { q: "Czy to tylko Excel?", a: "Nie. Excel jest częstym wejściem, nie warunkiem. Budujemy integracje (KSeF, ERP, API), panele webowe i obiegi dokumentów na Twoim serwerze." }
```

## Test

```bash
# Excel w miejscach zakazanych
grep -niE "excel|arkusz" site/src/data/pagesSeo.ts site/src/data/messaging.ts                       # 0
grep -oE "<h1[^>]*>[^<]*" site/dist/*.html site/dist/narzedzia/*.html | grep -i excel               # 0
grep -nE "\"description\":\"[^\"]*[Ee]xcel" site/dist/index.html                                    # 0 (JSON-LD Organization)
sed -n '1,8p' site/dist/llms.txt | grep -i excel                                                     # 0 (nagłówek llms)
grep -niE "wyros(ł|l)(y|a|e) na Excelu|Windows \+ Excel" site/src site/dist post-bot/worker.js 2>/dev/null | grep -v "site/src/data/oferta.ts"   # 0 (przypis tylko w oferta.ts)
# hak zostaje
grep -c "najgorszy Excel" site/dist/oferta.html                                                      # ≥ 1
```

Severity: HIGH.

## Wyjątki

Karty bólu, FAQ „ERP" i „Czy to tylko Excel?", opisy wejść narzędzi, przypis na `/oferta`, hak w outboundzie i na podstronach. `demo/` (prezentacja M2) pozostaje bez zmian (historyczny).
