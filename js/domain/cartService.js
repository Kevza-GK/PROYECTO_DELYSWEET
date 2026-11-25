import { leer, guardar } from '../data/index.js';
import { AppError, multiplicar, sumar } from '../shared/index.js';

const CLAVE_CARRITO = 'carrito';

export function obtenerCarrito() {
  return leer(CLAVE_CARRITO, { items: [] });
}

export function agregarProducto(producto, cantidad = 1) {
  if (!producto || producto.stock <= 0) {
    throw new AppError('El producto no tiene stock disponible.', 'SIN_STOCK');
  }
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new AppError('La cantidad debe ser un entero mayor que cero.', 'CANTIDAD_INVALIDA');
  }

  const carrito = obtenerCarrito();
  const existente = carrito.items.find((item) => item.productoId === producto.id);
  const nuevaCantidad = existente ? sumar(existente.cantidad, cantidad) : cantidad;
  if (nuevaCantidad > producto.stock) {
    throw new AppError('La cantidad solicitada supera el stock disponible.', 'STOCK_EXCEDIDO');
  }
  if (existente) existente.cantidad = nuevaCantidad;
  else carrito.items.push({ productoId: producto.id, cantidad });

  guardar(CLAVE_CARRITO, carrito);
  return carrito;
}

export function actualizarCantidad(productoId, cantidad, productos) {
  const producto = productos.find((item) => item.id === productoId);
  if (!producto) throw new AppError('Producto no encontrado.', 'PRODUCTO_NO_ENCONTRADO');
  if (!Number.isInteger(cantidad) || cantidad < 0 || cantidad > producto.stock) {
    throw new AppError('Cantidad inválida para el stock disponible.', 'CANTIDAD_INVALIDA');
  }
  const carrito = obtenerCarrito();
  const item = carrito.items.find((registro) => registro.productoId === productoId);
  if (!item) throw new AppError('El producto no está en el carrito.', 'ITEM_NO_ENCONTRADO');
  item.cantidad = cantidad;
  carrito.items = carrito.items.filter((registro) => registro.cantidad > 0);
  guardar(CLAVE_CARRITO, carrito);
  return carrito;
}

export function eliminarItem(productoId) {
  const carrito = obtenerCarrito();
  carrito.items = carrito.items.filter((item) => item.productoId !== productoId);
  guardar(CLAVE_CARRITO, carrito);
  return carrito;
}

export function limpiarCarrito() {
  guardar(CLAVE_CARRITO, { items: [] });
}

export function calcularSubtotal(items, productos) {
  return items.reduce((acumulado, item) => {
    const producto = productos.find((registro) => registro.id === item.productoId);
    if (!producto) return acumulado;
    return sumar(acumulado, multiplicar(producto.precio, item.cantidad));
  }, 0);
}
