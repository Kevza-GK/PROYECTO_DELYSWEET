Sistema de estilos completo
css/main.css
css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

@import url('./base/_reset.css');
@import url('./base/_variables.css');
@import url('./base/_tipografia.css');
@import url('./layouts/_app-layout.css');
@import url('./layouts/_header.css');
@import url('./layouts/_footer.css');
@import url('./componentes/_botones.css');
@import url('./componentes/_cards.css');
@import url('./componentes/_formularios.css');
@import url('./componentes/_tablas.css');
@import url('./componentes/_badges.css');
@import url('./componentes/_mensajes.css');
@import url('./paginas/_inicio.css');
@import url('./paginas/_catalogo.css');
@import url('./paginas/_carrito.css');
@import url('./paginas/_checkout.css');
@import url('./paginas/_admin.css');
css/base/_reset.css
css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  line-height: 1.6;
}

img {
  max-width: 100%;
  display: block;
}

button,
input,
select,
textarea {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}
css/base/_variables.css
css
:root {
  --color-primario: #d94f70;
  --color-secundario: #f7b267;
  --color-fondo: #fff8f0;
  --color-texto: #3d2c2e;
  --color-blanco: #ffffff;
  --color-exito: #2e7d32;
  --color-error: #c62828;
  --color-alerta: #ef6c00;

  --fuente-principal: 'Nunito', sans-serif;

  --espaciado-pequeno: 8px;
  --espaciado-medio: 16px;
  --espaciado-grande: 24px;

  --radio-borde: 12px;
  --sombra-suave: 0 4px 16px rgba(61, 44, 46, 0.12);
  --transicion-rapida: 160ms ease;
  --ancho-contenedor: 1120px;
}
css/base/_tipografia.css
css
body {
  font-family: var(--fuente-principal);
  color: var(--color-texto);
  background-color: var(--color-fondo);
}

h1,
h2,
h3 {
  line-height: 1.2;
  font-weight: 800;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.125rem; }
p { font-size: 1rem; }

.skip-link {
  position: absolute;
  top: -48px;
  left: var(--espaciado-medio);
  background-color: var(--color-primario);
  color: var(--color-blanco);
  padding: var(--espaciado-pequeno) var(--espaciado-medio);
  border-radius: var(--radio-borde);
  z-index: 1000;
}

.skip-link:focus {
  top: var(--espaciado-medio);
  outline: 3px solid var(--color-secundario);
}
css/layouts/_app-layout.css
css
.app-layout,
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'header'
    'main'
    'footer';
}

.header { grid-area: header; }

.main-wrapper {
  grid-area: main;
  width: min(100% - (var(--espaciado-medio) * 2), var(--ancho-contenedor));
  margin-inline: auto;
  padding-block: var(--espaciado-grande);
}

.footer { grid-area: footer; }

.seccion { margin-block-end: var(--espaciado-grande); }
.seccion__title { margin-block-end: var(--espaciado-pequeno); }
.seccion__texto { margin-block-end: var(--espaciado-medio); }

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--espaciado-medio);
}
css/layouts/_header.css
css
.header {
  background-color: var(--color-blanco);
  box-shadow: var(--sombra-suave);
}

.header__contenedor {
  width: min(100% - (var(--espaciado-medio) * 2), var(--ancho-contenedor));
  margin-inline: auto;
  padding-block: var(--espaciado-medio);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--espaciado-medio);
}

.header__logo { display: inline-flex; align-items: center; }

.nav__list {
  display: flex;
  align-items: center;
  gap: var(--espaciado-medio);
  flex-wrap: wrap;
}

.nav__link {
  padding: var(--espaciado-pequeno);
  border-radius: var(--radio-borde);
  transition: background-color var(--transicion-rapida), color var(--transicion-rapida);
}

.nav__link:hover,
.nav__link:focus {
  background-color: var(--color-fondo);
  color: var(--color-primario);
  outline: 3px solid var(--color-secundario);
}

.nav__link--cta {
  background-color: var(--color-primario);
  color: var(--color-blanco);
}

.nav__link--cta:hover,
.nav__link--cta:focus {
  background-color: var(--color-texto);
  color: var(--color-blanco);
}
css/layouts/_footer.css
css
.footer {
  background-color: var(--color-texto);
  color: var(--color-blanco);
  padding: var(--espaciado-grande) var(--espaciado-medio);
  text-align: center;
}

.footer__texto { font-size: 0.875rem; }
css/componentes/_botones.css
css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--espaciado-pequeno);
  padding: var(--espaciado-pequeno) var(--espaciado-medio);
  border: 2px solid transparent;
  border-radius: var(--radio-borde);
  cursor: pointer;
  font-weight: 700;
  transition: transform var(--transicion-rapida), background-color var(--transicion-rapida), color var(--transicion-rapida);
}

.btn:hover { transform: translateY(-1px); }
.btn:focus { outline: 3px solid var(--color-secundario); outline-offset: 2px; }
.btn:active { transform: translateY(0); }

.btn--primario {
  background-color: var(--color-primario);
  color: var(--color-blanco);
}

.btn--primario:hover { background-color: var(--color-texto); }

.btn--secundario {
  background-color: transparent;
  color: var(--color-primario);
  border-color: var(--color-primario);
}

.btn--secundario:hover {
  background-color: var(--color-primario);
  color: var(--color-blanco);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}
css/componentes/_cards.css
css
.card {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--color-blanco);
  border-radius: var(--radio-borde);
  box-shadow: var(--sombra-suave);
  overflow: hidden;
  transition: transform var(--transicion-rapida), box-shadow var(--transicion-rapida);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(61, 44, 46, 0.18);
}

.card--destacada { border: 2px solid var(--color-secundario); }

.card__imagen {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: var(--color-fondo);
}

.card__contenido {
  padding: var(--espaciado-medio);
  display: flex;
  flex-direction: column;
  gap: var(--espaciado-pequeno);
  flex-grow: 1;
}

.card__title { font-size: 1.125rem; }
.card__precio { font-weight: 800; color: var(--color-primario); }

.card__acciones {
  margin-top: auto;
  display: flex;
  gap: var(--espaciado-pequeno);
  flex-wrap: wrap;
}
css/componentes/_formularios.css
css
.formulario {
  display: grid;
  gap: var(--espaciado-medio);
  max-width: 640px;
}

.formulario__fieldset {
  border: 1px solid rgba(61, 44, 46, 0.2);
  border-radius: var(--radio-borde);
  padding: var(--espaciado-medio);
  display: grid;
  gap: var(--espaciado-medio);
}

.formulario__legend {
  padding-inline: var(--espaciado-pequeno);
  font-weight: 800;
}

.formulario__grupo { display: grid; gap: var(--espaciado-pequeno); }

.formulario__grupo--radio {
  display: flex;
  align-items: center;
  gap: var(--espaciado-pequeno);
}

.formulario__label { font-weight: 700; }

.formulario__input {
  width: 100%;
  padding: var(--espaciado-pequeno) var(--espaciado-medio);
  border: 1px solid rgba(61, 44, 46, 0.3);
  border-radius: var(--radio-borde);
  background-color: var(--color-blanco);
  transition: border-color var(--transicion-rapida), box-shadow var(--transicion-rapida);
}

.formulario__input:hover { border-color: var(--color-primario); }

.formulario__input:focus {
  outline: 3px solid var(--color-secundario);
  border-color: var(--color-primario);
}
css/componentes/_mensajes.css
css
.mensajes {
  position: fixed;
  right: var(--espaciado-medio);
  bottom: var(--espaciado-medio);
  display: grid;
  gap: var(--espaciado-pequeno);
  z-index: 1000;
  max-width: 360px;
}

.mensaje {
  padding: var(--espaciado-medio);
  border-radius: var(--radio-borde);
  color: var(--color-blanco);
  box-shadow: var(--sombra-suave);
  animation: aparecer 180ms ease-out;
}

.mensaje--exito { background-color: var(--color-exito); }
.mensaje--error { background-color: var(--color-error); }
.mensaje--info { background-color: var(--color-primario); }

@keyframes aparecer {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
css/componentes/_badges.css
css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px var(--espaciado-pequeno);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
}

.badge--disponible {
  background-color: rgba(46, 125, 50, 0.12);
  color: var(--color-exito);
}

.badge--agotado {
  background-color: rgba(198, 40, 40, 0.12);
  color: var(--color-error);
}

.badge--pendiente {
  background-color: rgba(239, 108, 0, 0.12);
  color: var(--color-alerta);
}
css/paginas/_inicio.css
css
.hero {
  min-height: 360px;
  display: grid;
  place-items: center;
  padding: var(--espaciado-grande);
  border-radius: var(--radio-borde);
  background-image: linear-gradient(rgba(61, 44, 46, 0.45), rgba(61, 44, 46, 0.45)), url('../assets/img/postres/hero-postres.jpg');
  background-size: cover;
  background-position: center;
  color: var(--color-blanco);
  text-align: center;
  margin-block-end: var(--espaciado-grande);
}

.hero__title { font-size: clamp(2rem, 6vw, 3.5rem); }
.hero__texto { margin-block: var(--espaciado-medio); }
css/paginas/_carrito.css
css
.carrito { display: grid; gap: var(--espaciado-medio); }

.carrito__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--espaciado-medio);
  padding: var(--espaciado-medio);
  background-color: var(--color-blanco);
  border-radius: var(--radio-borde);
  box-shadow: var(--sombra-suave);
}

.carrito__resumen {
  margin-top: var(--espaciado-grande);
  padding: var(--espaciado-medio);
  background-color: var(--color-blanco);
  border-radius: var(--radio-borde);
  box-shadow: var(--sombra-suave);
}

.carrito__linea {
  display: flex;
  justify-content: space-between;
  gap: var(--espaciado-medio);
  padding-block: var(--espaciado-pequeno);
}

.carrito__linea--total {
  font-weight: 800;
  font-size: 1.125rem;
  border-top: 1px solid rgba(61, 44, 46, 0.2);
}
css/paginas/_admin.css
css
.admin__grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: var(--espaciado-grande);
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-blanco);
  border-radius: var(--radio-borde);
  overflow: hidden;
}

.tabla__th,
.tabla__td {
  padding: var(--espaciado-pequeno) var(--espaciado-medio);
  text-align: left;
  border-bottom: 1px solid rgba(61, 44, 46, 0.12);
}

.tabla__th { background-color: var(--color-fondo); font-weight: 800; }
Responsive
css
@media (max-width: 768px) {
  .header__contenedor { flex-direction: column; align-items: flex-start; }
  .nav__list { gap: var(--espaciado-pequeno); }
  .admin__grid { grid-template-columns: 1fr; }
  .carrito__item { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 480px) {
  h1 { font-size: 1.75rem; }
  .main-wrapper { width: min(100% - (var(--espaciado-pequeno) * 2), var(--ancho-contenedor)); }
}
Reglas de estilo
Sin !important.

Variables exactas en :root.

box-sizing: border-box global.

Grid macro + repeat(auto-fit, minmax(280px, 1fr)).

Flexbox para componentes.

:hover, :focus, :active con outline visible.

BEM en componentes.

