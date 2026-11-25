import {
  obtenerCarrito,
  actualizarCantidad,
  eliminarItem,
  calcularSubtotal,
  listarProductos,
  promocionesActivas,
  calcularDescuento
} from '../domain/index.js';
import { formatearMoneda, mostrarError, mostrarMensaje } from '../shared/index.js';
import { qs, crear, limpiar } from '../core/index.js';

export function inicializarCarrito() {
  const lista = qs('#carrito-lista');
  if (!lista) return;

  function renderizar() {
    try {
      const productos = listarProductos();
      const carrito = obtenerCarrito();
      limpiar(lista);
      if (!carrito.items.length) {
        const vacio = crear('p');
        vacio.className = 'estado-vacio';
        vacio.textContent = 'Tu carrito está vacío. Explora el catálogo y elige algo delicioso.';
        lista.appendChild(vacio);
      }

      carrito.items.forEach((item) => {
        const producto = productos.find((registro) => registro.id === item.productoId);
        if (producto) lista.appendChild(renderizarItem(item, producto));
      });

      const subtotal = calcularSubtotal(carrito.items, productos);
      const descuento = calcularDescuento(subtotal, promocionesActivas());
      qs('#carrito-subtotal').textContent = formatearMoneda(subtotal);
      qs('#carrito-descuento').textContent = formatearMoneda(descuento);
      qs('#carrito-total').textContent = formatearMoneda(subtotal - descuento);
      const checkout = qs('#carrito-checkout');
      if (checkout) checkout.hidden = carrito.items.length === 0;
    } catch (error) {
      mostrarError(error);
    }
  }

  lista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-action="quitar-item"]');
    if (!boton) return;
    try {
      eliminarItem(boton.closest('[data-product-id]').dataset.productId);
      mostrarMensaje('Producto eliminado del carrito.', 'exito');
      renderizar();
    } catch (error) {
      mostrarError(error);
    }
  });

  lista.addEventListener('change', (evento) => {
    const campo = evento.target.closest('[data-action="cambiar-cantidad"]');
    if (!campo) return;
    try {
      actualizarCantidad(campo.closest('[data-product-id]').dataset.productId, Number(campo.value), listarProductos());
      renderizar();
    } catch (error) {
      mostrarError(error);
      renderizar();
    }
  });
  renderizar();
}

function renderizarItem(item, producto) {
  const contenedor = crear('article');
  contenedor.className = 'carrito__item';
  contenedor.dataset.productId = producto.id;
  const detalle = crear('div');
  const titulo = crear('h2');
  titulo.className = 'carrito__item-title';
  titulo.textContent = producto.nombre;
  const precio = crear('p');
  precio.className = 'carrito__item-precio';
  precio.textContent = `${formatearMoneda(producto.precio)} por unidad`;
  detalle.append(titulo, precio);
  const cantidad = crear('input');
  cantidad.className = 'formulario__input carrito__cantidad';
  cantidad.type = 'number';
  cantidad.min = '0';
  cantidad.max = String(producto.stock);
  cantidad.value = String(item.cantidad);
  cantidad.setAttribute('aria-label', `Cantidad de ${producto.nombre}`);
  cantidad.dataset.action = 'cambiar-cantidad';
  const quitar = crear('button');
  quitar.type = 'button';
  quitar.className = 'btn btn--secundario';
  quitar.dataset.action = 'quitar-item';
  quitar.textContent = 'Quitar';
  contenedor.append(detalle, cantidad, quitar);
  return contenedor;
}
