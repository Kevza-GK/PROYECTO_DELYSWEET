import { leer, guardar } from '../data/index.js';
import { AppError, esNumeroPositivo, esTextoNoVacio } from '../shared/index.js';

export function listarProductos() {
  return leer('productos', []).filter((producto) => producto.activo !== false);
}

export function obtenerProducto(productoId) {
  const producto = leer('productos', []).find((item) => item.id === productoId && item.activo !== false);
  if (!producto) throw new AppError('No encontramos ese postre.', 'PRODUCTO_NO_ENCONTRADO');
  return producto;
}

export function crearProducto(datos) {
  validarProducto(datos);
  const productos = leer('productos', []);
  const producto = {
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    imagen: datos.imagen || 'assets/img/postres/cheesecake.svg',
    categoria: datos.categoria.trim(),
    activo: true
  };
  productos.push(producto);
  guardar('productos', productos);
  return producto;
}

export function editarProducto(productoId, datos) {
  validarProducto(datos);
  const productos = leer('productos', []);
  const producto = productos.find((item) => item.id === productoId);
  if (!producto) throw new AppError('Producto no encontrado.', 'PRODUCTO_NO_ENCONTRADO');
  Object.assign(producto, {
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    imagen: datos.imagen || producto.imagen,
    categoria: datos.categoria.trim()
  });
  guardar('productos', productos);
  return producto;
}

export function eliminarProducto(productoId) {
  const productos = leer('productos', []);
  const pedidosActivos = leer('pedidos', []).filter(
    (pedido) => !['Cancelado', 'Entregado'].includes(pedido.estado)
  );
  if (pedidosActivos.some((pedido) => pedido.items.some((item) => item.productoId === productoId))) {
    throw new AppError('No se puede eliminar: el producto aparece en un pedido activo.', 'PRODUCTO_EN_PEDIDO');
  }
  const producto = productos.find((item) => item.id === productoId);
  if (!producto) throw new AppError('Producto no encontrado.', 'PRODUCTO_NO_ENCONTRADO');
  producto.activo = false;
  guardar('productos', productos);
  return producto;
}

function validarProducto(datos) {
  if (
    !esTextoNoVacio(datos.nombre) ||
    !esTextoNoVacio(datos.descripcion) ||
    !esTextoNoVacio(datos.categoria) ||
    !esNumeroPositivo(datos.precio) ||
    Number(datos.precio) <= 0 ||
    !Number.isInteger(Number(datos.stock))
  ) {
    throw new AppError('Revisa el nombre, descripción, categoría, precio y stock del producto.', 'PRODUCTO_INVALIDO');
  }
  if (!Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
    throw new AppError('El stock debe ser un entero igual o mayor que cero.', 'STOCK_INVALIDO');
  }
}
