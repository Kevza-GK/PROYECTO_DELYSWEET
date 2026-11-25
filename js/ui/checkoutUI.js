import { obtenerSesion, obtenerCarrito, crearPedido } from '../domain/index.js';
import { mostrarError, mostrarMensaje } from '../shared/index.js';
import { qs } from '../core/index.js';

export function inicializarCheckout() {
  const formulario = qs('#form-checkout');
  if (!formulario) return;
  const sesion = obtenerSesion();
  if (!sesion) {
    mostrarMensaje('Inicia sesión o crea una cuenta para realizar tu pedido.', 'info');
    return;
  }
  const carrito = obtenerCarrito();
  if (!carrito.items.length) {
    mostrarMensaje('Agrega productos al carrito antes de continuar.', 'info');
    return;
  }
  const direccion = qs('#checkout-direccion');
  const telefono = qs('#checkout-telefono');
  if (direccion) direccion.value = direccion.value || '';
  if (telefono) telefono.value = telefono.value || '';

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    const datos = new FormData(formulario);
    try {
      const pedido = crearPedido({
        cliente: sesion,
        items: obtenerCarrito().items,
        metodoPago: datos.get('metodoPago'),
        direccion: datos.get('direccion'),
        telefono: datos.get('telefono')
      });
      mostrarMensaje('¡Pedido confirmado! Gracias por elegir DelySweet.', 'exito');
      window.setTimeout(() => { window.location.href = `pedido.html?id=${encodeURIComponent(pedido.id)}`; }, 700);
    } catch (error) {
      mostrarError(error);
    }
  });
}
