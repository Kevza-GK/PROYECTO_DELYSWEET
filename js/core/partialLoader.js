async function obtenerHTML(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${ruta} (${respuesta.status}).`);
  return respuesta.text();
}

export async function cargarParcial(ruta, montaje) {
  if (!montaje) throw new Error('No se encontró el punto de montaje de la vista.');
  montaje.innerHTML = await obtenerHTML(ruta);
}

export async function cargarVistasBase() {
  const montajes = [
    ['[data-view="header"]', 'views/partials/header.html'],
    ['[data-view="footer"]', 'views/partials/footer.html']
  ];

  await Promise.all(montajes.map(async ([selector, ruta]) => {
    const montaje = document.querySelector(selector);
    if (montaje) await cargarParcial(ruta, montaje);
  }));
}
