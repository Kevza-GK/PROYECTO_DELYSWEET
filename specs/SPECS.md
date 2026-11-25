SPECS.md
Especificación funcional y no funcional de DelySweet
1. Requisitos funcionales
Código	Requerimiento funcional	Criterio de aceptación
RF-01	Registro de usuarios clientes	Solicita nombre, dirección, teléfono, correo y contraseña; no permite correos duplicados; guarda en localStorage.
RF-02	Inicio de sesión seguro	Valida correo y contraseña; muestra error si no coinciden; acceso según rol.
RF-03	Catálogo digital de productos	Muestra nombre, precio, imagen y disponibilidad; permite ver detalle.
RF-04	Carrito de compras	Agrega productos con stock, modifica cantidades, quita productos y calcula subtotal.
RF-05	Modificar o eliminar productos del carrito	Cambia cantidades o elimina ítems; recalcula subtotal.
RF-06	Procesar pedidos	Confirma pedido, lo registra y cambia estado a “Pedido confirmado”.
RF-07	Pagos contra entrega	Permite efectivo o tarjeta contra entrega; registra el método.
RF-08	Registrar ventas automáticamente	Cada pedido confirmado genera venta con cliente, productos y fecha.
RF-09	Actualizar inventario automáticamente	Descuenta stock tras confirmar pedido; alerta stock bajo.
RF-10	Gestionar productos	Administrador agrega, edita y elimina productos.
RF-11	Gestionar promociones y descuentos	Crea promociones con fechas; aplica descuentos cuando corresponda.
RF-12	Seguimiento de pedidos	Muestra estado: preparación, en camino, entregado; solo administrador actualiza.
RF-13	Historial de compras	Cliente ve pedidos anteriores; consulta por fecha.
RF-14	Productos más vendidos	Ranking calculado con ventas reales registradas.
RF-15	Notificaciones de pedido	Confirmación al cliente y administrador; notifica cambios.
RF-16	Gestión de inventario	Registra existencias, actualiza cantidades y alerta stock bajo.
RF-17	Panel administrativo privado	Acceso exclusivo para administrador autenticado.
2. Requisitos no funcionales
Código	Requerimiento no funcional
RNF-01	Proteger datos personales de clientes.
RNF-02	Navegación segura mediante HTTPS en despliegue real.
RNF-03	Alta disponibilidad 24/7 en producción.
RNF-04	Compatibilidad con móviles y computadores.
RNF-05	Interfaz intuitiva y fácil de usar.
RNF-06	Copias de seguridad periódicas en producción.
RNF-07	Protección contra accesos no autorizados.
RNF-08	Soporte para múltiples usuarios simultáneos en producción.
RNF-09	Escalabilidad para nuevas funciones.
RNF-10	Mantenimiento sin afectar gravemente el servicio.
RNF-11	Cumplimiento de normativas de protección de datos.
RNF-12	Actualizaciones de seguridad.
RNF-13	Confiabilidad y minimización de errores en pedidos.
RNF-14	Arquitectura basada en base de datos SQL en backend real.
RNF-15	Integración correcta con servidor y hosting.
RNF-16	Coherencia entre inventario y ventas.
3. Comportamiento esperado por sección
Inicio
Propuesta de valor, productos destacados y llamada a la acción.

Enlaces a catálogo, carrito, login y registro.

Hero con imagen de fondo (cover, center).

Catálogo
Lista productos en tarjetas con imagen (alt), nombre, precio y botón “Agregar”.

Sin stock: botón deshabilitado y badge “Agotado”.

Detalle de producto
Imagen, nombre, descripción, precio, disponibilidad y selector de cantidad.

Valida cantidad contra stock.

Carrito
Lista ítems, cantidades, precio unitario y subtotal.

Modifica cantidades y elimina ítems.

Calcula subtotal con la calculadora compartida.

Aplica promociones activas.

Mensaje si el carrito está vacío.

Checkout
Solicita dirección, teléfono y método de pago.

Valida campos obligatorios.

Al confirmar: crea pedido, registra venta, descuenta inventario.

Si falta stock: impide confirmar y muestra error.

Seguimiento
Cliente consulta estado; administrador lo actualiza.

Cambios reflejados en la vista.

Historial
Lista pedidos del cliente autenticado.

Consulta por fecha.

Solo el propietario ve su historial.

Administración
Requiere rol administrador.

Gestiona productos, inventario, pedidos, promociones y reportes.

Formulario de producto con accept="image/*".

No elimina productos con pedidos activos sin confirmación.

4. Casos de uso con excepciones
Cancelar pedido y restituir inventario
Administrador abre pedido “Pedido confirmado” o “En preparación”.

Selecciona “Cancelar pedido”.

El sistema solicita confirmación.

Si confirma: estado “Cancelado”.

Restituye cantidades al inventario.

Registra novedad y muestra mensaje.

Excepciones:

Pedido “Entregado”: no se cancela.

Pedido “Cancelado”: no se vuelve a restituir inventario.

Producto inexistente: se registra incidencia y no se altera stock.

5. Notas y decisiones
Arquitectura limpia por capas con barriles: cada carpeta expone un index.js; los consumidores importan solo del barril. Esto reduce acoplamiento y facilita refactorizar internos.

Vistas HTML: views/layouts/ y views/partials/; se cargan con partialLoader desde core usando fetch (requiere servidor local).

Guías PDF no disponibles como texto completo: se aplican los detalles del prompt: HTML5 semántico, accesibilidad, BEM, variables CSS exactas, espaciados 8/16/24 px, sin !important, Flexbox para componentes, Grid para macro-arquitectura, pseudoclases y pseudoelementos.

Pagos reales: simulados y registrados localmente.

Autenticación: simulada con localStorage; no es seguridad de producción.

Notificaciones: simuladas en interfaz.

prompt-sync: no aplica al navegador.

Documentos 00-06 de calculadora salarial: fuera de alcance; solo se adopta el estándar ECMAScript.

Prioridad de guías: ante contradicción, se priorizan las guías y se refleja aquí.