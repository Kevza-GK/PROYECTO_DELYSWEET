import { leer, guardar } from './index.js';

const PRODUCTOS_DEMO = [
  {
    id: 'prod-001',
    nombre: 'Cheesecake de fresa',
    descripcion: 'Cheesecake cremoso con fresas frescas y base de galleta artesanal.',
    precio: 12000,
    stock: 10,
    imagen: 'assets/img/postres/cheesecake.svg',
    categoria: 'Tortas',
    activo: true
  },
  {
    id: 'prod-002',
    nombre: 'Brownie de chocolate',
    descripcion: 'Brownie de chocolate intenso, horneado diariamente.',
    precio: 8000,
    stock: 14,
    imagen: 'assets/img/postres/brownie.svg',
    categoria: 'Porciones',
    activo: true
  },
  {
    id: 'prod-003',
    nombre: 'Torta de zanahoria',
    descripcion: 'Bizcocho húmedo de zanahoria con frosting suave de queso crema.',
    precio: 14000,
    stock: 8,
    imagen: 'assets/img/postres/torta-zanahoria.svg',
    categoria: 'Tortas',
    activo: true
  },
  {
    id: 'prod-004',
    nombre: 'Alfajores artesanales',
    descripcion: 'Dos alfajores suaves rellenos de arequipe y cubiertos con azúcar.',
    precio: 6000,
    stock: 20,
    imagen: 'assets/img/postres/alfajores.svg',
    categoria: 'Galletas',
    activo: true
  }
];

const ADMIN_DEMO = {
  id: 'usr-admin',
  nombre: 'Administración DelySweet',
  direccion: 'Bogotá, Colombia',
  telefono: '3000000000',
  correo: 'admin@delysweet.com',
  password: 'DelySweet2026',
  rol: 'admin'
};

export function sembrarDatosIniciales() {
  const anio = new Date().getFullYear();
  if (leer('productos') === null) guardar('productos', PRODUCTOS_DEMO);
  if (leer('usuarios') === null) guardar('usuarios', [ADMIN_DEMO]);
  if (leer('pedidos') === null) guardar('pedidos', []);
  if (leer('ventas') === null) guardar('ventas', []);
  if (leer('promociones') === null) {
    guardar('promociones', [{
      id: 'promo-bienvenida',
      nombre: 'Bienvenida',
      porcentaje: 10,
      fechaInicio: `${anio}-01-01`,
      fechaFin: `${anio}-12-31`,
      activa: true
    }]);
  }
  if (leer('incidencias') === null) guardar('incidencias', []);
}
