import { leer, guardar } from '../data/index.js';
import { AppError, esCorreoValido, esTextoNoVacio } from '../shared/index.js';

const CLAVE_SESION = 'sesion';

export function registrarUsuario(datos) {
  const nombre = String(datos.nombre || '').trim();
  const direccion = String(datos.direccion || '').trim();
  const telefono = String(datos.telefono || '').trim();
  const correo = String(datos.correo || '').trim().toLowerCase();
  const password = String(datos.password || '');

  if (![nombre, direccion, telefono].every(esTextoNoVacio) || !esCorreoValido(correo)) {
    throw new AppError('Completa todos los campos con datos válidos.', 'DATOS_INVALIDOS');
  }
  if (password.length < 8) throw new AppError('La contraseña debe tener al menos 8 caracteres.', 'PASSWORD_CORTO');

  const usuarios = leer('usuarios', []);
  if (usuarios.some((usuario) => usuario.correo.toLowerCase() === correo)) {
    throw new AppError('Ya existe una cuenta con ese correo.', 'CORREO_DUPLICADO');
  }

  const usuario = {
    id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nombre,
    direccion,
    telefono,
    correo,
    password,
    rol: 'cliente'
  };
  usuarios.push(usuario);
  guardar('usuarios', usuarios);
  guardar(CLAVE_SESION, { id: usuario.id, nombre, correo, rol: usuario.rol });
  return { id: usuario.id, nombre, correo, rol: usuario.rol };
}

export function iniciarSesion(correo, password) {
  const correoNormalizado = String(correo || '').trim().toLowerCase();
  if (!esCorreoValido(correoNormalizado) || !esTextoNoVacio(password)) {
    throw new AppError('Ingresa un correo y una contraseña válidos.', 'CREDENCIALES_INVALIDAS');
  }

  const usuario = leer('usuarios', []).find(
    (registro) => registro.correo.toLowerCase() === correoNormalizado && registro.password === password
  );
  if (!usuario) throw new AppError('El correo o la contraseña no coinciden.', 'LOGIN_INVALIDO');

  const sesion = {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol
  };
  guardar(CLAVE_SESION, sesion);
  return sesion;
}

export function obtenerSesion() {
  return leer(CLAVE_SESION, null);
}

export function cerrarSesion() {
  guardar(CLAVE_SESION, null);
}
