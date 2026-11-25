import { listarProductos, obtenerProducto, agregarProducto } from '../domain/index.js';
import { formatearMoneda, mostrarMensaje, mostrarError } from '../shared/index.js';
import { qs, crear, limpiar } from '../core/index.js';

export function inicializarInicio() {
  const contenedor = qs('#productos-destacados');
  if (contenedor) renderizarCatalogo(contenedor, listarProductos().slice(0, 3));
}

export function inicializarCatalogo() {
  const contenedor = qs('#catalogo-productos');
  if (contenedor) renderizarCatalogo(contenedor, listarProductos());
}

export function inicializarProducto() {
  const contenedor = qs('#producto-detalle');
  if (!contenedor) return;
  try {
    const producto = obtenerProducto(new URLSearchParams(window.location.search).get('id'));
    const imagen = crear('img');
    imagen.className = 'producto__imagen';
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
    const contenido = crear('div');
    contenido.className = 'producto__contenido';
    const titulo = crear('h1');
    titulo.className = 'seccion__title';
    titulo.textContent = producto.nombre;
    const descripcion = crear('p');
    descripcion.textContent = producto.descripcion;
    const precio = crear('p');
    precio.className = 'card__precio producto__precio';
    precio.textContent = formatearMoneda(producto.precio);
    const stock = crear('p');
    stock.className = producto.stock ? 'badge badge--disponible' : 'badge badge--agotado';
    stock.textContent = producto.stock ? `${producto.stock} disponibles` : 'Agotado';
    const cantidadLabel = crear('label');
    cantidadLabel.className = 'formulario__label';
    cantidadLabel.htmlFor = 'producto-cantidad';
    cantidadLabel.textContent = 'Cantidad';
    const cantidad = crear('input');
    cantidad.className = 'formulario__input';
    cantidad.id = 'producto-cantidad';
    cantidad.type = 'number';
    cantidad.min = '1';
    cantidad.max = String(producto.stock);
    cantidad.value = '1';
    cantidad.disabled = producto.stock === 0;
    const boton = crear('button');
    boton.type = 'button';
    boton.className = 'btn btn--primario';
    boton.disabled = producto.stock === 0;
    boton.textContent = 'Agregar al carrito';
    boton.addEventListener('click', () => {
      try {
        agregarProducto(producto, Number(cantidad.value));
        mostrarMensaje('Postre agregado al carrito.', 'exito');
      } catch (error) {
        mostrarError(error);
      }
    });
    contenido.append(titulo, descripcion, precio, stock, cantidadLabel, cantidad, boton);
    contenedor.replaceChildren(imagen, contenido);
  } catch (error) {
    mostrarError(error);
  }
}

function renderizarCatalogo(contenedor, productos) {
  limpiar(contenedor);
  if (!productos.length) {
    const vacio = crear('p');
    vacio.className = 'estado-vacio';
    vacio.textContent = 'Pronto tendremos más postres para ti.';
    contenedor.appendChild(vacio);
    return;
  }
  productos.forEach((producto) => contenedor.appendChild(crearTarjeta(producto)));
}

function crearTarjeta(producto) {
  const tarjeta = crear('article');
  tarjeta.className = 'card';
  const imagen = crear('img');
  imagen.className = 'card__imagen';
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  imagen.loading = 'lazy';
  const contenido = crear('div');
  contenido.className = 'card__contenido';
  const titulo = crear('h2');
  titulo.className = 'card__title';
  titulo.textContent = producto.nombre;
  const precio = crear('p');
  precio.className = 'card__precio';
  precio.textContent = formatearMoneda(producto.precio);
  const descripcion = crear('p');
  descripcion.className = 'card__descripcion';
  descripcion.textContent = producto.descripcion;
  const stock = crear('span');
  stock.className = `badge ${producto.stock ? 'badge--disponible' : 'badge--agotado'}`;
  stock.textContent = producto.stock ? 'Disponible' : 'Agotado';
  const acciones = crear('div');
  acciones.className = 'card__acciones';
  const detalle = crear('a');
  detalle.className = 'btn btn--secundario';
  detalle.href = `producto.html?id=${encodeURIComponent(producto.id)}`;
  detalle.textContent = 'Ver detalle';
  const agregar = crear('button');
  agregar.className = 'btn btn--primario';
  agregar.type = 'button';
  agregar.disabled = producto.stock === 0;
  agregar.textContent = 'Agregar';
  agregar.addEventListener('click', () => {
    try {
      agregarProducto(producto);
      mostrarMensaje(`${producto.nombre} se agregó al carrito.`, 'exito');
    } catch (error) {
      mostrarError(error);
    }
  });
  acciones.append(detalle, agregar);
  contenido.append(titulo, precio, descripcion, stock, acciones);
  tarjeta.append(imagen, contenido);
  return tarjeta;
}
