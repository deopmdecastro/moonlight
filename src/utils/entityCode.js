function formatDateCode(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'unknown';
  const y = String(d.getFullYear());
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function fnv1a32(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return hash >>> 0;
}

function toSnakeCase(value) {
  if (!value) return '';
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

export function entityCode({ entityType, entityId, createdDate } = {}) {
  const type = toSnakeCase(entityType) || 'entity';
  const datePart = formatDateCode(createdDate);
  const raw = String(entityId ?? '');
  const base = fnv1a32(raw).toString(36).padStart(6, '0').slice(0, 6);
  const dotted = `${base.slice(0, 2)}.${base.slice(2, 4)}.${base.slice(4, 6)}`;
  return `moonlight_${type}_${datePart}_${dotted}`;
}
