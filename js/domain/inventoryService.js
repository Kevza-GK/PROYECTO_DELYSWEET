import { leer, guardar } from '../data/index.js';
import { AppError } from '../shared/index.js';

export function descontarStock(items) {
  const productos = leer('productos', []);
  const cantidades = agruparItems(items);
  for (const [productoId, cantidad] of cantidades) {
    const producto = productos.find((registro) => registro.id === productoId && registro.activo !== false);
    if (!producto) throw new AppError('Uno de los productos del pedido ya no está disponible.', 'PRODUCTO_NO_ENCONTRADO');
    if (producto.stock < cantidad) {
      throw new AppError(`Stock insuficiente para ${producto.nombre}.`, 'STOCK_INSUFICIENTE');
    }
  }
  cantidades.forEach((cantidad, productoId) => {
    const producto = productos.find((registro) => registro.id === productoId);
    producto.stock -= cantidad;
  });
  guardar('productos', productos);
  return productos;
}

export function restituirStock(items) {
  const productos = leer('productos', []);
  const cantidades = agruparItems(items);
  const faltantes = [...cantidades.entries()]
    .filter(([productoId]) => !productos.some((producto) => producto.id === productoId))
    .map(([productoId, cantidad]) => ({ productoId, cantidad }));
  if (faltantes.length) return { productos, faltantes, restituido: false };

  cantidades.forEach((cantidad, productoId) => {
    const producto = productos.find((registro) => registro.id === productoId);
    producto.stock += cantidad;
  });
  guardar('productos', productos);
  return { productos, faltantes: [], restituido: true };
}

export function alertasStockBajo(umbral = 5) {
  return leer('productos', []).filter((producto) => producto.activo !== false && producto.stock <= umbral);
}

function agruparItems(items) {
  const cantidades = new Map();
  items.forEach((item) => {
    if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
      throw new AppError('Hay una cantidad inválida en los artículos del pedido.', 'CANTIDAD_INVALIDA');
    }
    cantidades.set(item.productoId, (cantidades.get(item.productoId) || 0) + item.cantidad);
  });
  return cantidades;
}
