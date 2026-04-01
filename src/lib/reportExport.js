export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function loadJsPdf() {
  const jspdfMod = await import('jspdf');
  return jspdfMod.jsPDF ?? jspdfMod.default ?? jspdfMod;
}

async function svgUrlToPngDataUrl(svgUrl, { width = 120 } = {}) {
  const res = await fetch(svgUrl);
  if (!res.ok) throw new Error('logo_fetch_failed');
  const svgText = await res.text();

  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);

  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = objectUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const scale = width / (img.naturalWidth || 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round((img.naturalWidth || width) * scale));
    canvas.height = Math.max(1, Math.round((img.naturalHeight || width) * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas_context_failed');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function safeSvgUrlToPngDataUrl(svgUrl, { width = 120 } = {}) {
  if (!svgUrl) return null;
  try {
    return await svgUrlToPngDataUrl(svgUrl, { width });
  } catch (err) {
    console.warn('failed to convert svg to png', err);
    return null;
  }
}

function addHeader(doc, { title, logoDataUrl, createdAt } = {}) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;

  let x = margin;
  const top = 26;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', margin, 18, 84, 22, undefined, 'FAST');
      x = margin + 92;
    } catch (err) {
      console.warn('failed to embed logo', err);
    }
  }

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(18);
  doc.text(String(title ?? ''), x, top);

  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  const when = createdAt ? new Date(createdAt) : new Date();
  doc.text(when.toLocaleString('pt-PT'), margin, 48);

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, 56, pageWidth - margin, 56);
  return 68;
}

function addKeyValues(doc, items, { startY } = {}) {
  const margin = 36;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = startY ?? 68;
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(11);

  for (const [label, value] of items) {
    if (y > pageHeight - 48) {
      doc.addPage();
      y = 68;
    }
    doc.setTextColor(110, 110, 110);
    doc.text(String(label), margin, y);
    doc.setTextColor(20, 20, 20);
    doc.text(String(value), pageWidth - margin, y, { align: 'right' });
    y += 16;
  }
  return y + 6;
}

function addSectionTitle(doc, title, { startY } = {}) {
  const margin = 36;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = startY ?? 68;
  if (y > pageHeight - 60) {
    doc.addPage();
    y = 68;
  }
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(14);
  doc.text(String(title), margin, y);
  return y + 16;
}

function addTable(doc, { headers = [], rows = [], startY, columnWidths } = {}) {
  const margin = 36;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const widths =
    Array.isArray(columnWidths) && columnWidths.length === headers.length
      ? columnWidths
      : (() => {
          const total = pageWidth - margin * 2;
          const w = total / Math.max(1, headers.length);
          return headers.map(() => w);
        })();

  const lineHeight = 12;
  const padY = 6;
  const padX = 6;

  const drawHeader = (y) => {
    let x = margin;
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y - 12, pageWidth - margin * 2, 18, 'FD');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    for (let i = 0; i < headers.length; i += 1) {
      const text = doc.splitTextToSize(String(headers[i] ?? ''), widths[i] - padX * 2);
      doc.text(text, x + padX, y - 2);
      x += widths[i];
    }
    return y + 14;
  };

  let y = startY ?? 68;
  y = drawHeader(y);

  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.setDrawColor(235, 235, 235);

  for (const row of rows) {
    const cells = headers.map((_, i) => doc.splitTextToSize(String(row?.[i] ?? ''), widths[i] - padX * 2));
    const rowLines = Math.max(1, ...cells.map((c) => c.length));
    const rowHeight = rowLines * lineHeight + padY * 2;

    if (y + rowHeight > pageHeight - 36) {
      doc.addPage();
      y = 68;
      y = drawHeader(y);
    }

    let x = margin;
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y - 10, pageWidth - margin * 2, rowHeight, 'S');

    for (let i = 0; i < headers.length; i += 1) {
      const text = cells[i];
      const cellX = x + padX;
      const cellY = y + padY;
      doc.text(text, cellX, cellY);
      x += widths[i];
    }

    y += rowHeight;
  }

  return y + 10;
}

function moneyPt(value) {
  const n = Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toFixed(2).replace('.', ',');
}

const orderStatusLabelsPt = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  processing: 'Em preparação',
  shipped: 'Enviada',
  delivered: 'Entregue',
  cancelled: 'Cancelada',
};

function csvEscape(value, delimiter) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  const mustQuote = str.includes('"') || str.includes('\n') || str.includes('\r') || str.includes(delimiter);
  if (!mustQuote) return str;
  return `"${str.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename, rows, { delimiter = ';', includeBom = true } = {}) {
  const lines = (rows ?? []).map((row) => (row ?? []).map((v) => csvEscape(v, delimiter)).join(delimiter));
  const csv = `${includeBom ? '\uFEFF' : ''}${lines.join('\r\n')}\r\n`;
  downloadBlob(filename, new Blob([csv], { type: 'text/csv;charset=utf-8' }));
}

function parseHslTriplet(value) {
  const str = String(value ?? '').trim();
  if (!str) return null;
  const parts = str.split(/\s+/).filter(Boolean);
  if (parts.length < 3) return null;
  const h = Number(parts[0]);
  const s = Number(String(parts[1]).replace('%', ''));
  const l = Number(String(parts[2]).replace('%', ''));
  if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) return null;
  return { h, s, l };
}

function hslToHex({ h, s, l } = {}) {
  if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) return '#000000';
  const hh = (((h % 360) + 360) % 360) / 360;
  const ss = Math.max(0, Math.min(1, s / 100));
  const ll = Math.max(0, Math.min(1, l / 100));

  const hue2rgb = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  let r;
  let g;
  let b;

  if (ss === 0) {
    r = g = b = ll;
  } else {
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
    const p = 2 * ll - q;
    r = hue2rgb(p, q, hh + 1 / 3);
    g = hue2rgb(p, q, hh);
    b = hue2rgb(p, q, hh - 1 / 3);
  }

  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getThemeColorHex(varName, fallbackTriplet) {
  try {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    const parsed = parseHslTriplet(value || fallbackTriplet);
    return hslToHex(parsed ?? parseHslTriplet(fallbackTriplet));
  } catch {
    return hslToHex(parseHslTriplet(fallbackTriplet));
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureXlsFilename(filename, fallbackBase) {
  const name = String(filename || '').trim();
  if (name) return name.toLowerCase().endsWith('.xls') ? name : `${name}.xls`;
  return `${fallbackBase}.xls`;
}

function buildExcelHtml({ sheetName = 'ZANA', title, createdAt, logoDataUrl, sections = [] } = {}) {
  const primary = getThemeColorHex('--primary', '340 52% 31%');
  const foreground = getThemeColorHex('--foreground', '222.2 84% 4.9%');
  const muted = getThemeColorHex('--muted-foreground', '215.4 16.3% 46.9%');
  const border = getThemeColorHex('--border', '214.3 31.8% 91.4%');
  const background = getThemeColorHex('--background', '0 0% 100%');

  const when = createdAt ? new Date(createdAt) : new Date();

  const sectionHtml = (sections ?? [])
    .map((s) => {
      const rows = (s?.rows ?? [])
        .map(
          (r) =>
            `<tr>${(r ?? [])
              .map((c) => `<td class="cell">${escapeHtml(c)}</td>`)
              .join('')}</tr>`,
        )
        .join('');

      return `
        <table class="table">
          <tr>
            <td class="section" colspan="${Math.max(1, (s?.columns ?? 2) | 0)}">${escapeHtml(s?.title ?? '')}</td>
          </tr>
          ${s?.headers?.length ? `<tr>${s.headers.map((h) => `<th class="th">${escapeHtml(h)}</th>`).join('')}</tr>` : ''}
          ${rows}
        </table>
      `;
    })
    .join('\n');

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <!--[if gte mso 9]><xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${escapeHtml(sheetName)}</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml><![endif]-->
        <style>
          body { font-family: Calibri, Arial, sans-serif; color: ${foreground}; background: ${background}; }
          .header { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          .header td { padding: 8px 10px; vertical-align: middle; }
          .brand { font-size: 18px; font-weight: 700; color: ${foreground}; }
          .meta { font-size: 11px; color: ${muted}; text-align: right; }
          .table { width: 100%; border-collapse: collapse; margin: 14px 0; }
          .section { background: ${primary}; color: #ffffff; font-weight: 700; padding: 8px 10px; border: 1px solid ${border}; }
          .th { background: #f6f6f6; color: ${foreground}; font-weight: 700; padding: 7px 10px; border: 1px solid ${border}; text-align: left; }
          .cell { padding: 6px 10px; border: 1px solid ${border}; }
        </style>
      </head>
      <body>
        <table class="header">
          <tr>
            <td style="width: 220px;">
              ${logoDataUrl ? `<img src="${logoDataUrl}" style="height: 32px;" />` : ''}
            </td>
            <td>
              <div class="brand">${escapeHtml(title ?? '')}</div>
            </td>
            <td class="meta">${escapeHtml(when.toLocaleString('pt-PT'))}</td>
          </tr>
        </table>
        ${sectionHtml}
      </body>
    </html>
  `.trim();
}

export async function exportReportsExcel({
  filename,
  title = 'Relatórios',
  logoUrl,
  createdAt,
  stats,
  analytics,
  purchaseAdjustments,
} = {}) {
  const logoDataUrl = await safeSvgUrlToPngDataUrl(logoUrl, { width: 180 });
  const safeTitle = title || 'Relatórios';
  const file = ensureXlsFilename(filename, `relatorios_${new Date().toISOString().slice(0, 10)}`);

  const topViewed = analytics?.top_viewed_products ?? [];
  const topSearches = analytics?.top_searches ?? [];
  const topSold = analytics?.top_sold_products ?? [];
  const largestOrders = analytics?.largest_orders ?? [];

  const adjustments = purchaseAdjustments?.topProducts ?? [];

  const html = buildExcelHtml({
    sheetName: 'Relatórios',
    title: safeTitle,
    createdAt,
    logoDataUrl,
    sections: [
      {
        title: 'Resumo',
        columns: 2,
        rows: [
          ['Produtos', stats?.productsCount ?? 0],
          ['Unidades em Stock', stats?.stockUnits ?? 0],
          ['Baixo Stock (≤2)', stats?.lowStock ?? 0],
          ['Total em Compras (€)', moneyPt(stats?.purchasesTotal ?? 0)],
          ['Unidades devolvidas ao fornecedor', stats?.return_units ?? 0],
          ['Valor devolvido (€)', moneyPt(stats?.return_value ?? 0)],
          ['Unidades removidas do stock', stats?.writeoff_units ?? 0],
          ['Valor removido (€)', moneyPt(stats?.writeoff_value ?? 0)],
        ],
      },
      {
        title: 'Produtos mais vistos (30 dias)',
        columns: 2,
        headers: ['Produto', 'Views'],
        rows: topViewed.slice(0, 200).map((p) => [p.product_name ?? '', p.views ?? 0]),
      },
      {
        title: 'Mais pesquisas (30 dias)',
        columns: 2,
        headers: ['Pesquisa', 'Total'],
        rows: topSearches.slice(0, 200).map((q) => [q.query ?? '', q.count ?? 0]),
      },
      {
        title: 'Mais vendidos (30 dias)',
        columns: 2,
        headers: ['Produto', 'Quantidade'],
        rows: topSold.slice(0, 200).map((p) => [p.product_name ?? '', p.quantity ?? 0]),
      },
      {
        title: 'Maiores encomendas (30 dias)',
        columns: 3,
        headers: ['Email', 'Estado', 'Total (€)'],
        rows: largestOrders.slice(0, 200).map((o) => [
          o.customer_email ?? '',
          orderStatusLabelsPt[String(o.status ?? '')] ?? String(o.status ?? ''),
          moneyPt(o.total ?? 0),
        ]),
      },
      {
        title: 'Devoluções / Remoções (Compras)',
        columns: 5,
        headers: ['Produto', 'Devolvido (un.)', 'Removido (un.)', 'Valor devolvido (€)', 'Valor removido (€)'],
        rows: adjustments.slice(0, 200).map((p) => [
          p.product_name ?? '',
          p.devolvido ?? 0,
          p.removido ?? 0,
          moneyPt(p.devolvido_value ?? 0),
          moneyPt(p.removido_value ?? 0),
        ]),
      },
    ],
  });

  downloadBlob(file, new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }));
}

export async function exportFinanceExcel({ filename, title = 'Financeiro', logoUrl, createdAt, stats } = {}) {
  const logoDataUrl = await safeSvgUrlToPngDataUrl(logoUrl, { width: 180 });
  const safeTitle = title || 'Financeiro';
  const file = ensureXlsFilename(filename, `financeiro_${new Date().toISOString().slice(0, 10)}`);

  const html = buildExcelHtml({
    sheetName: 'Financeiro',
    title: safeTitle,
    createdAt,
    logoDataUrl,
    sections: [
      {
        title: 'Resumo',
        columns: 2,
        rows: [
          ['Investido em Stock (€)', moneyPt(stats?.invested ?? 0)],
          ['Valor Esperado (PVP) (€)', moneyPt(stats?.expected ?? 0)],
          ['Margem Potencial (€)', moneyPt(stats?.marginPotential ?? 0)],
          ['Receita (Entregue) (€)', moneyPt(stats?.revenueDelivered ?? 0)],
          ['Receita pendente (€)', moneyPt(stats?.revenueOpen ?? 0)],
          ['Canceladas (€)', moneyPt(stats?.revenueCancelled ?? 0)],
          ['Compras (Stock) (€)', moneyPt(stats?.purchasesStockTotal ?? 0)],
          ['Despesas (Logística) (€)', moneyPt(stats?.purchasesLogisticsTotal ?? 0)],
          ['Total em Compras (€)', moneyPt(stats?.purchasesTotal ?? 0)],
        ],
      },
      {
        title: 'Investimento por categoria',
        columns: 6,
        headers: ['Categoria', 'Produtos', 'Unidades', 'Investido (€)', 'Valor Esperado (€)', 'Margem (€)'],
        rows: (stats?.byCategory ?? []).map((r) => [
          r.category ?? '',
          r.products ?? 0,
          r.units ?? 0,
          moneyPt(r.invested ?? 0),
          moneyPt(r.expected ?? 0),
          moneyPt((r.expected ?? 0) - (r.invested ?? 0)),
        ]),
      },
    ],
  });

  downloadBlob(file, new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }));
}

export async function exportReportsPdf({
  filename,
  title = 'Relatórios',
  logoUrl,
  createdAt,
  stats,
  analytics,
  mode = 'download',
} = {}) {
  const jsPDF = await loadJsPdf();
  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

  const logoDataUrl = await safeSvgUrlToPngDataUrl(logoUrl, { width: 120 });
  let y = addHeader(doc, { title, logoDataUrl, createdAt });

  y = addSectionTitle(doc, 'Resumo', { startY: y });
  y = addKeyValues(
    doc,
    [
      ['Produtos', stats?.productsCount ?? 0],
      ['Unidades em Stock', stats?.stockUnits ?? 0],
      ['Baixo Stock (≤2)', stats?.lowStock ?? 0],
      ['Total em Compras (€)', moneyPt(stats?.purchasesTotal ?? 0)],
    ],
    { startY: y },
  );

  const topViewed = analytics?.top_viewed_products ?? [];
  y = addSectionTitle(doc, 'Produtos mais vistos (30 dias)', { startY: y });
  y = addTable(doc, {
    headers: ['Produto', 'Views'],
    rows: topViewed.slice(0, 30).map((p) => [p.product_name ?? '', p.views ?? 0]),
    startY: y,
    columnWidths: [360, 120],
  });

  const topSearches = analytics?.top_searches ?? [];
  y = addSectionTitle(doc, 'Mais pesquisas (30 dias)', { startY: y });
  y = addTable(doc, {
    headers: ['Pesquisa', 'Count'],
    rows: topSearches.slice(0, 30).map((q) => [q.query ?? '', q.count ?? 0]),
    startY: y,
    columnWidths: [360, 120],
  });

  const largestOrders = analytics?.largest_orders ?? [];
  y = addSectionTitle(doc, 'Maiores encomendas (30 dias)', { startY: y });
  addTable(doc, {
    headers: ['Email', 'Status', 'Total (€)'],
    rows: largestOrders
      .slice(0, 30)
      .map((o) => [o.customer_email ?? '', orderStatusLabelsPt[String(o.status ?? '')] ?? (o.status ?? ''), moneyPt(o.total ?? 0)]),
    startY: y,
    columnWidths: [260, 110, 110],
  });

  const outName = filename ?? 'relatorios.pdf';
  if (mode === 'blob') return doc.output('blob');
  if (mode === 'open') {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (!w) downloadBlob(outName, blob);
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return;
  }

  doc.save(outName);
}

export async function exportFinancePdf({
  filename,
  title = 'Financeiro',
  logoUrl,
  createdAt,
  stats,
  mode = 'download',
} = {}) {
  const jsPDF = await loadJsPdf();
  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

  const logoDataUrl = await safeSvgUrlToPngDataUrl(logoUrl, { width: 120 });
  let y = addHeader(doc, { title, logoDataUrl, createdAt });

  y = addSectionTitle(doc, 'Resumo', { startY: y });
  y = addKeyValues(
    doc,
    [
      ['Investido em Stock (€)', moneyPt(stats?.invested ?? 0)],
      ['Valor Esperado (PVP) (€)', moneyPt(stats?.expected ?? 0)],
      ['Margem Potencial (€)', moneyPt(stats?.marginPotential ?? 0)],
      ['Receita (Entregue) (€)', moneyPt(stats?.revenueDelivered ?? 0)],
      ['Receita pendente (€)', moneyPt(stats?.revenueOpen ?? 0)],
      ['Canceladas (€)', moneyPt(stats?.revenueCancelled ?? 0)],
      ['Compras (Stock) (€)', moneyPt(stats?.purchasesStockTotal ?? 0)],
      ['Despesas (Logística) (€)', moneyPt(stats?.purchasesLogisticsTotal ?? 0)],
      ['Total em Compras (€)', moneyPt(stats?.purchasesTotal ?? 0)],
    ],
    { startY: y },
  );

  y = addSectionTitle(doc, 'Investimento por categoria', { startY: y });
  addTable(doc, {
    headers: ['Categoria', 'Unidades', 'Investido (€)', 'Valor Esperado (€)', 'Margem (€)'],
    rows: (stats?.byCategory ?? []).map((r) => [
      r.category ?? '',
      r.units ?? 0,
      moneyPt(r.invested ?? 0),
      moneyPt(r.expected ?? 0),
      moneyPt((r.expected ?? 0) - (r.invested ?? 0)),
    ]),
    startY: y,
    columnWidths: [150, 70, 110, 110, 110],
  });

  const outName = filename ?? 'financeiro.pdf';
  if (mode === 'blob') return doc.output('blob');
  if (mode === 'open') {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (!w) downloadBlob(outName, blob);
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return;
  }

  doc.save(outName);
}

export async function exportElementToPdf(element, filename, { title } = {}) {
  if (!element) throw new Error('missing_element');

  const [{ default: html2canvas }, jspdfMod] = await Promise.all([import('html2canvas'), import('jspdf')]);
  const jsPDF = jspdfMod.jsPDF ?? jspdfMod.default ?? jspdfMod;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });

  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;

  if (title) {
    pdf.setFontSize(12);
    pdf.text(String(title), margin, margin);
  }

  const contentTop = title ? margin + 18 : margin;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - contentTop - margin;

  const pxPerPt = canvas.width / contentWidth;
  const sliceHeightPx = Math.floor(contentHeight * pxPerPt);

  const pageCanvas = document.createElement('canvas');
  pageCanvas.width = canvas.width;
  pageCanvas.height = sliceHeightPx;
  const ctx = pageCanvas.getContext('2d');
  if (!ctx) throw new Error('canvas_context_failed');

  let y = 0;
  let pageIndex = 0;
  while (y < canvas.height) {
    ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

    const remaining = canvas.height - y;
    const drawHeight = Math.min(sliceHeightPx, remaining);

    ctx.drawImage(canvas, 0, y, canvas.width, drawHeight, 0, 0, canvas.width, drawHeight);

    const imgData = pageCanvas.toDataURL('image/png', 1.0);
    const drawHeightPt = drawHeight / pxPerPt;

    if (pageIndex > 0) pdf.addPage();
    if (title) {
      pdf.setFontSize(12);
      pdf.text(String(title), margin, margin);
    }
    pdf.addImage(imgData, 'PNG', margin, contentTop, contentWidth, drawHeightPt, undefined, 'FAST');

    y += drawHeight;
    pageIndex += 1;
  }

  pdf.save(filename);
}
