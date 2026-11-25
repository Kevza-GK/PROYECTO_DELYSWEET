export function mostrarMensaje(texto, tipo = 'info') {
  const contenedor = document.getElementById('mensajes');
  if (!contenedor) return;

  const mensaje = document.createElement('div');
  mensaje.className = `mensaje mensaje--${tipo}`;
  mensaje.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
  mensaje.textContent = texto;
  contenedor.appendChild(mensaje);
  window.setTimeout(() => mensaje.remove(), 4000);
}

export function mostrarError(error) {
  mostrarMensaje(error instanceof Error ? error.message : String(error), 'error');
}

export function renderizarResultado(contenedor, contenido) {
  if (contenedor) contenedor.replaceChildren(contenido);
}
