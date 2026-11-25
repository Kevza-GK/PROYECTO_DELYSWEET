Estructura semántica y código base con vistas
Todas las páginas comparten:

<!DOCTYPE html>

<html lang="es">

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

Shell mínimo con <header data-view="header">, <main id="contenido">, <footer data-view="footer"> y <div id="mensajes">.

Carga de js/main.js con type="module".

Los parciales se inyectan con partialLoader desde core.

views/layouts/base.html
html
<div class="app-layout">
  <div data-view="header"></div>
  <main id="contenido" class="main-wrapper" data-view="main"></main>
  <div data-view="footer"></div>
  <div id="mensajes" class="mensajes" aria-live="assertive" aria-atomic="true"></div>
</div>
views/partials/header.html
html
<header class="header">
  <div class="header__contenedor">
    <a class="header__logo" href="index.html" aria-label="DelySweet, ir al inicio">
      <img src="assets/img/logo.svg" alt="Logotipo de DelySweet" width="160" height="48">
    </a>

    <nav class="nav" aria-label="Navegación principal">
      <ul class="nav__list">
        <li class="nav__item"><a class="nav__link" href="catalogo.html">Catálogo</a></li>
        <li class="nav__item"><a class="nav__link" href="carrito.html">Carrito</a></li>
        <li class="nav__item"><a class="nav__link" href="historial.html">Historial</a></li>
        <li class="nav__item"><a class="nav__link" href="login.html">Ingresar</a></li>
        <li class="nav__item"><a class="nav__link nav__link--cta" href="registro.html">Registrarse</a></li>
      </ul>
    </nav>
  </div>
</header>
views/partials/footer.html
html
<footer class="footer">
  <p class="footer__texto">© 2026 DelySweet. Postres artesanales en Colombia.</p>
</footer>
views/partials/messages.html
html
<div id="mensajes" class="mensajes" aria-live="assertive" aria-atomic="true"></div>
views/partials/product-card.html
html
<template id="tpl-product-card">
  <article class="card" data-product-id="">
    <img class="card__imagen" src="" alt="" width="320" height="200">
    <div class="card__contenido">
      <h3 class="card__title"></h3>
      <p class="card__precio"></p>
      <span class="badge" data-role="stock"></span>
      <div class="card__acciones">
        <a class="btn btn--secundario" href="producto.html?id=">Ver detalle</a>
        <button class="btn btn--primario" type="button" data-action="agregar-carrito">Agregar</button>
      </div>
    </div>
  </article>
</template>
index.html (shell)
html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="DelySweet, postres artesanales con compra en línea.">
  <title>DelySweet | Postres artesanales</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body data-page="inicio">
  <a class="skip-link" href="#contenido">Saltar al contenido principal</a>

  <div data-view="header"></div>

  <main id="contenido" class="main-wrapper">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__contenido">
        <h1 id="hero-title" class="hero__title">Postres artesanales a tu puerta</h1>
        <p class="hero__texto">Disfruta sabores frescos, pedidos en línea y pago contra entrega.</p>
        <a class="btn btn--primario" href="catalogo.html">Ver catálogo</a>
      </div>
    </section>

    <section class="seccion" aria-labelledby="destacados-title">
      <h2 id="destacados-title" class="seccion__title">Productos destacados</h2>
      <div id="productos-destacados" class="cards-grid" aria-live="polite"></div>
    </section>
  </main>

  <div data-view="footer"></div>

  <div id="mensajes" class="mensajes" aria-live="assertive" aria-atomic="true"></div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
catalogo.html (shell)
html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DelySweet | Catálogo</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body data-page="catalogo">
  <a class="skip-link" href="#contenido">Saltar al contenido principal</a>
  <div data-view="header"></div>
  <main id="contenido" class="main-wrapper">
    <section class="seccion" aria-labelledby="catalogo-title">
      <h1 id="catalogo-title" class="seccion__title">Catálogo de postres</h1>
      <p class="seccion__texto">Selecciona tus postres favoritos y agrégalos al carrito.</p>
      <div id="catalogo-productos" class="cards-grid" aria-live="polite"></div>
    </section>
  </main>
  <div data-view="footer"></div>
  <div id="mensajes" class="mensajes" aria-live="assertive" aria-atomic="true"></div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
carrito.html (shell)
html
<main id="contenido" class="main-wrapper" data-page="carrito">
  <section class="seccion" aria-labelledby="carrito-title">
    <h1 id="carrito-title" class="seccion__title">Carrito de compras</h1>
    <div id="carrito-lista" class="carrito" aria-live="polite"></div>
    <aside class="carrito__resumen" aria-labelledby="resumen-title">
      <h2 id="resumen-title" class="carrito__resumen-title">Resumen</h2>
      <p class="carrito__linea">Subtotal: <span id="carrito-subtotal">$0</span></p>
      <p class="carrito__linea">Descuento: <span id="carrito-descuento">$0</span></p>
      <p class="carrito__linea carrito__linea--total">Total: <span id="carrito-total">$0</span></p>
      <a class="btn btn--primario" href="checkout.html">Continuar al pago</a>
    </aside>
  </section>
</main>
checkout.html (shell)
html
<main id="contenido" class="main-wrapper" data-page="checkout">
  <section class="seccion" aria-labelledby="checkout-title">
    <h1 id="checkout-title" class="seccion__title">Finalizar pedido</h1>
    <form id="form-checkout" class="formulario" novalidate>
      <fieldset class="formulario__fieldset">
        <legend class="formulario__legend">Datos de entrega</legend>
        <div class="formulario__grupo">
          <label class="formulario__label" for="checkout-direccion">Dirección</label>
          <input class="formulario__input" id="checkout-direccion" name="direccion" type="text" required autocomplete="street-address">
        </div>
        <div class="formulario__grupo">
          <label class="formulario__label" for="checkout-telefono">Teléfono</label>
          <input class="formulario__input" id="checkout-telefono" name="telefono" type="tel" required autocomplete="tel">
        </div>
      </fieldset>
      <fieldset class="formulario__fieldset">
        <legend class="formulario__legend">Método de pago contra entrega</legend>
        <div class="formulario__grupo formulario__grupo--radio">
          <input id="pago-efectivo" name="metodoPago" type="radio" value="efectivo" required>
          <label class="formulario__label" for="pago-efectivo">Efectivo contra entrega</label>
        </div>
        <div class="formulario__grupo formulario__grupo--radio">
          <input id="pago-tarjeta" name="metodoPago" type="radio" value="tarjeta" required>
          <label class="formulario__label" for="pago-tarjeta">Tarjeta contra entrega</label>
        </div>
      </fieldset>
      <button class="btn btn--primario" type="submit">Confirmar pedido</button>
    </form>
  </section>
</main>
Formulario de registro
html
<form id="form-registro" class="formulario" novalidate>
  <fieldset class="formulario__fieldset">
    <legend class="formulario__legend">Datos del cliente</legend>
    <div class="formulario__grupo">
      <label class="formulario__label" for="nombre">Nombre completo</label>
      <input class="formulario__input" id="nombre" name="nombre" type="text" required autocomplete="name">
    </div>
    <div class="formulario__grupo">
      <label class="formulario__label" for="direccion">Dirección</label>
      <input class="formulario__input" id="direccion" name="direccion" type="text" required autocomplete="street-address">
    </div>
    <div class="formulario__grupo">
      <label class="formulario__label" for="telefono">Teléfono</label>
      <input class="formulario__input" id="telefono" name="telefono" type="tel" required autocomplete="tel">
    </div>
    <div class="formulario__grupo">
      <label class="formulario__label" for="correo">Correo electrónico</label>
      <input class="formulario__input" id="correo" name="correo" type="email" required autocomplete="email">
    </div>
    <div class="formulario__grupo">
      <label class="formulario__label" for="password">Contraseña</label>
      <input class="formulario__input" id="password" name="password" type="password" required minlength="8" autocomplete="new-password">
    </div>
    <button class="btn btn--primario" type="submit">Crear cuenta</button>
  </fieldset>
</form>
Formulario de login
html
<form id="form-login" class="formulario" novalidate>
  <fieldset class="formulario__fieldset">
    <legend class="formulario__legend">Iniciar sesión</legend>
    <div class="formulario__grupo">
      <label class="formulario__label" for="login-correo">Correo electrónico</label>
      <input class="formulario__input" id="login-correo" name="correo" type="email" required autocomplete="email">
    </div>
    <div class="formulario__grupo">
      <label class="formulario__label" for="login-password">Contraseña</label>
      <input class="formulario__input" id="login-password" name="password" type="password" required autocomplete="current-password">
    </div>
    <button class="btn btn--primario" type="submit">Ingresar</button>
  </fieldset>
</form>
Accesibilidad
input con <label for>.

fieldset/legend en formularios.

required en campos obligatorios.

alt en imágenes.

aria-live en mensajes.

outline visible en :focus.

aria-label en navegación.