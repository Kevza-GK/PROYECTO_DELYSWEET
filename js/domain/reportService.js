import { leer } from '../data/index.js';

export function productosMasVendidos() {
  const cantidades = new Map();
  leer('ventas', []).forEach((venta) => {
    (venta.productos || []).forEach((item) => {
      cantidades.set(item.productoId, (cantidades.get(item.productoId) || 0) + item.cantidad);
    });
  });
  return leer('productos', [])
    .map((producto) => ({ ...producto, unidadesVendidas: cantidades.get(producto.id) || 0 }))
    .sort((a, b) => b.unidadesVendidas - a.unidadesVendidas);
}
