/* Fikcyjny zestaw danych DEMO M2 (Raport zarządczy) — 7 projektów × 5 etapów
   fikcyjnej firmy produkcyjno-budowlanej. Liczby ułożone tak, żeby raport
   pokazał: 2 projekty w ryzyku (Łódź, Katowice), 2 do obserwacji, przeciek
   kosztów na etapie Montaż. Te same dane w PL i EN (identyczne liczby). */

export const DEMO_SAMPLE = {
  pl: `Projekt;Etap;Budżet [zł];Koszt [zł];Zaawansowanie [%];Komentarz
Hala magazynowa Poznań;Projektowanie;400000;395000;100;
Hala magazynowa Poznań;Prefabrykacja;2100000;1850000;90;
Hala magazynowa Poznań;Montaż;2400000;1620000;68;
Hala magazynowa Poznań;Instalacje;900000;310000;35;
Hala magazynowa Poznań;Wykończenia;600000;60000;10;
Osiedle modułowe Gdańsk;Projektowanie;600000;640000;100;Przeprojektowanie węzłów — dopłata biura projektowego
Osiedle modułowe Gdańsk;Prefabrykacja;3500000;2300000;60;
Osiedle modułowe Gdańsk;Montaż;2600000;900000;30;
Osiedle modułowe Gdańsk;Instalacje;1000000;150000;12;
Osiedle modułowe Gdańsk;Wykończenia;500000;0;0;
Biurowiec Łódź;Projektowanie;450000;460000;100;
Biurowiec Łódź;Prefabrykacja;1900000;1980000;95;Dopłata za stal konstrukcyjną — ceny +12% kw/kw
Biurowiec Łódź;Montaż;2200000;1750000;65;Nadgodziny brygad po opóźnieniu dostaw
Biurowiec Łódź;Instalacje;850000;240000;25;
Biurowiec Łódź;Wykończenia;500000;30000;5;
Rozbudowa zakładu Wrocław;Projektowanie;300000;290000;100;
Rozbudowa zakładu Wrocław;Prefabrykacja;1100000;420000;40;
Rozbudowa zakładu Wrocław;Montaż;800000;90000;10;
Rozbudowa zakładu Wrocław;Instalacje;350000;0;0;
Rozbudowa zakładu Wrocław;Wykończenia;150000;0;0;
Hala produkcyjna Katowice;Projektowanie;250000;250000;100;
Hala produkcyjna Katowice;Prefabrykacja;1200000;1260000;100;
Hala produkcyjna Katowice;Montaż;1100000;1190000;92;Poprawki po kontroli spawów — dodatkowa brygada
Hala produkcyjna Katowice;Instalacje;500000;430000;75;
Hala produkcyjna Katowice;Wykończenia;250000;90000;30;
Centrum logistyczne Toruń;Projektowanie;500000;480000;100;
Centrum logistyczne Toruń;Prefabrykacja;2900000;1450000;50;
Centrum logistyczne Toruń;Montaż;2300000;690000;30;
Centrum logistyczne Toruń;Instalacje;950000;95000;10;
Centrum logistyczne Toruń;Wykończenia;450000;0;0;
Pawilony handlowe Rzeszów;Projektowanie;350000;370000;100;
Pawilony handlowe Rzeszów;Prefabrykacja;1800000;1310000;70;
Pawilony handlowe Rzeszów;Montaż;1500000;700000;44;Opóźnienie dostaw ślusarki — 2 tygodnie
Pawilony handlowe Rzeszów;Instalacje;550000;130000;22;
Pawilony handlowe Rzeszów;Wykończenia;300000;20000;5;
`,
  en: `Project;Stage;Budget;Cost;Progress [%];Comment
Poznań warehouse hall;Design;400000;395000;100;
Poznań warehouse hall;Prefabrication;2100000;1850000;90;
Poznań warehouse hall;Assembly;2400000;1620000;68;
Poznań warehouse hall;Installations;900000;310000;35;
Poznań warehouse hall;Finishes;600000;60000;10;
Gdańsk modular estate;Design;600000;640000;100;Node redesign — design office surcharge
Gdańsk modular estate;Prefabrication;3500000;2300000;60;
Gdańsk modular estate;Assembly;2600000;900000;30;
Gdańsk modular estate;Installations;1000000;150000;12;
Gdańsk modular estate;Finishes;500000;0;0;
Łódź office building;Design;450000;460000;100;
Łódź office building;Prefabrication;1900000;1980000;95;Structural steel surcharge — prices +12% q/q
Łódź office building;Assembly;2200000;1750000;65;Crew overtime after delivery delays
Łódź office building;Installations;850000;240000;25;
Łódź office building;Finishes;500000;30000;5;
Wrocław plant extension;Design;300000;290000;100;
Wrocław plant extension;Prefabrication;1100000;420000;40;
Wrocław plant extension;Assembly;800000;90000;10;
Wrocław plant extension;Installations;350000;0;0;
Wrocław plant extension;Finishes;150000;0;0;
Katowice production hall;Design;250000;250000;100;
Katowice production hall;Prefabrication;1200000;1260000;100;
Katowice production hall;Assembly;1100000;1190000;92;Weld inspection rework — extra crew
Katowice production hall;Installations;500000;430000;75;
Katowice production hall;Finishes;250000;90000;30;
Toruń logistics centre;Design;500000;480000;100;
Toruń logistics centre;Prefabrication;2900000;1450000;50;
Toruń logistics centre;Assembly;2300000;690000;30;
Toruń logistics centre;Installations;950000;95000;10;
Toruń logistics centre;Finishes;450000;0;0;
Rzeszów retail pavilions;Design;350000;370000;100;
Rzeszów retail pavilions;Prefabrication;1800000;1310000;70;
Rzeszów retail pavilions;Assembly;1500000;700000;44;Metalwork delivery delay — 2 weeks
Rzeszów retail pavilions;Installations;550000;130000;22;
Rzeszów retail pavilions;Finishes;300000;20000;5;
`,
};
