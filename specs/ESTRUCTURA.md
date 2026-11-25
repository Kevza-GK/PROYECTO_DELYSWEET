Árbol de carpetas y archivos
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
│   │   ├── _reset.css
│   │   ├── _variables.css
│   │   └── _tipografia.css
│   ├── layouts/
│   │   ├── _app-layout.css
│   │   ├── _header.css
│   │   └── _footer.css
│   ├── componentes/
│   │   ├── _botones.css
│   │   ├── _cards.css
│   │   ├── _formularios.css
│   │   ├── _tablas.css
│   │   ├── _badges.css
│   │   └── _mensajes.css
│   └── paginas/
│       ├── _inicio.css
│       ├── _catalogo.css
│       ├── _carrito.css
│       ├── _checkout.css
│       └── _admin.css
├── js/
│   ├── main.js
│   ├── core/
│   │   ├── index.js
│   │   ├── dom.js
│   │   └── partialLoader.js
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
        ├── postres/
        └── logo.svg
Reglas de arquitectura
Barriles por carpeta: cada carpeta de js/ expone un index.js que reexporta su API pública. Los consumidores importan solo desde el barril (import { ... } from '../shared/index.js').

Responsabilidad única por archivo: cada archivo expone una función o clase concreta. No hay archivos “navaja suiza”.

Dirección de dependencias: main.js → ui → domain → data → shared → core. views/ es consumido por core/partialLoader y por ui.

Un solo punto de entrada: js/main.js.

Un solo motor de presentación: shared/renderEngine.js.

Vistas HTML desacopladas: views/layouts/ y views/partials/ contienen HTML sin lógica. La lógica vive en ui/.

Sin prompt-sync: la entrada es web (formularios).

Responsabilidad de archivos
HTML (raíz)
Archivo	Responsabilidad
index.html	Shell de inicio; carga header, main y footer desde views/.
catalogo.html	Shell del catálogo.
producto.html	Shell del detalle de producto.
carrito.html	Shell del carrito.
checkout.html	Shell del checkout.
pedido.html	Shell del seguimiento.
historial.html	Shell del historial.
login.html	Shell de login.
registro.html	Shell de registro.
admin.html	Shell del panel administrativo.
Cada shell solo contiene <header>, <main>, <footer> con puntos de montaje (data-view, id) y carga js/main.js.

CSS
Archivo	Responsabilidad
css/main.css	Punto de entrada con @import.
css/base/_reset.css	Reset y box-sizing.
css/base/_variables.css	Custom properties en :root.
css/base/_tipografia.css	Tipografía base.
css/layouts/_app-layout.css	Grid macro.
css/layouts/_header.css	Header Flexbox.
css/layouts/_footer.css	Footer.
css/componentes/_botones.css	Botones BEM.
css/componentes/_cards.css	Tarjetas.
css/componentes/_formularios.css	Formularios.
css/componentes/_tablas.css	Tablas.
css/componentes/_badges.css	Badges.
css/componentes/_mensajes.css	Mensajes.
css/paginas/*.css	Estilos por página.
JavaScript
Archivo	Responsabilidad única
js/main.js	Orquestador: detecta página y llama al inicializador UI correspondiente.
js/core/index.js	Barril de core.
js/core/dom.js	Utilidades DOM (qs, qsa, on, crear).
js/core/partialLoader.js	Carga parciales HTML desde views/ vía fetch.
js/shared/index.js	Barril de shared.
js/shared/errors.js	AppError.
js/shared/validators.js	Validaciones genéricas.
js/shared/calculator.js	Operaciones matemáticas aisladas.
js/shared/formatters.js	Formato de moneda y fecha.
js/shared/renderEngine.js	Único motor de mensajes y renderizado.
js/data/index.js	Barril de data.
js/data/storage.js	Acceso a localStorage.
js/data/seed.js	Datos iniciales.
js/domain/index.js	Barril de domain.
js/domain/authService.js	Registro, login, sesión.
js/domain/catalogService.js	Consulta y gestión de productos.
js/domain/cartService.js	Carrito y subtotales.
js/domain/inventoryService.js	Stock y alertas.
js/domain/promotionService.js	Promociones y descuentos.
js/domain/orderService.js	Pedidos, ventas, cancelación.
js/domain/reportService.js	Productos más vendidos.
js/ui/index.js	Barril de ui.
js/ui/navigationUI.js	Header, sesión y navegación dinámica.
js/ui/authUI.js	Login y registro.
js/ui/catalogUI.js	Inicio y catálogo.
js/ui/cartUI.js	Carrito.
js/ui/checkoutUI.js	Checkout.
js/ui/orderUI.js	Seguimiento e historial.
js/ui/adminUI.js	Panel administrativo.
Vistas (views/)
Archivo	Responsabilidad
views/layouts/base.html	Plantilla base con header, main, footer, messages.
views/partials/header.html	Header y navegación.
views/partials/footer.html	Footer.
views/partials/messages.html	Contenedor #mensajes.
views/partials/product-card.html	Plantilla de tarjeta de producto.
views/partials/cart-item.html	Plantilla de ítem de carrito.
views/partials/order-row.html	Plantilla de fila de pedido.
Convenciones de nombrado
CSS BEM: .card, .card__title, .card--destacada, .btn--secundario.

IDs solo para formularios y puntos de montaje.

data-* para hooks JS: data-action, data-product-id, data-page, data-view.

CSS parciales inician con _.

Módulos JS en camelCase.

Vistas HTML en kebab-case.

Barriles siempre index.js.

Commits: feat:, fix:, docs:, style:, refactor:, test:.