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
