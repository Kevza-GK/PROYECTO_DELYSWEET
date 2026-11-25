import { AppError } from '../shared/index.js';

const PREFIJO = 'delysweet:';

export function leer(clave, valorPorDefecto = null) {
  try {
    const crudo = localStorage.getItem(PREFIJO + clave);
    return crudo === null ? valorPorDefecto : JSON.parse(crudo);
  } catch {
    throw new AppError('No fue posible leer los datos locales.', 'STORAGE_READ');
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
  } catch {
    throw new AppError('No fue posible guardar los datos locales.', 'STORAGE_WRITE');
  }
}

export function eliminar(clave) {
  try {
    localStorage.removeItem(PREFIJO + clave);
  } catch {
    throw new AppError('No fue posible eliminar los datos locales.', 'STORAGE_DELETE');
  }
}
