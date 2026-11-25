export function esTextoNoVacio(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

export function esCorreoValido(valor) {
  return typeof valor === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
}

export function esNumeroPositivo(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0;
}

export function esEnteroPositivo(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= 0;
}
