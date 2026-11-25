import { leer, guardar } from '../data/index.js';
import { AppError, multiplicar } from '../shared/index.js';

export function promocionesActivas(fecha = new Date()) {
  const hoy = fecha.toISOString().slice(0, 10);
  return leer('promociones', []).filter(
    (promocion) => promocion.activa && promocion.fechaInicio <= hoy && promocion.fechaFin >= hoy
  );
}

export function calcularDescuento(subtotal, promociones = promocionesActivas()) {
  const porcentaje = promociones.reduce((mayor, promocion) => Math.max(mayor, Number(promocion.porcentaje) || 0), 0);
  return Math.min(subtotal, Math.round(multiplicar(subtotal, porcentaje / 100)));
}

export function crearPromocion(datos) {
  const porcentaje = Number(datos.porcentaje);
  if (
    !String(datos.nombre || '').trim() ||
    !Number.isFinite(porcentaje) ||
    porcentaje <= 0 ||
    porcentaje > 100 ||
    !datos.fechaInicio ||
    !datos.fechaFin ||
    datos.fechaFin < datos.fechaInicio
  ) {
    throw new AppError('Ingresa una promoción y un rango de fechas válidos.', 'PROMOCION_INVALIDA');
  }
  const promociones = leer('promociones', []);
  const promocion = {
    id: `promo-${Date.now()}`,
    nombre: String(datos.nombre).trim(),
    porcentaje,
    fechaInicio: datos.fechaInicio,
    fechaFin: datos.fechaFin,
    activa: true
  };
  promociones.push(promocion);
  guardar('promociones', promociones);
  return promocion;
}
