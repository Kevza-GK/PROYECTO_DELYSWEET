import { cargarVistasBase } from './core/index.js';
import { sembrarDatosIniciales } from './data/index.js';
import { mostrarError } from './shared/index.js';
import {
  inicializarNavegacion,
  inicializarInicio,
  inicializarCatalogo,
  inicializarProducto,
  inicializarCarrito,
  inicializarCheckout,
  inicializarAuth,
  inicializarPedidos,
  inicializarAdmin
} from './ui/index.js';

const MAPA_PAGINAS = {
  inicio: inicializarInicio,
  catalogo: inicializarCatalogo,
  producto: inicializarProducto,
  carrito: inicializarCarrito,
  checkout: inicializarCheckout,
  login: inicializarAuth,
  registro: inicializarAuth,
  pedido: inicializarPedidos,
  historial: inicializarPedidos,
  admin: inicializarAdmin
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    sembrarDatosIniciales();
    await cargarVistasBase();
    inicializarNavegacion();
    const inicializar = MAPA_PAGINAS[document.body.dataset.page];
    if (inicializar) inicializar();
  } catch (error) {
    mostrarError(error);
  }
});
