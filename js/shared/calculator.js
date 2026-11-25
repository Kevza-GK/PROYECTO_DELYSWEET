export function sumar(a, b) { return Number(a) + Number(b); }
export function restar(a, b) { return Number(a) - Number(b); }
export function multiplicar(a, b) { return Number(a) * Number(b); }

export function dividir(a, b) {
  if (Number(b) === 0) throw new Error('No se puede dividir por cero.');
  return Number(a) / Number(b);
}

export function promedio(valores) {
  if (!Array.isArray(valores) || valores.length === 0) {
    throw new Error('No hay valores para promediar.');
  }
  return dividir(valores.reduce((acumulado, valor) => sumar(acumulado, valor), 0), valores.length);
}
