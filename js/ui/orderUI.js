import {
  obtenerSesion,
  listarPedidosCliente,
  listarPedidos,
  actualizarEstadoPedido
} from '../domain/index.js';
import { formatearFecha, formatearMoneda, mostrarError } from '../shared/index.js';
import { qs, crear, limpiar } from '../core/index.js';

export function inicializarPedidos() {
  const sesion = obtenerSesion();
  const pagina = document.body.dataset.page;
  const contenedor = qs('#pedidos-lista');
  if (!contenedor) return;
  if (!sesion) {
    const mensaje = crear('p');
    mensaje.className = 'estado-vacio';
    mensaje.textContent = 'Inicia sesión para consultar tus pedidos.';
    contenedor.replaceChildren(mensaje);
    return;
  }

  const pedidos = sesion.rol === 'admin' ? listarPedidos() : listarPedidosCliente(sesion.id);
  const idPedido = new URLSearchParams(window.location.search).get('id');
  const fechaFiltro = qs('#historial-fecha');
  const renderizar = () => {
    let visibles = idPedido ? pedidos.filter((pedido) => pedido.id === idPedido) : pedidos;
    if (fechaFiltro?.value) visibles = visibles.filter((pedido) => pedido.fecha.slice(0, 10) === fechaFiltro.value);
    limpiar(contenedor);
    if (!visibles.length) {
      const vacio = crear('p');
      vacio.className = 'estado-vacio';
      vacio.textContent = 'Todavía no hay pedidos para mostrar.';
      contenedor.appendChild(vacio);
      return;
    }
    visibles.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).forEach((pedido) => {
      contenedor.appendChild(crearPedido(pedido, sesion.rol === 'admin'));
    });
  };
  fechaFiltro?.addEventListener('change', renderizar);
  contenedor.addEventListener('change', (evento) => {
    const selector = evento.target.closest('[data-action="estado-pedido"]');
    if (!selector) return;
    try {
      actualizarEstadoPedido(selector.dataset.orderId, selector.value);
      window.location.reload();
    } catch (error) {
      mostrarError(error);
    }
  });
  renderizar();
}

function crearPedido(pedido, esAdmin) {
  const tarjeta = crear('article');
  tarjeta.className = 'pedido-card';
  const titulo = crear('h2');
  titulo.className = 'pedido-card__title';
  titulo.textContent = `Pedido ${pedido.id}`;
  const fecha = crear('p');
  fecha.textContent = `Fecha: ${formatearFecha(pedido.fecha)}`;
  const estado = crear('p');
  estado.className = `badge ${pedido.estado === 'Cancelado' ? 'badge--agotado' : 'badge--pendiente'}`;
  estado.textContent = pedido.estado;
  const total = crear('p');
  total.className = 'pedido-card__total';
  total.textContent = `Total: ${formatearMoneda(pedido.total)}`;
  const lista = crear('ul');
  lista.className = 'pedido-card__items';
  pedido.items.forEach((item) => {
    const renglon = crear('li');
    renglon.textContent = `${item.nombre || 'Postre'} x ${item.cantidad}`;
    lista.appendChild(renglon);
  });
  tarjeta.append(titulo, fecha, estado, total, lista);
  if (esAdmin && pedido.estado !== 'Cancelado') {
    const etiqueta = crear('label');
    etiqueta.className = 'formulario__label';
    etiqueta.textContent = 'Actualizar estado';
    const selector = crear('select');
    selector.className = 'formulario__input';
    selector.dataset.action = 'estado-pedido';
    selector.dataset.orderId = pedido.id;
    ['Pedido confirmado', 'En preparación', 'En camino', 'Entregado'].forEach((opcion) => {
      const elemento = crear('option');
      elemento.value = opcion;
      elemento.textContent = opcion;
      elemento.selected = opcion === pedido.estado;
      selector.appendChild(elemento);
    });
    etiqueta.appendChild(selector);
    tarjeta.appendChild(etiqueta);
  }
  return tarjeta;
}
