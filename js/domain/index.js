export { registrarUsuario, iniciarSesion, obtenerSesion, cerrarSesion } from './authService.js';
export { listarProductos, obtenerProducto, crearProducto, editarProducto, eliminarProducto } from './catalogService.js';
export {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarItem,
  limpiarCarrito,
  calcularSubtotal
} from './cartService.js';
export { descontarStock, restituirStock, alertasStockBajo } from './inventoryService.js';
export { promocionesActivas, calcularDescuento, crearPromocion } from './promotionService.js';
export {
  crearPedido,
  cancelarPedido,
  listarPedidosCliente,
  listarPedidos,
  actualizarEstadoPedido
} from './orderService.js';
export { productosMasVendidos } from './reportService.js';
