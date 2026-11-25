Arquitectura limpia con módulos, barriles y vistas
Principios
Módulos ECMAScript nativos: import/export con extensión .js en rutas locales.

Barriles por carpeta: cada carpeta expone index.js que reexporta su API. Los consumidores importan solo del barril.

Responsabilidad única: cada archivo expone una función o clase concreta; no hay archivos con lógica mezclada.

Dirección de dependencias: main.js → ui → domain → data → shared → core. views/ provee HTML; core/partialLoader lo inyecta.

Un solo punto de entrada: js/main.js.

Un solo motor de presentación: shared/renderEngine.js.

Vistas HTML desacopladas: views/layouts/ y views/partials/ sin lógica; la lógica vive en ui/.

Flujo de datos
text
views/  ──(fetch)──►  core/partialLoader  ──►  DOM
   ▲                                            │
   │                                            ▼
   └──────────────  ui/*UI.js  ◄──  domain/*Service  ◄──  data/storage
                          │
                          ▼
                  shared/renderEngine
                          │
                          ▼
                     shared/*  ◄──  core/dom
Barriles
js/core/index.js
js
export { qs, qsa, on, crear, limpiar } from './dom.js';
export { cargarParcial, cargarVistasBase } from './partialLoader.js';
js/shared/index.js
js
export { AppError } from './errors.js';
export {
  esTextoNoVacio,
  esCorreoValido,
  esNumeroPositivo,
  esEnteroPositivo
} from './validators.js';
export {
  sumar,
  restar,
  multiplicar,
  dividir,
  promedio
} from './calculator.js';
export { formatearMoneda, formatearFecha } from './formatters.js';
export { mostrarMensaje, mostrarError, renderizarResultado } from './renderEngine.js';
js/data/index.js
js
export { leer, guardar, eliminar } from './storage.js';
export { sembrarDatosIniciales } from './seed.js';
js/domain/index.js
js
export { registrarUsuario, iniciarSesion, obtenerSesion, cerrarSesion } from './authService.js';
export { listarProductos, obtenerProducto, crearProducto, editarProducto, eliminarProducto } from './catalogService.js';
export { obtenerCarrito, agregarProducto, actualizarCantidad, eliminarItem, calcularSubtotal } from './cartService.js';
export { descontarStock, restituirStock, alertasStockBajo } from './inventoryService.js';
export { promocionesActivas, calcularDescuento } from './promotionService.js';
export { crearPedido, cancelarPedido, listarPedidosCliente, actualizarEstadoPedido } from './orderService.js';
export { productosMasVendidos } from './reportService.js';
js/ui/index.js
js
export { inicializarNavegacion } from './navigationUI.js';
export { inicializarAuth } from './authUI.js';
export { inicializarInicio, inicializarCatalogo } from './catalogUI.js';
export { inicializarCarrito } from './cartUI.js';
export { inicializarCheckout } from './checkoutUI.js';
export { inicializarPedidos } from './orderUI.js';
export { inicializarAdmin } from './adminUI.js';
Responsabilidad única por archivo
js/core/dom.js
js
export const qs = (selector, raiz = document) => raiz.querySelector(selector);
export const qsa = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];
export const on = (elemento, evento, handler) => elemento.addEventListener(evento, handler);
export const crear = (etiqueta) => document.createElement(etiqueta);
export const limpiar = (elemento) => elemento.replaceChildren();
js/core/partialLoader.js
js
async function obtenerHTML(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${ruta}`);
  return respuesta.text();
}

export async function cargarParcial(ruta, montaje) {
  const html = await obtenerHTML(ruta);
  montaje.innerHTML = html;
}

export async function cargarVistasBase() {
  const header = document.querySelector('[data-view="header"]');
  const footer = document.querySelector('[data-view="footer"]');
  if (header) await cargarParcial('views/partials/header.html', header);
  if (footer) await cargarParcial('views/partials/footer.html', footer);
}
js/shared/errors.js
js
export class AppError extends Error {
  constructor(mensaje, codigo = 'APP_ERROR') {
    super(mensaje);
    this.name = 'AppError';
    this.codigo = codigo;
  }
}
js/shared/validators.js
js
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
js/shared/calculator.js
js
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
  return dividir(valores.reduce((acc, v) => sumar(acc, v), 0), valores.length);
}
js/shared/formatters.js
js
const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

export function formatearMoneda(valor) {
  return formatoMoneda.format(Number(valor) || 0);
}

export function formatearFecha(iso) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(iso));
}
js/shared/renderEngine.js
js
export function mostrarMensaje(texto, tipo = 'info') {
  const contenedor = document.getElementById('mensajes');
  if (!contenedor) return;

  const mensaje = document.createElement('div');
  mensaje.className = `mensaje mensaje--${tipo}`;
  mensaje.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
  mensaje.textContent = texto;
  contenedor.appendChild(mensaje);

  window.setTimeout(() => mensaje.remove(), 4000);
}

export function mostrarError(error) {
  const texto = error instanceof Error ? error.message : String(error);
  mostrarMensaje(texto, 'error');
}

export function renderizarResultado(contenedor, contenido) {
  if (!contenedor) return;
  contenedor.replaceChildren(contenido);
}
js/data/storage.js
js
import { AppError } from '../shared/index.js';

const PREFIJO = 'delysweet:';

export function leer(clave, valorPorDefecto = null) {
  try {
    const crudo = localStorage.getItem(PREFIJO + clave);
    return crudo ? JSON.parse(crudo) : valorPorDefecto;
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
  localStorage.removeItem(PREFIJO + clave);
}
js/data/seed.js
js
import { leer, guardar } from './storage.js';

const PRODUCTOS_DEMO = [
  {
    id: 'prod-001',
    nombre: 'Cheesecake de fresa',
    descripcion: 'Porción individual',
    precio: 12000,
    stock: 10,
    imagen: 'assets/img/postres/cheesecake.jpg',
    categoria: 'tartas',
    activo: true
  }
];

export function sembrarDatosIniciales() {
  if (!leer('productos')) guardar('productos', PRODUCTOS_DEMO);
  if (!leer('usuarios')) guardar('usuarios', []);
  if (!leer('pedidos')) guardar('pedidos', []);
  if (!leer('ventas')) guardar('ventas', []);
  if (!leer('promociones')) guardar('promociones', []);
}
js/domain/cartService.js
js
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

  const carrito = obtenerCarrito();
  const existente = carrito.items.find((i) => i.productoId === producto.id);

  if (existente) {
    const nueva = sumar(existente.cantidad, cantidad);
    if (nueva > producto.stock) {
      throw new AppError('La cantidad solicitada supera el stock.', 'STOCK_EXCEDIDO');
    }
    existente.cantidad = nueva;
  } else {
    if (cantidad > producto.stock) {
      throw new AppError('La cantidad solicitada supera el stock.', 'STOCK_EXCEDIDO');
    }
    carrito.items.push({ productoId: producto.id, cantidad });
  }

  guardar(CLAVE_CARRITO, carrito);
  return carrito;
}

export function actualizarCantidad(productoId, cantidad, productos) {
  const producto = productos.find((p) => p.id === productoId);
  if (!producto) throw new AppError('Producto no encontrado.', 'PRODUCTO_NO_ENCONTRADO');
  if (cantidad < 0 || cantidad > producto.stock) {
    throw new AppError('Cantidad inválida para el stock disponible.', 'CANTIDAD_INVALIDA');
  }

  const carrito = obtenerCarrito();
  const item = carrito.items.find((i) => i.productoId === productoId);
  if (!item) throw new AppError('El producto no está en el carrito.', 'ITEM_NO_ENCONTRADO');

  item.cantidad = cantidad;
  carrito.items = carrito.items.filter((i) => i.cantidad > 0);
  guardar(CLAVE_CARRITO, carrito);
  return carrito;
}

export function eliminarItem(productoId) {
  const carrito = obtenerCarrito();
  carrito.items = carrito.items.filter((i) => i.productoId !== productoId);
  guardar(CLAVE_CARRITO, carrito);
  return carrito;
}

export function calcularSubtotal(items, productos) {
  return items.reduce((acc, item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    if (!producto) return acc;
    return sumar(acc, multiplicar(producto.precio, item.cantidad));
  }, 0);
}
js/domain/orderService.js
js
import { leer, guardar } from '../data/index.js';
import { AppError, multiplicar, restar, sumar } from '../shared/index.js';

const CLAVE_PEDIDOS = 'pedidos';
const CLAVE_VENTAS = 'ventas';

export function crearPedido({ cliente, items, productos, metodoPago, direccion, telefono }) {
  if (!items.length) throw new AppError('El carrito está vacío.', 'CARRITO_VACIO');
  if (!['efectivo', 'tarjeta'].includes(metodoPago)) {
    throw new AppError('Método de pago inválido.', 'PAGO_INVALIDO');
  }

  const itemsPedido = items.map((item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    if (!producto) throw new AppError('Producto no encontrado.', 'PRODUCTO_NO_ENCONTRADO');
    if (producto.stock < item.cantidad) {
      throw new AppError(`Stock insuficiente para ${producto.nombre}.`, 'STOCK_INSUFICIENTE');
    }
    return { productoId: producto.id, cantidad: item.cantidad, precioUnitario: producto.precio };
  });

  const subtotal = itemsPedido.reduce(
    (acc, item) => sumar(acc, multiplicar(item.precioUnitario, item.cantidad)),
    0
  );
  const descuento = 0;
  const total = restar(subtotal, descuento);

  const pedido = {
    id: `ped-${Date.now()}`,
    clienteId: cliente.id,
    items: itemsPedido,
    subtotal,
    descuento,
    total,
    metodoPago,
    direccion,
    telefono,
    estado: 'Pedido confirmado',
    fecha: new Date().toISOString()
  };

  const pedidos = leer(CLAVE_PEDIDOS, []);
  pedidos.push(pedido);
  guardar(CLAVE_PEDIDOS, pedidos);

  const ventas = leer(CLAVE_VENTAS, []);
  ventas.push({ pedidoId: pedido.id, clienteId: cliente.id, total: pedido.total, fecha: pedido.fecha });
  guardar(CLAVE_VENTAS, ventas);

  return pedido;
}

export function cancelarPedido(pedidoId) {
  const pedidos = leer(CLAVE_PEDIDOS, []);
  const pedido = pedidos.find((p) => p.id === pedidoId);

  if (!pedido) throw new AppError('Pedido no encontrado.', 'PEDIDO_NO_ENCONTRADO');
  if (pedido.estado === 'Entregado') throw new AppError('No se puede cancelar un pedido entregado.', 'PEDIDO_ENTREGADO');
  if (pedido.estado === 'Cancelado') throw new AppError('El pedido ya está cancelado.', 'PEDIDO_YA_CANCELADO');

  pedido.estado = 'Cancelado';
  guardar(CLAVE_PEDIDOS, pedidos);
  return pedido;
}

export function listarPedidosCliente(clienteId) {
  const pedidos = leer(CLAVE_PEDIDOS, []);
  return pedidos.filter((p) => p.clienteId === clienteId);
}

export function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  const estados = ['Pedido confirmado', 'En preparación', 'En camino', 'Entregado', 'Cancelado'];
  if (!estados.includes(nuevoEstado)) {
    throw new AppError('Estado de pedido inválido.', 'ESTADO_INVALIDO');
  }
  const pedidos = leer(CLAVE_PEDIDOS, []);
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (!pedido) throw new AppError('Pedido no encontrado.', 'PEDIDO_NO_ENCONTRADO');

  pedido.estado = nuevoEstado;
  guardar(CLAVE_PEDIDOS, pedidos);
  return pedido;
}
js/ui/cartUI.js
js
import { obtenerCarrito, actualizarCantidad, eliminarItem, calcularSubtotal } from '../domain/index.js';
import { listarProductos } from '../domain/index.js';
import { formatearMoneda, mostrarMensaje, mostrarError } from '../shared/index.js';
import { qs, qsa, on, crear, limpiar } from '../core/index.js';

function renderizarItem(item, producto) {
  const contenedor = crear('article');
  contenedor.className = 'carrito__item';
  contenedor.dataset.productId = producto.id;

  const titulo = crear('h3');
  titulo.className = 'carrito__item-title';
  titulo.textContent = producto.nombre;

  const precio = crear('p');
  precio.className = 'carrito__item-precio';
  precio.textContent = formatearMoneda(producto.precio);

  const cantidad = crear('input');
  cantidad.type = 'number';
  cantidad.min = '0';
  cantidad.max = String(producto.stock);
  cantidad.value = String(item.cantidad);
  cantidad.dataset.action = 'cambiar-cantidad';

  const quitar = crear('button');
  quitar.type = 'button';
  quitar.className = 'btn btn--secundario';
  quitar.dataset.action = 'quitar-item';
  quitar.textContent = 'Quitar';

  contenedor.append(titulo, precio, cantidad, quitar);
  return contenedor;
}

export function inicializarCarrito() {
  const lista = qs('#carrito-lista');
  if (!lista) return;

  try {
    const productos = listarProductos();
    const carrito = obtenerCarrito();
    limpiar(lista);

    carrito.items.forEach((item) => {
      const producto = productos.find((p) => p.id === item.productoId);
      if (producto) lista.appendChild(renderizarItem(item, producto));
    });

    const subtotal = calcularSubtotal(carrito.items, productos);
    qs('#carrito-subtotal').textContent = formatearMoneda(subtotal);
    qs('#carrito-descuento').textContent = formatearMoneda(0);
    qs('#carrito-total').textContent = formatearMoneda(subtotal);

    on(lista, 'click', (evento) => {
      const accion = evento.target.dataset.action;
      const contenedor = evento.target.closest('[data-product-id]');
      if (!contenedor) return;
      const productoId = contenedor.dataset.productId;
      try {
        if (accion === 'quitar-item') {
          eliminarItem(productoId);
          mostrarMensaje('Producto eliminado del carrito.', 'exito');
          inicializarCarrito();
        }
      } catch (error) {
        mostrarError(error);
      }
    });

    on(lista, 'change', (evento) => {
      if (evento.target.dataset.action !== 'cambiar-cantidad') return;
      const contenedor = evento.target.closest('[data-product-id]');
      const productoId = contenedor.dataset.productId;
      try {
        actualizarCantidad(productoId, Number(evento.target.value), productos);
        inicializarCarrito();
      } catch (error) {
        mostrarError(error);
      }
    });
  } catch (error) {
    mostrarError(error);
  }
}
js/main.js
js
import { cargarVistasBase, mostrarError } from './shared/index.js';
import { mostrarError as motorError } from './shared/index.js';
import {
  inicializarNavegacion,
  inicializarInicio,
  inicializarCatalogo,
  inicializarCarrito,
  inicializarCheckout,
  inicializarAuth,
  inicializarPedidos,
  inicializarAdmin
} from './ui/index.js';

const MAPA_PAGINAS = {
  inicio: [inicializarInicio],
  catalogo: [inicializarCatalogo],
  carrito: [inicializarCarrito],
  checkout: [inicializarCheckout],
  login: [inicializarAuth],
  registro: [inicializarAuth],
  pedido: [inicializarPedidos],
  historial: [inicializarPedidos],
  admin: [inicializarAdmin]
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await cargarVistasBase();
    inicializarNavegacion();

    const pagina = document.body.dataset.page;
    const inicializadores = MAPA_PAGINAS[pagina] || [];
    inicializadores.forEach((fn) => fn());
  } catch (error) {
    motorError(error);
  }
});
Estructura de vistas
Carga de parciales
core/partialLoader.js expone cargarParcial(ruta, montaje) y cargarVistasBase().

Cada shell HTML define [data-view="header"] y [data-view="footer"].

main.js invoca cargarVistasBase() antes de inicializar la página.

Las plantillas de tarjetas viven en views/partials/product-card.html como <template> y ui/catalogUI.js las clona.

Vistas por página
Vista	Archivo principal	UI que la controla
Inicio	index.html	catalogUI.inicializarInicio
Catálogo	catalogo.html	catalogUI.inicializarCatalogo
Producto	producto.html	catalogUI.inicializarCatalogo (detalle)
Carrito	carrito.html	cartUI.inicializarCarrito
Checkout	checkout.html	checkoutUI.inicializarCheckout
Pedido	pedido.html	orderUI.inicializarPedidos
Historial	historial.html	orderUI.inicializarPedidos
Login	login.html	authUI.inicializarAuth
Registro	registro.html	authUI.inicializarAuth
Admin	admin.html	adminUI.inicializarAdmin
Ejemplos de importación con barriles
Correcto (solo barril):

js
import { sumar, mostrarMensaje, AppError } from '../shared/index.js';
import { leer, guardar } from '../data/index.js';
import { obtenerCarrito } from '../domain/index.js';
import { qs, on } from '../core/index.js';
Incorrecto (saltarse el barril):

js
import { sumar } from '../shared/calculator.js';        // ❌
import { leer } from '../data/storage.js';              // ❌
Manejo de errores
Errores de validación con AppError.

Captura global en main.js.

Mensajes visibles solo mediante shared/renderEngine.js.

Servicios no imprimen en consola.

Datos de usuario con textContent.

Seguridad y buenas prácticas
No se procesan pagos reales.

Contraseñas demostrativas; en producción hashear en backend.

Validar entradas en front-end y backend.

Evitar innerHTML con datos de usuario.

Validar tipo y tamaño de imagen subida.

Mantener coherencia entre ventas e inventario.