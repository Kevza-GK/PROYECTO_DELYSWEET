import {
  obtenerSesion,
  listarProductos,
  crearProducto,
  editarProducto,
  eliminarProducto,
  listarPedidos,
  actualizarEstadoPedido,
  cancelarPedido,
  alertasStockBajo,
  productosMasVendidos,
  crearPromocion,
  promocionesActivas
} from '../domain/index.js';
import { formatearMoneda, formatearFecha, mostrarError, mostrarMensaje } from '../shared/index.js';
import { qs, crear, limpiar } from '../core/index.js';

export function inicializarAdmin() {
  const contenido = qs('#admin-contenido');
  if (!contenido) return;
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'admin') {
    const aviso = crear('section');
    aviso.className = 'seccion estado-acceso';
    const titulo = crear('h1');
    titulo.textContent = 'Acceso restringido';
    const texto = crear('p');
    texto.textContent = 'Esta sección está disponible únicamente para el administrador.';
    const enlace = crear('a');
    enlace.className = 'btn btn--primario';
    enlace.href = 'login.html';
    enlace.textContent = 'Iniciar sesión';
    aviso.append(titulo, texto, enlace);
    contenido.replaceChildren(aviso);
    return;
  }

  renderizarProductos();
  renderizarPedidos();
  renderizarPromociones();
  renderizarReportes();
  enlazarFormularioProducto();
  enlazarFormularioPromocion();
}

function enlazarFormularioProducto() {
  const formulario = qs('#form-producto');
  const imagen = qs('#producto-imagen');
  if (!formulario || !imagen) return;
  imagen.addEventListener('change', () => {
    const archivo = imagen.files[0];
    if (!archivo) {
      imagen.dataset.imagen = '';
      return;
    }
    if (!archivo.type.startsWith('image/') || archivo.size > 200 * 1024) {
      imagen.value = '';
      imagen.dataset.imagen = '';
      mostrarError(new Error('Selecciona una imagen de máximo 200 KB.'));
      return;
    }
    const lector = new FileReader();
    lector.addEventListener('load', () => { imagen.dataset.imagen = String(lector.result); });
    lector.addEventListener('error', () => mostrarError(new Error('No fue posible leer la imagen.')));
    lector.readAsDataURL(archivo);
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    const datos = Object.fromEntries(new FormData(formulario));
    datos.imagen = imagen.dataset.imagen || formulario.dataset.imagen || 'assets/img/postres/cheesecake.svg';
    const productoId = formulario.dataset.productId;
    try {
      if (productoId) editarProducto(productoId, datos);
      else crearProducto(datos);
      formulario.reset();
      delete formulario.dataset.productId;
      delete formulario.dataset.imagen;
      imagen.dataset.imagen = '';
      qs('#producto-guardar').textContent = 'Agregar producto';
      mostrarMensaje(productoId ? 'Producto actualizado.' : 'Producto agregado.', 'exito');
      renderizarProductos();
      renderizarReportes();
    } catch (error) {
      mostrarError(error);
    }
  });
}

function renderizarProductos() {
  const cuerpo = qs('#admin-productos');
  if (!cuerpo) return;
  limpiar(cuerpo);
  listarProductos().forEach((producto) => {
    const fila = crear('tr');
    agregarCelda(fila, producto.nombre);
    agregarCelda(fila, formatearMoneda(producto.precio));
    agregarCelda(fila, String(producto.stock));
    const acciones = crear('td');
    acciones.className = 'tabla__td tabla__acciones';
    const editar = crear('button');
    editar.type = 'button';
    editar.className = 'btn btn--secundario';
    editar.textContent = 'Editar';
    editar.addEventListener('click', () => cargarProductoEnFormulario(producto));
    const eliminar = crear('button');
    eliminar.type = 'button';
    eliminar.className = 'btn btn--secundario';
    eliminar.textContent = 'Retirar';
    eliminar.addEventListener('click', () => {
      if (!window.confirm(`¿Retirar "${producto.nombre}" del catálogo?`)) return;
      try {
        eliminarProducto(producto.id);
        mostrarMensaje('Producto retirado del catálogo.', 'exito');
        renderizarProductos();
      } catch (error) {
        mostrarError(error);
      }
    });
    acciones.append(editar, eliminar);
    fila.appendChild(acciones);
    cuerpo.appendChild(fila);
  });
}

function cargarProductoEnFormulario(producto) {
  const formulario = qs('#form-producto');
  if (!formulario) return;
  formulario.elements.namedItem('nombre').value = producto.nombre;
  formulario.elements.namedItem('descripcion').value = producto.descripcion;
  formulario.elements.namedItem('precio').value = String(producto.precio);
  formulario.elements.namedItem('stock').value = String(producto.stock);
  formulario.elements.namedItem('categoria').value = producto.categoria;
  formulario.dataset.productId = producto.id;
  formulario.dataset.imagen = producto.imagen;
  qs('#producto-guardar').textContent = 'Guardar cambios';
}

function renderizarPedidos() {
  const cuerpo = qs('#admin-pedidos');
  if (!cuerpo) return;
  limpiar(cuerpo);
  listarPedidos().slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).forEach((pedido) => {
    const fila = crear('tr');
    agregarCelda(fila, pedido.id);
    agregarCelda(fila, pedido.clienteNombre || pedido.clienteCorreo || 'Cliente');
    agregarCelda(fila, formatearFecha(pedido.fecha));
    agregarCelda(fila, pedido.estado);
    agregarCelda(fila, formatearMoneda(pedido.total));
    const acciones = crear('td');
    acciones.className = 'tabla__td tabla__acciones';
    if (pedido.estado !== 'Cancelado' && pedido.estado !== 'Entregado') {
      const estado = crear('select');
      estado.className = 'formulario__input';
      estado.setAttribute('aria-label', `Estado del pedido ${pedido.id}`);
      ['Pedido confirmado', 'En preparación', 'En camino', 'Entregado'].forEach((valor) => {
        const opcion = crear('option');
        opcion.value = valor;
        opcion.textContent = valor;
        opcion.selected = valor === pedido.estado;
        estado.appendChild(opcion);
      });
      estado.addEventListener('change', () => {
        try {
          actualizarEstadoPedido(pedido.id, estado.value);
          mostrarMensaje('Estado del pedido actualizado.', 'exito');
          renderizarPedidos();
        } catch (error) {
          mostrarError(error);
        }
      });
      acciones.appendChild(estado);
      const cancelar = crear('button');
      cancelar.type = 'button';
      cancelar.className = 'btn btn--secundario';
      cancelar.textContent = 'Cancelar';
      cancelar.addEventListener('click', () => {
        if (!window.confirm(`¿Cancelar el pedido ${pedido.id}? Se intentará restituir su inventario.`)) return;
        try {
          const resultado = cancelarPedido(pedido.id);
          mostrarMensaje(
            resultado.stockRestituido === false
              ? 'Pedido cancelado; se registró una incidencia y no se modificó el inventario.'
              : 'Pedido cancelado e inventario restituido.',
            resultado.stockRestituido === false ? 'info' : 'exito'
          );
          renderizarPedidos();
          renderizarReportes();
        } catch (error) {
          mostrarError(error);
        }
      });
      acciones.appendChild(cancelar);
    }
    fila.appendChild(acciones);
    cuerpo.appendChild(fila);
  });
}

function enlazarFormularioPromocion() {
  const formulario = qs('#form-promocion');
  if (!formulario) return;
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    try {
      crearPromocion(Object.fromEntries(new FormData(formulario)));
      formulario.reset();
      mostrarMensaje('Promoción guardada.', 'exito');
      renderizarPromociones();
    } catch (error) {
      mostrarError(error);
    }
  });
}

function renderizarPromociones() {
  const lista = qs('#admin-promociones');
  if (!lista) return;
  limpiar(lista);
  const promociones = promocionesActivas();
  if (!promociones.length) {
    const vacio = crear('li');
    vacio.textContent = 'No hay promociones activas.';
    lista.appendChild(vacio);
    return;
  }
  promociones.forEach((promocion) => {
    const item = crear('li');
    item.textContent = `${promocion.nombre}: ${promocion.porcentaje}% hasta ${promocion.fechaFin}`;
    lista.appendChild(item);
  });
}

function renderizarReportes() {
  const alertas = qs('#admin-alertas');
  const ranking = qs('#admin-ranking');
  if (alertas) {
    limpiar(alertas);
    const productos = alertasStockBajo();
    if (!productos.length) {
      const item = crear('li');
      item.textContent = 'No hay productos con stock bajo.';
      alertas.appendChild(item);
    }
    productos.forEach((producto) => {
      const item = crear('li');
      item.textContent = `${producto.nombre}: ${producto.stock} unidades`;
      alertas.appendChild(item);
    });
  }
  if (ranking) {
    limpiar(ranking);
    productosMasVendidos().slice(0, 5).forEach((producto, indice) => {
      const item = crear('li');
      item.textContent = `${indice + 1}. ${producto.nombre}: ${producto.unidadesVendidas} vendidos`;
      ranking.appendChild(item);
    });
  }
}

function agregarCelda(fila, texto) {
  const celda = crear('td');
  celda.className = 'tabla__td';
  celda.textContent = texto;
  fila.appendChild(celda);
}
