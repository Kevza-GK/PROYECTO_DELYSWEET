import { obtenerSesion, cerrarSesion, obtenerCarrito } from '../domain/index.js';
import { mostrarMensaje } from '../shared/index.js';
import { qs, crear } from '../core/index.js';

export function inicializarNavegacion() {
  const nav = qs('.nav__list');
  if (!nav) return;
  const sesion = obtenerSesion();
  const carrito = obtenerCarrito();
  const enlaceCarrito = nav.querySelector('a[href="carrito.html"]');
  if (enlaceCarrito) enlaceCarrito.textContent = `Carrito (${carrito.items.length})`;

  if (!sesion) return;
  nav.querySelectorAll('a[href="login.html"], a[href="registro.html"]').forEach((enlace) => enlace.closest('li')?.remove());
  if (sesion.rol === 'admin') {
    nav.appendChild(crearEnlace('Administración', 'admin.html'));
  } else {
    nav.appendChild(crearEnlace('Mi cuenta', 'historial.html'));
  }
  const itemSalir = crear('li');
  itemSalir.className = 'nav__item';
  const botonSalir = crear('button');
  botonSalir.type = 'button';
  botonSalir.className = 'nav__link nav__link--boton';
  botonSalir.textContent = 'Cerrar sesión';
  botonSalir.addEventListener('click', () => {
    cerrarSesion();
    mostrarMensaje('Sesión cerrada.', 'exito');
    window.location.href = 'index.html';
  });
  itemSalir.appendChild(botonSalir);
  nav.appendChild(itemSalir);
}

function crearEnlace(texto, href) {
  const item = crear('li');
  item.className = 'nav__item';
  const enlace = crear('a');
  enlace.className = 'nav__link';
  enlace.href = href;
  enlace.textContent = texto;
  item.appendChild(enlace);
  return item;
}
