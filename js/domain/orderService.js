import { leer, guardar } from '../data/index.js';
import { AppError, multiplicar, restar, sumar } from '../shared/index.js';
import { descontarStock, restituirStock } from './index.js';

export function crearPedido({ cliente, items, metodoPago, direccion, telefono }) {
  if (!cliente) throw new AppError('Inicia sesión antes de confirmar tu pedido.', 'SESION_REQUERIDA');
  if (!Array.isArray(items) || !items.length) throw new AppError('El carrito está vacío.', 'CARRITO_VACIO');
  if (!['efectivo', 'tarjeta'].includes(metodoPago)) {
    throw new AppError('Selecciona un método de pago válido.', 'PAGO_INVALIDO');
  }
  if (!String(direccion || '').trim() || !String(telefono || '').trim()) {
    throw new AppError('La dirección y el teléfono son obligatorios.', 'ENTREGA_INVALIDA');
  }

  const productos = leer('productos', []);
  const cantidades = new Map();
  items.forEach((item) => {
    if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
      throw new AppError('Hay una cantidad inválida en el carrito.', 'CANTIDAD_INVALIDA');
    }
    cantidades.set(item.productoId, (cantidades.get(item.productoId) || 0) + item.cantidad);
  });
  const itemsPedido = [...cantidades.entries()].map(([productoId, cantidad]) => {
    const producto = productos.find((registro) => registro.id === productoId && registro.activo !== false);
    if (!producto) throw new AppError('Uno de los productos ya no está disponible.', 'PRODUCTO_NO_ENCONTRADO');
    if (producto.stock < cantidad) {
      throw new AppError(`Stock insuficiente para ${producto.nombre}.`, 'STOCK_INSUFICIENTE');
    }
    return { productoId: producto.id, nombre: producto.nombre, cantidad, precioUnitario: producto.precio };
  });
  const subtotal = itemsPedido.reduce(
    (acumulado, item) => sumar(acumulado, multiplicar(item.precioUnitario, item.cantidad)),
    0
  );
  const promociones = leer('promociones', []);
  const hoy = new Date().toISOString().slice(0, 10);
  const porcentaje = promociones
    .filter((promocion) => promocion.activa && promocion.fechaInicio <= hoy && promocion.fechaFin >= hoy)
    .reduce((mayor, promocion) => Math.max(mayor, Number(promocion.porcentaje) || 0), 0);
  const descuento = Math.min(subtotal, Math.round(multiplicar(subtotal, porcentaje / 100)));
  const fecha = new Date().toISOString();
  const pedido = {
    id: `ped-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    clienteCorreo: cliente.correo,
    items: itemsPedido,
    subtotal,
    descuento,
    total: restar(subtotal, descuento),
    metodoPago,
    direccion: direccion.trim(),
    telefono: telefono.trim(),
    estado: 'Pedido confirmado',
    fecha
  };

  descontarStock(itemsPedido);
  const pedidos = leer('pedidos', []);
  pedidos.push(pedido);
  guardar('pedidos', pedidos);
  const ventas = leer('ventas', []);
  ventas.push({
    pedidoId: pedido.id,
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    productos: itemsPedido,
    total: pedido.total,
    fecha
  });
  guardar('ventas', ventas);
  guardar('carrito', { items: [] });
  return pedido;
}

export function cancelarPedido(pedidoId) {
  const pedidos = leer('pedidos', []);
  const pedido = pedidos.find((registro) => registro.id === pedidoId);
  if (!pedido) throw new AppError('Pedido no encontrado.', 'PEDIDO_NO_ENCONTRADO');
  if (pedido.estado === 'Entregado') throw new AppError('No se puede cancelar un pedido entregado.', 'PEDIDO_ENTREGADO');
  if (pedido.estado === 'Cancelado') throw new AppError('El pedido ya está cancelado.', 'PEDIDO_YA_CANCELADO');

  const resultado = restituirStock(pedido.items);
  if (resultado.faltantes.length) {
    const incidencias = leer('incidencias', []);
    incidencias.push({
      pedidoId: pedido.id,
      fecha: new Date().toISOString(),
      mensaje: `No se restituyó stock: producto inexistente (${resultado.faltantes.map((item) => item.productoId).join(', ')}).`
    });
    guardar('incidencias', incidencias);
  }
  pedido.estado = 'Cancelado';
  pedido.stockRestituido = resultado.restituido;
  guardar('pedidos', pedidos);
  const ventas = leer('ventas', []).filter((venta) => venta.pedidoId !== pedido.id);
  guardar('ventas', ventas);
  return pedido;
}

export function listarPedidosCliente(clienteId) {
  return leer('pedidos', []).filter((pedido) => pedido.clienteId === clienteId);
}

export function listarPedidos() {
  return leer('pedidos', []);
}

export function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  const estados = ['Pedido confirmado', 'En preparación', 'En camino', 'Entregado', 'Cancelado'];
  if (!estados.includes(nuevoEstado)) throw new AppError('Estado de pedido inválido.', 'ESTADO_INVALIDO');
  const pedidos = leer('pedidos', []);
  const pedido = pedidos.find((registro) => registro.id === pedidoId);
  if (!pedido) throw new AppError('Pedido no encontrado.', 'PEDIDO_NO_ENCONTRADO');
  if (pedido.estado === 'Cancelado' && nuevoEstado !== 'Cancelado') {
    throw new AppError('Un pedido cancelado no puede reactivarse.', 'PEDIDO_CANCELADO');
  }
  pedido.estado = nuevoEstado;
  guardar('pedidos', pedidos);
  return pedido;
}
