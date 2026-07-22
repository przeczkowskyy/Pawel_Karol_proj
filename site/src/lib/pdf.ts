/* Generator PDF dokumentów narzędzi — POBIERANIE pliku (bez okna druku).
   pdfmake ładowany lazy (osobny chunk dopiero przy pierwszym kliknięciu);
   wbudowany Roboto ma polskie znaki. Dokument projektowany tak, by treść
   mieściła się na JEDNEJ stronie A4: mały, gęsty layout tabel. */

export interface PdfDoc {
  filename: string;
  title: string;
  subtitle?: string;
  metaLines?: string[];
  table: {
    head: string[];
    body: (string | number)[][];
    foot?: (string | number)[];
    /* szerokości kolumn pdfmake: "auto" | "*" | liczba */
    widths?: (string | number)[];
    /* indeksy kolumn wyrównanych do prawej (liczby) */
    alignRight?: number[];
  };
  note?: string;
  signatures?: [string, string];
}

export async function downloadPdf(doc: PdfDoc): Promise<void> {
  const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
    import("pdfmake/build/pdfmake"),
    import("pdfmake/build/vfs_fonts"),
  ]);
  pdfMake.vfs = pdfFonts.pdfMake?.vfs ?? pdfFonts.vfs ?? pdfMake.vfs;

  const right = new Set(doc.table.alignRight ?? []);
  const cell = (v: string | number, ci: number, bold = false) => ({
    text: String(v),
    bold,
    alignment: right.has(ci) ? ("right" as const) : ("left" as const),
    noWrap: right.has(ci),
  });

  const tableBody: object[][] = [
    doc.table.head.map((h, ci) => ({
      text: h.toUpperCase(),
      bold: true,
      fontSize: 7.5,
      color: "#444444",
      alignment: right.has(ci) ? "right" : "left",
    })),
    ...doc.table.body.map((row) => row.map((v, ci) => cell(v, ci))),
  ];
  if (doc.table.foot) tableBody.push(doc.table.foot.map((v, ci) => cell(v, ci, true)));

  const content: object[] = [
    { text: "KLAROW", bold: true, fontSize: 11, characterSpacing: 2.5, margin: [0, 0, 0, 2] },
    { text: doc.title, bold: true, fontSize: 14, margin: [0, 0, 0, doc.subtitle ? 2 : 8] },
  ];
  if (doc.subtitle) content.push({ text: doc.subtitle, fontSize: 9, color: "#555555", margin: [0, 0, 0, 8] });
  if (doc.metaLines?.length) {
    content.push({
      columns: doc.metaLines.map((m) => ({ text: m, fontSize: 9 })),
      columnGap: 16,
      margin: [0, 0, 0, 10],
    });
  }
  content.push({
    table: {
      headerRows: 1,
      widths: doc.table.widths ?? doc.table.head.map((_, i) => (i === 1 ? "*" : "auto")),
      body: tableBody,
    },
    layout: {
      hLineWidth: () => 0.6,
      vLineWidth: () => 0.6,
      hLineColor: () => "#999999",
      vLineColor: () => "#999999",
      paddingLeft: () => 6,
      paddingRight: () => 6,
      paddingTop: () => 3.5,
      paddingBottom: () => 3.5,
    },
    fontSize: 8.5,
  });
  if (doc.note) content.push({ text: doc.note, fontSize: 8, color: "#666666", margin: [0, 10, 0, 0] });
  if (doc.signatures) {
    content.push({
      columns: doc.signatures.map((s) => ({
        stack: [
          { canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.8, lineColor: "#555555" }] },
          { text: s, fontSize: 8, color: "#555555", margin: [0, 4, 0, 0] },
        ],
      })),
      columnGap: 40,
      margin: [0, 44, 0, 0],
    });
  }

  pdfMake
    .createPdf({
      pageSize: "A4",
      pageMargins: [40, 36, 40, 40],
      defaultStyle: { fontSize: 9 },
      info: { title: doc.title, author: "Klarow" },
      footer: (page: number, pages: number) => ({
        columns: [
          { text: "klarow.com · dokument DEMO — dane fikcyjne", fontSize: 7, color: "#888888" },
          { text: `${page} / ${pages}`, alignment: "right", fontSize: 7, color: "#888888" },
        ],
        margin: [40, 8, 40, 0],
      }),
      content,
    })
    .download(doc.filename);
}
