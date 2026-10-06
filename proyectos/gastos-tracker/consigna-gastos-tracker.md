# gastos-tracker: consigna del proyecto

Proyecto de portfolio en **vanilla JS**. Es el primer proyecto grande y sin andamiaje de ejercicio: se arma de punta a punta, se despliega en Netlify y se acompaña con el primer post de LinkedIn.

Este documento está escrito para que cualquier chat nuevo (o cualquier persona) pueda retomar el trabajo sin contexto previo. Si se lo pegás a Claude al empezar un chat, tiene todo lo necesario para ayudarte.

---

## 1. Contexto

### Quién es Facu y dónde está parado

- Estudiante de la Tecnicatura en Programación (UTN Capital Federal, a distancia), segundo año.
- Objetivo: **primer trabajo como programador en ~agosto 2027**, apuntando a full stack. Stack objetivo: React, Node.js, Next.js, SQL y Docker.
- Disponibilidad: ~9 horas por semana.
- Entorno: VS Code en Windows, Live Server, consola del navegador (F12).

### Qué ya domina (no hace falta re-explicarlo desde cero)

- **JS funcional:** `map`, `filter`, `reduce`, `sort`, `forEach`, `some`, `every`, `find`.
- **Funciones:** closures, callbacks, currying, rest/spread.
- **Async:** Promises, `async/await`, `fetch`, `try/catch`, `throw`, patrón `if (!response.ok) throw`.
- **DOM:** selección, `addEventListener`, `createElement`, `insertAdjacentHTML`, `dataset`, `classList`, `textContent` vs `value`.
- **Eventos avanzados:** delegación (`target` vs `currentTarget`, `matches`, `closest`), formularios (`submit`, `preventDefault`, `FormData`, validación).
- **Patrón estado → render:** array como única fuente de verdad, función `render()` que redibuja.
- **localStorage:** `setItem`/`getItem`, `JSON.stringify`/`JSON.parse`, patrón `|| []`.
- **Proyecto previo:** buscador de personajes con favoritos (Rick and Morty API), que combinó todo lo anterior.

### Qué es nuevo en este proyecto

Cada uno de estos puntos tiene que **practicarse aislado antes** de meterlo en el proyecto (ver sección 7):

| Concepto nuevo | Dónde aparece |
|---|---|
| `<input type="date">`, `<select>`, `<input type="number">` | Formulario y filtros |
| **Estado derivado:** calcular lo que se muestra a partir de los datos, sin modificarlos | Filtros y totales |
| `reduce` que **devuelve un objeto** (agrupar por categoría) | Totales por categoría |
| Acceso dinámico a propiedades `objeto[variable]` | Totales por categoría (ya fue un bloqueo antes) |
| **Modo edición** en el mismo formulario | Editar un gasto |
| Fechas como strings y su trampa de zona horaria | Fechas |
| `Intl.NumberFormat` para formatear dinero | Mostrar montos |
| Módulos ES (`import` / `export`) | Refactor final |
| Deploy en Netlify y README de portfolio | Cierre |

### Relación con el roadmap

Este proyecto es la **Fase 2**. En la **Fase 3** se migra a React. Por eso la recomendación de arquitectura más importante es **separar la lógica de datos de la manipulación del DOM** (ver sección 5): la lógica se reutiliza tal cual en React, y lo que cambia es solo la parte que dibuja.

---

## 2. Qué hace la app

Una aplicación para registrar gastos personales: se cargan, se listan, se editan y se eliminan, se filtran por categoría y fechas, y se ve cuánto se gastó en total y por categoría. Los datos sobreviven a recargar la página.

### Funcionalidad requerida

- [ ] Agregar un gasto con un formulario (descripción, monto, categoría, fecha)
- [ ] Validación: descripción obligatoria, monto numérico mayor a 0, categoría y fecha obligatorias. Los errores **se muestran en pantalla**, no en consola
- [ ] Listar los gastos, dibujados desde el estado
- [ ] Eliminar un gasto
- [ ] Editar un gasto existente
- [ ] Filtrar por categoría y por rango de fechas (los dos filtros se combinan)
- [ ] Total de los gastos que se están viendo
- [ ] Total por categoría
- [ ] Persistencia en `localStorage`
- [ ] Estado vacío: un mensaje cuando no hay gastos, y otro distinto cuando hay gastos pero el filtro no devuelve ninguno
- [ ] Diseño responsive básico
- [ ] Deploy en Netlify
- [ ] README con captura y link a la versión online
- [ ] Primer post de LinkedIn

### Fuera de alcance

Backend, login, base de datos, múltiples monedas, gráficos, exportar a CSV, ordenamiento avanzado. Si sobra tiempo, quedan como extras para después. La migración a React es la Fase 3 y no se mezcla acá.

---

## 3. Modelo de datos

### Un gasto

```js
{
  id: 1759700000000,          // Date.now() al crear. Número único
  descripcion: "Supermercado",
  monto: 15200.5,             // NÚMERO, no string
  categoria: "comida",        // una de la lista fija
  fecha: "2026-10-05"         // string con formato YYYY-MM-DD
}
```

### Categorías (lista fija)

`comida`, `transporte`, `servicios`, `ocio`, `salud`, `otros`

Conviene definirla **una sola vez** en un array y usarla tanto para el `<select>` del formulario como para el del filtro, y para los totales.

### Estado de la app

| Variable | Qué guarda | ¿Persiste? |
|---|---|---|
| `gastos` | Todos los gastos cargados | **Sí**, en `localStorage` |
| `filtros` | `{ categoria: "todas", desde: "", hasta: "" }` | No |
| `idEnEdicion` | `id` del gasto que se está editando, o `null` | No |

**Los gastos filtrados no se guardan en ninguna variable de estado.** Se calculan en cada render a partir de `gastos` y `filtros`. Es el concepto de *estado derivado*: si guardaras la lista filtrada aparte, tendrías dos copias que se pueden desincronizar.

---

## 4. Decisiones y trampas que conviene conocer de antemano

### Las fechas son strings, no objetos `Date`

`<input type="date">` devuelve un string `"2026-10-05"`. Guardalo así.

- **Comparar fechas:** los strings en formato `YYYY-MM-DD` se comparan bien con `>=` y `<=`. No necesitás convertir nada para filtrar por rango.
- **La trampa:** `new Date("2026-10-05")` interpreta el string como **UTC**. En Argentina (UTC-3) eso muestra el día **anterior**. Evitá `new Date()` con ese string.
- **Para mostrar `05/10/2026`:** partí el string (`split("-")`) y reordená las partes.
- **Para precargar el input con la fecha de hoy:** `new Date().toLocaleDateString("en-CA")` devuelve `YYYY-MM-DD` en hora local. `toISOString()` usa UTC y después de las 21:00 te da el día siguiente.

### El monto es un número

- `FormData` y `.value` devuelven **siempre strings**. Convertí con `Number(...)` una sola vez, al leer el formulario, y guardá el número.
- Validación: `!(monto > 0)` cubre vacío, `0`, `NaN` y negativos de una sola vez.
- Para mostrarlo: `new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(monto)`. Creá el formateador **una vez** y reusalo.

### El `id` viene como string desde `dataset`

`dataset.id` es un string y `gasto.id` es un número. Convertí con `Number(...)` al leer el botón (ya lo hiciste en el proyecto anterior).

### Un solo formulario con dos modos

Para editar, **reusá el mismo formulario** en vez de armar uno nuevo:

1. Al clickear "Editar", se carga el gasto en los campos y se guarda su `id` en `idEnEdicion`.
2. El botón del formulario pasa a decir "Guardar cambios".
3. Al hacer `submit`, un `if` mira `idEnEdicion`: si es `null`, **crea**; si tiene valor, **actualiza** ese gasto.
4. Después de guardar, `idEnEdicion` vuelve a `null` y el formulario se resetea.

Es la parte conceptualmente más difícil del proyecto. Ver el paso 7.

### Delegación de eventos

Las cards se reconstruyen en cada render, así que **los listeners de "Eliminar" y "Editar" van delegados** sobre el contenedor de la lista, no uno por botón. Para distinguir qué botón se clickeó, podés usar un `data-accion="eliminar"` / `data-accion="editar"` además del `data-id`.

---

## 5. Cómo estructurar el proyecto

### Principio: lógica separada del DOM

Pensá el código en **tres cajas**, igual que en el buscador:

```
 DATOS (estado + lógica)      EVENTOS (listeners)         PANTALLA (render)
 gastos, filtros          ←── submit, click, change  ──→  renderLista, renderTotales
 filtrarGastos()
 calcularTotal()
```

La regla: **las funciones de lógica reciben datos y devuelven datos. No tocan el DOM.**

```js
// Bien: función pura, se reusa tal cual en React
function filtrarGastos(gastos, filtros) { /* devuelve un array */ }
function calcularTotal(gastos) { /* devuelve un número */ }
function totalPorCategoria(gastos) { /* devuelve un objeto */ }
```

Ventajas: se pueden probar en la consola sin abrir la página, y en la Fase 3 se copian directo a React.

### Estructura final de carpetas (después del refactor)

```
gastos-tracker/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── main.js       arranque y listeners
    ├── state.js      gastos, filtros, idEnEdicion
    ├── storage.js    cargarGastos(), guardarGastos()
    ├── logica.js     filtrarGastos(), calcularTotal(), totalPorCategoria()
    └── render.js     renderLista(), renderTotales(), mensajes
```

### Cómo llegar a esa estructura (recomendación)

**Empezá con un solo `script.js`**, ordenado por secciones con comentarios (elementos del DOM, estado, lógica, render, persistencia, eventos), como en el buscador. Los módulos (`import`/`export`) son un concepto nuevo, y mezclarlos con todo lo demás es justo lo que cuesta. El **paso 10** hace el refactor a módulos con la lógica ya funcionando.

### Estructura del HTML (sugerida)

```
header           título
section form     formulario de alta/edición + <p> para mensajes de error
section filtros  select de categoría + dos inputs de fecha + botón "Limpiar filtros"
section resumen  total general y total por categoría
section lista    contenedor de los gastos + mensaje de estado vacío
```

Cada `<input>` con su `<label>` asociado (`for` / `id`). Es una buena práctica y es lo que se espera en un proyecto de portfolio.

---

## 6. Recomendaciones de trabajo

**Sobre el código**

- `const` por defecto, `let` solo si se reasigna.
- Métodos funcionales de arrays en lugar de `for`/`while`. `reduce` antes que `for...of`.
- Spread para copiar arrays antes de mutar. Para actualizar un gasto, devolvé un array nuevo con `map`.
- Selectores con `id` para elementos únicos y `class` para elementos repetidos (las cards).
- Funciones chicas con un solo trabajo. Si una función dibuja y además calcula, separala.
- **Orden de cada cambio de datos:** cambia el estado → se dibuja → se guarda. Siempre el mismo.
- Mensajes de error en pantalla, nunca solo en consola.

**Sobre el proceso**

- **Un concepto nuevo por vez.** Si un paso mezcla demasiadas cosas, frená y aislá la pieza nueva en un archivo chico antes de seguir.
- Probá cada paso en el navegador antes de pasar al siguiente. Un `console.log` del estado después de cada cambio ahorra mucho tiempo.
- Usá DevTools (pestaña Application) para mirar `localStorage` mientras desarrollás.
- **Commits en inglés, modo imperativo, uno por avance significativo** (por ejemplo, uno por paso): `Add expense form with validation`, `Add delete expense`.
- Si algo queda guardado roto en `localStorage` durante las pruebas (como te pasó con `notas`), borrá esa clave desde Application.

**Errores recurrentes a vigilar** (aparecieron en proyectos anteriores)

- Confundir la **colección** con el **elemento**: `NodeList` y arrays vs. el elemento de una vuelta. Un `NodeList` tiene `forEach` pero no `map`/`filter`/`reduce` (usar `Array.from`).
- Olvidar el **`return`** en un callback con llaves (`filter`, `reduce`, `map`).
- Calcular algo y **no guardarlo ni usarlo** (`Array.from(...)` suelto, un `filter` sin reasignar).
- Olvidar **llamar a `render`** después de cambiar el estado.
- Selectores **sin acotar** (`'li'` en vez de `'#lista li'`).
- `.value` para inputs, `.textContent` para el resto.
- `dataset` devuelve **strings**.
- Tragarse un error en un `catch` con solo `console.log`.

---

## 7. Pasos en orden

Cada paso se apoya en el anterior. Si te trabás, no sigas de largo: volvé un paso o abrí un archivo de aislamiento para el concepto puntual.

### Paso 0: Preparación
Carpeta del proyecto, repo en Git y GitHub, `index.html` con el esqueleto de las cinco secciones, `style.css` y `script.js` vacíos, y primer commit.

### Paso 1: Estado y render con datos fijos
Declará un array `gastos` con 3 gastos escritos a mano y una función que dibuje la lista. Todavía sin formulario, sin eventos y sin persistencia. El objetivo es solo ver la lista en pantalla y definir **cómo se ve una fila**.

### Paso 2: Formulario de alta
- Mini-práctica aislada primero: leer `<select>` y `<input type="date">` con `FormData` y mostrarlos por consola.
- Después: `submit` con `preventDefault`, leer los campos, convertir el monto a número, validar y mostrar los errores **en el DOM**.
- Si pasa la validación: crear el objeto con `id: Date.now()`, agregarlo al array, dibujar y resetear el formulario.

### Paso 3: Persistencia
`guardarGastos()` y lectura al cargar con el patrón `|| []`. Llamá a la función de guardado cada vez que `gastos` cambia. Dibujá la lista al arrancar. Probá recargando.

### Paso 4: Eliminar
Botón "Eliminar" en cada fila con `data-id`, **un listener delegado** sobre el contenedor, `filter` para quitar el gasto, dibujar y guardar.

### Paso 5: Totales
- **Práctica aislada primero, en un archivo suelto y sin DOM:** con un array de gastos de ejemplo, calcular el total con `reduce`, y después un `reduce` que **devuelva un objeto** `{ comida: 3000, ocio: 1500 }`. Este es el momento de practicar `objeto[variable]`.
- Después: pasarlo al proyecto como funciones puras (`calcularTotal`, `totalPorCategoria`) y dibujar el resumen.
- Mostrar los montos con `Intl.NumberFormat`.

### Paso 6: Filtros
- **Práctica aislada primero, sin DOM:** una función `filtrarGastos(gastos, filtros)` que devuelva un array nuevo según categoría y rango de fechas. Pensá qué significa `"todas"` y qué significa un campo de fecha vacío.
- Después: conectar los inputs de filtro (evento `change`) para actualizar el objeto `filtros` y volver a dibujar.
- Dibujar siempre desde `filtrarGastos(gastos, filtros)`, nunca desde `gastos` directo.
- Los totales se calculan sobre la lista **ya filtrada**.
- Botón "Limpiar filtros".

### Paso 7: Editar
- **Práctica aislada primero:** actualizar un objeto dentro de un array **sin mutar**, con `map`, devolviendo el gasto modificado solo para el `id` buscado.
- Después, en tres tramos:
  1. Click en "Editar" (delegado) → cargar el gasto en el formulario y guardar `idEnEdicion`.
  2. Cambiar el texto del botón del formulario según el modo.
  3. En el `submit`, un `if` decide entre crear y actualizar. Al terminar, `idEnEdicion = null` y resetear.

### Paso 8: Estados vacíos y mensajes
Dos mensajes distintos: "Todavía no cargaste gastos" cuando `gastos` está vacío, y "Ningún gasto coincide con los filtros" cuando hay gastos pero el filtro no devuelve nada. Revisá también que los errores de validación desaparezcan cuando el formulario se envía bien.

### Paso 9: Estilos y responsive
Diseño limpio y legible, con foco en que se vea bien en pantalla chica. Diferenciá visualmente los estados (fila en edición, botones de peligro). No hace falta que sea sofisticado.

### Paso 10: Refactor a módulos
- **Práctica aislada primero:** un archivo chico con una función exportada y otro que la importe, para entender `export` / `import` y `<script type="module">`.
- Después: pasar el proyecto a la estructura de la sección 5, un archivo por vez, probando después de cada movimiento.
- Los módulos requieren Live Server (no andan abriendo el HTML con doble click).

### Paso 11: Deploy, README y post
- **Netlify:** sitio estático, sin build. Conectá el repo de GitHub para que cada push se despliegue solo.
- **README:** qué es la app, captura de pantalla, link a la versión online, funcionalidades, tecnologías, cómo correrla local y qué aprendiste.
- **Post de LinkedIn:** qué construiste, qué problema resolvía, qué fue lo más difícil (por ejemplo el modo edición o el estado derivado), link al deploy y al repo. Que lo escriba Facu: es su voz.

---

## 8. Done when

- [ ] Cargo un gasto válido y aparece en la lista
- [ ] Un gasto inválido (vacío, monto 0 o negativo) muestra un error en pantalla y no se guarda
- [ ] Elimino un gasto y desaparece
- [ ] Edito un gasto y los cambios se ven en la lista
- [ ] Filtro por categoría, por fechas y por ambos a la vez, y el resultado es correcto
- [ ] El total general y los totales por categoría coinciden con lo que se ve
- [ ] Recargo la página y todo sigue ahí
- [ ] Sin gastos, o con un filtro sin resultados, veo el mensaje correcto
- [ ] Se ve bien en el celular
- [ ] La lógica (filtrar y totales) está en funciones que no tocan el DOM
- [ ] Está desplegado en Netlify y el README tiene el link
- [ ] Publiqué el post de LinkedIn

---

## 9. Reglas de trabajo con Claude (para el chat nuevo)

Si usás este documento como contexto en otro chat, estas son las reglas con las que Facu trabaja:

- **Idioma:** español, con los términos técnicos en inglés como se usan en la industria (`array`, `render`, `event`, `callback`).
- **Claude no escribe la lógica ni el código importante.** Da pistas y estructura, y **no entrega la solución completa salvo que Facu la pida explícitamente**. Sí puede ayudar con cosas repetitivas o accesorias (el CSS de una card, por ejemplo).
- **Un solo paso a la vez.** No adelantar pasos ni mezclar varios conceptos en un mismo mensaje. Facu entiende cada pieza por separado, y le cuesta cuando se combinan.
- **Cuando algo es nuevo, aislarlo primero** en un ejercicio chico, sin el resto del proyecto, y después integrarlo.
- **Cuando Facu muestra su código:** decir qué está bien, señalar los errores concretos con su causa, y proponer la corrección sin reescribir todo.
- **Explicaciones claras, concisas y cortas**, sin dejar información relevante fuera. Una analogía antes del código cuando el concepto es nuevo.
- Si Facu se siente perdido, volver al **mapa de tres cajas** (datos, eventos, pantalla) y ubicar en cuál está la duda.
- **Verificar en el navegador:** pedirle que pruebe y cuente qué ve, en vez de asumir.
- Si Facu pide una explicación de por qué algo funciona, darla con el mecanismo completo, no solo el "cómo".

---

## 10. Estimación

| Pasos | Horas aprox. |
|---|---|
| 0-3 (base, alta y persistencia) | 10-12 h |
| 4-5 (eliminar y totales) | 8-10 h |
| 6 (filtros) | 8-10 h |
| 7 (editar) | 8-10 h |
| 8-9 (mensajes y estilos) | 6-8 h |
| 10 (módulos) | 4-6 h |
| 11 (deploy, README y post) | 4-6 h |
| **Total** | **~48-62 h, unas 5-7 semanas a 9 h/semana** |

Es una estimación: el modo edición y el estado derivado son los tramos que suelen llevar más tiempo del previsto, y está bien que así sea.

---

## 11. Después de este proyecto

- **Wordle**, como proyecto chico de lógica pura (opcional, antes de React).
- **Fase 3: React.** Se migra `gastos-tracker` a componentes y se arma `kpi-dashboard-react`. Las funciones de `logica.js` se reutilizan casi sin cambios.
