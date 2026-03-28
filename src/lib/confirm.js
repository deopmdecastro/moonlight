export function confirmDestructive(message = 'Tem certeza que deseja eliminar?') {
  if (typeof window === 'undefined' || typeof window.confirm !== 'function') return true;
  return window.confirm(message);
}

