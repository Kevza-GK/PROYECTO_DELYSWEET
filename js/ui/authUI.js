import { registrarUsuario, iniciarSesion } from '../domain/index.js';
import { mostrarError, mostrarMensaje } from '../shared/index.js';
import { qs } from '../core/index.js';

export function inicializarAuth() {
  const formularioRegistro = qs('#form-registro');
  const formularioLogin = qs('#form-login');

  if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const datos = Object.fromEntries(new FormData(formularioRegistro));
      try {
        registrarUsuario(datos);
        mostrarMensaje('Tu cuenta está lista. ¡Bienvenido a DelySweet!', 'exito');
        window.setTimeout(() => { window.location.href = 'index.html'; }, 800);
      } catch (error) {
        mostrarError(error);
      }
    });
  }

  if (formularioLogin) {
    formularioLogin.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const datos = new FormData(formularioLogin);
      try {
        const sesion = iniciarSesion(datos.get('correo'), datos.get('password'));
        mostrarMensaje(`Bienvenido, ${sesion.nombre}.`, 'exito');
        window.setTimeout(() => {
          window.location.href = sesion.rol === 'admin' ? 'admin.html' : 'index.html';
        }, 600);
      } catch (error) {
        mostrarError(error);
      }
    });
  }
}
