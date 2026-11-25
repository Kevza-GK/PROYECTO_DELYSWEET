DelySweet: Plataforma digital de comercialización de postres
DelySweet es una plataforma web para la venta de postres artesanales en Colombia. Busca mejorar la visibilidad del emprendimiento, optimizar el proceso de compra y ofrecer una experiencia digital ágil, segura e intuitiva para clientes y administradores.

Este documento define la documentación base para implementar el front-end con HTML5, CSS3 y JavaScript vanilla, con módulos ECMAScript, arquitectura limpia por capas con barriles de importación y estructura de vistas HTML (views/ con layouts y parciales). Sin frameworks ni librerías externas, salvo Google Fonts. Persistencia simulada con localStorage.

Objetivos
Comercializar postres artesanales mediante un catálogo digital.

Permitir registro, inicio de sesión, carrito, checkout, seguimiento e historial.

Simular pagos contra entrega en efectivo o tarjeta.

Permitir la gestión administrativa de productos, inventario, promociones y pedidos.

Aplicar accesibilidad, semántica HTML, CSS modular con BEM, Flexbox y Grid.

Aplicar arquitectura limpia con módulos ECMAScript, barriles y responsabilidad única.

Organizar la interfaz con vistas HTML parciales reutilizables.

Alcance
Incluye:

Páginas públicas: inicio, catálogo, detalle de producto, carrito, checkout, seguimiento, historial, login y registro.

Panel administrativo privado simulado.

Persistencia local con localStorage.

Simulación de notificaciones en interfaz.

Validaciones y manejo de errores.

Cancelación de pedido con restitución de inventario.

Vistas HTML parciales (views/partials/) y layout base (views/layouts/).

Barriles (index.js) por capa para centralizar exportaciones.

No incluye:

Backend real, base de datos SQL, pasarela de pagos real, correos reales ni autenticación segura de producción.

Logística externa.

Stack
HTML5 semántico.

CSS3 modular con @import, custom properties, BEM, Flexbox y Grid.

JavaScript vanilla con módulos ECMAScript (import/export).

Google Fonts como única dependencia externa.

localStorage para simulación.

Arquitectura en una línea
core (infraestructura) → shared (utilidades) → data (persistencia) → domain (negocio) → ui (interacción) → views (HTML) → main.js (orquestador). Todos los consumidores importan solo desde barriles (index.js), nunca desde archivos internos.

Cómo ejecutarlo localmente
Debido al uso de módulos ECMAScript y fetch para cargar parciales HTML, no abras los archivos con file://. Usa un servidor local:

bash
python -m http.server 8080
Luego abre:

text
http://localhost:8080
Estructura general
text
/
├── index.html
├── catalogo.html
├── producto.html
├── carrito.html
├── checkout.html
├── pedido.html
├── historial.html
├── login.html
├── registro.html
├── admin.html
├── css/
│   ├── main.css
│   ├── base/
│   ├── componentes/
│   ├── layouts/
│   └── paginas/
├── js/
│   ├── main.js
│   ├── core/
│   │   ├── index.js
│   │   └── dom.js
│   ├── shared/
│   │   ├── index.js
│   │   ├── errors.js
│   │   ├── validators.js
│   │   ├── calculator.js
│   │   ├── formatters.js
│   │   └── renderEngine.js
│   ├── data/
│   │   ├── index.js
│   │   ├── storage.js
│   │   └── seed.js
│   ├── domain/
│   │   ├── index.js
│   │   ├── authService.js
│   │   ├── catalogService.js
│   │   ├── cartService.js
│   │   ├── inventoryService.js
│   │   ├── promotionService.js
│   │   ├── orderService.js
│   │   └── reportService.js
│   └── ui/
│       ├── index.js
│       ├── authUI.js
│       ├── catalogUI.js
│       ├── cartUI.js
│       ├── checkoutUI.js
│       ├── orderUI.js
│       ├── adminUI.js
│       └── navigationUI.js
├── views/
│   ├── layouts/
│   │   └── base.html
│   └── partials/
│       ├── header.html
│       ├── footer.html
│       ├── messages.html
│       ├── product-card.html
│       ├── cart-item.html
│       └── order-row.html
└── assets/
    └── img/
Convenciones
Nomenclatura CSS BEM: .card, .card__title, .card--destacada, .btn--secundario.

Commits con Conventional Commits: feat:, fix:, docs:, style:, refactor:, test:.

Sin !important.

Barriles (index.js) por carpeta; consumidores importan solo del barril.

Cada archivo expone una sola responsabilidad (función/clase concreta).

Vistas HTML parciales cargadas con partialLoader desde core.

Un único motor de presentación (renderEngine) centraliza mensajes y renderizado.

textContent para datos de usuario; evitar innerHTML con contenido no confiable.

Supuestos
Las guías PDF se aplican según los detalles descritos en el prompt.

Pagos simulados en front-end.

Autenticación y rol administrador demostrativos.

Notificaciones en interfaz y localStorage.

Los parciales HTML se cargan con fetch (requiere servidor local).