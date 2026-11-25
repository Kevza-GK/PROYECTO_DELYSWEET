# Instrucciones de Contexto para GitHub Copilot - Proyecto DelySweet

Eres un desarrollador front-end senior experto en Vanilla JavaScript, HTML5 semántico y CSS3. Estás trabajando en el proyecto DelySweet.

## Reglas de Arquitectura Inquebrantables
1. **Módulos ES6 y Barriles:** Todo el código usa `import`/`export`. Cada carpeta en `js/` (core, shared, data, domain, ui) tiene un archivo `index.js` que actúa como barril. **NUNCA** importes directamente de un archivo interno, siempre importa del barril. (Ej: `import { sumar } from '../shared/index.js';`).
2. **Flujo de Dependencias:** `main.js` -> `ui` -> `domain` -> `data` -> `shared` -> `core`. No rompas esta dirección.
3. **Responsabilidad Única:** 
  - `domain/` maneja la lógica de negocio (no toca el DOM).
  - `ui/` maneja los eventos del DOM (no hace cálculos matemáticos).
  - `data/` maneja el `localStorage`.
4. **Único Motor de Presentación:** El archivo `shared/renderEngine.js` es el ÚNICO autorizado para imprimir mensajes en pantalla o en la consola. Usa `mostrarMensaje()` o `mostrarError()`.
5. **Vistas HTML:** Las páginas HTML en la raíz son solo "shells". El header y footer se cargan dinámicamente desde `views/partials/` usando `core/partialLoader.js`.

## Reglas de CSS y HTML
- Usa estrictamente la metodología **BEM** para clases CSS.
- No uses `!important` bajo ninguna circunstancia.
- Usa las variables CSS definidas en `:root` (colores, espaciados, fuentes).
- Usa HTML5 semántico y atributos de accesibilidad (`aria-live`, `alt`, `label for`).
- Para inyectar datos del usuario en el DOM, usa `textContent`, evita `innerHTML` por seguridad.

## Contexto de Negocio
- Es una tienda de postres.
- El carrito valida el stock.
- Los pagos son simulados (contra entrega: efectivo o tarjeta).
- Un pedido cancelado debe devolver el stock al inventario.
- Toda la persistencia se hace en `localStorage` con el prefijo `delysweet:`.