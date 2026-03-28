function downloadBlob(filename, blob) {
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

export async function exportReportsPdf({ filename, title = 'Relatórios', logoUrl, createdAt, stats, analytics } = {}) {
  const jsPDF = await loadJsPdf();
  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

  const logoDataUrl = logoUrl ? await svgUrlToPngDataUrl(logoUrl, { width: 120 }) : null;
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
    rows: largestOrders.slice(0, 30).map((o) => [o.customer_email ?? '', o.status ?? '', moneyPt(o.total ?? 0)]),
    startY: y,
    columnWidths: [260, 110, 110],
  });

  doc.save(filename ?? 'relatorios.pdf');
}

export async function exportFinancePdf({ filename, title = 'Financeiro', logoUrl, createdAt, stats } = {}) {
  const jsPDF = await loadJsPdf();
  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

  const logoDataUrl = logoUrl ? await svgUrlToPngDataUrl(logoUrl, { width: 120 }) : null;
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

  doc.save(filename ?? 'financeiro.pdf');
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
