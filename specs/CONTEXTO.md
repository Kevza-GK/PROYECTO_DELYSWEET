# CONTEXTO.md - Documento Maestro del Proyecto DelySweet

## 1. Visión General del Proyecto
DelySweet es una plataforma web para la comercialización de postres artesanales en Colombia. El sistema permite a los clientes registrarse, iniciar sesión, explorar un catálogo, gestionar un carrito de compras, realizar pedidos con pago contra entrega y hacer seguimiento. Los administradores pueden gestionar productos, inventario, promociones y ventas.

## 2. Stack Tecnológico y Reglas Inquebrantables
- **Tecnologías:** HTML5 semántico, CSS3 modular, JavaScript vanilla (ES6+).
- **Arquitectura JS:** Módulos ECMAScript (`import`/`export`). Uso estricto de **Barriles (`index.js`)** en cada carpeta para centralizar exportaciones. Los consumidores importan *solo* del barril.
- **Arquitectura de Vistas:** Uso de `views/layouts/` y `views/partials/`. Carga asíncrona con `fetch` a través de `core/partialLoader.js`.
- **CSS:** Metodología BEM (`.bloque__elemento--modificador`). Variables en `:root`. Sin `!important`. Grid para macro-layout y Flexbox para componentes.
- **Dependencias externas:** Solo Google Fonts. Sin frameworks.
- **Persistencia:** Simulada con `localStorage`.
- **Dirección de Dependencias:** `main.js` → `ui` → `domain` → `data` → `shared` → `core`.

## 3. Estructura de Carpetas y Archivos
```text
/
├── index.html, catalogo.html, producto.html, carrito.html, checkout.html, pedido.html, historial.html, login.html, registro.html, admin.html
├── css/
│   ├── main.css
│   ├── base/ (_reset.css, _variables.css, _tipografia.css)
│   ├── layouts/ (_app-layout.css, _header.css, _footer.css)
│   ├── componentes/ (_botones.css, _cards.css, _formularios.css, _tablas.css, _badges.css, _mensajes.css)
│   └── paginas/ (_inicio.css, _catalogo.css, _carrito.css, _checkout.css, _admin.css)
├── js/
│   ├── main.js (Único punto de entrada)
│   ├── core/ (index.js, dom.js, partialLoader.js)
│   ├── shared/ (index.js, errors.js, validators.js, calculator.js, formatters.js, renderEngine.js)
│   ├── data/ (index.js, storage.js, seed.js)
│   ├── domain/ (index.js, authService.js, catalogService.js, cartService.js, inventoryService.js, promotionService.js, orderService.js, reportService.js)
│   └── ui/ (index.js, navigationUI.js, authUI.js, catalogUI.js, cartUI.js, checkoutUI.js, orderUI.js, adminUI.js)
├── views/
│   ├── layouts/ (base.html)
│   └── partials/ (header.html, footer.html, messages.html, product-card.html, cart-item.html, order-row.html)
└── assets/img/
4. Sistema de Estilos (CSS)
Variables exactas en :root:

--color-primario: #d94f70, --color-secundario: #f7b267, --color-fondo: #fff8f0, --color-texto: #3d2c2e.

--fuente-principal: 'Nunito', sans-serif.

--espaciado-pequeno: 8px, --espaciado-medio: 16px, --espaciado-grande: 24px.

Reset: *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }.

Layout Macro: Uso de grid-template-areas: 'header' 'main' 'footer'.

Accesibilidad: Uso de :focus con outline: 3px solid var(--color-secundario).

5. Arquitectura de Vistas (HTML)
Las páginas HTML (ej. index.html, catalogo.html) son "shells" mínimos.

Contienen puntos de montaje como <div data-view="header"></div> y <main id="contenido">.

Los fragmentos HTML reales viven en views/partials/.

El archivo js/core/partialLoader.js se encarga de inyectar el header y footer en cada página usando fetch.

6. Lógica de JavaScript y Barriles
Cada carpeta en js/ tiene un index.js que reexporta sus módulos. Los archivos se importan mutuamente usando el barril.

Ejemplo de Barril (js/shared/index.js):

javascript
export { AppError } from './errors.js';
export { sumar, restar, multiplicar, dividir } from './calculator.js';
export { mostrarMensaje, mostrarError } from './renderEngine.js';
Reglas de los módulos:

core/dom.js: Utilidades de selección (qs, qsa, on, crear).

core/partialLoader.js: Función cargarVistasBase() y cargarParcial().

shared/calculator.js: Solo operaciones matemáticas aisladas.

shared/renderEngine.js: El ÚNICO archivo autorizado para imprimir/mostrar mensajes en el DOM (usando el contenedor #mensajes).

data/storage.js: Envoltorio para localStorage (prefijo delysweet:).

domain/*Service.js: Lógica de negocio pura. No tocan el DOM. Usan el storage y la calculadora.

ui/*UI.js: Manejan los eventos del DOM, llaman a los servicios y usan el renderEngine para mostrar resultados.

Punto de Entrada (js/main.js):

Espera el evento DOMContentLoaded.

Ejecuta cargarVistasBase() (trae header y footer).

Lee el data-page del <body>.

Llama al inicializador de UI correspondiente (ej. si es data-page="carrito", llama a inicializarCarrito()).

7. Flujos Críticos del Negocio
Carrito: El cartService calcula subtotales. No permite agregar más cantidad que el stock disponible. Usa shared/calculator.js.

Checkout: El orderService valida el stock, crea el pedido, registra la venta y descuenta el inventario. Todo o nada; si falla una validación, lanza un AppError.

Cancelación: El admin puede cancelar pedidos si no están "Entregados". Al cancelar, inventoryService restituye el stock.

8. Instrucciones para la IA (Copilot / Claude)
Genera el código respetando la estructura de árbol proporcionada.

No inventes frameworks. Usa Vanilla JS y módulos ES6.

Asegúrate de crear los archivos index.js (barriles) en core, shared, data, domain y ui.

Al escribir importaciones entre carpetas, usa la ruta al barril (ej. import { obtenerCarrito } from '../domain/index.js';).

El HTML dinámico (como las tarjetas de producto) debe crearse usando document.createElement y textContent para evitar inyecciones de código, o clonando <template> definidos en los parciales.

Aplica los estilos CSS usando las variables y la metodología BEM indicada.