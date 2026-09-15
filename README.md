# Teoría — DOM, eventos y localStorage

> Repo: `dom-localstorage-lab`. Corre en el navegador, no con `node`. Se verifica abriendo el `.html` y mirando la consola de DevTools (F12).

---

## 1. Qué es el DOM

El DOM (Document Object Model) es la representación en memoria del HTML que el navegador arma cuando carga una página. JavaScript no edita el archivo `.html` — edita esa representación en memoria, y el navegador repinta la pantalla en base a eso.

`document` es el objeto raíz desde el que se accede a todo el DOM.

---

## 2. Seleccionar elementos

```js
document.getElementById("titulo");              // por id, sin "#"
document.querySelector(".card");                 // el PRIMER elemento que matchea el selector CSS
document.querySelectorAll(".card");               // TODOS los que matchean → NodeList
```

- `querySelector`/`querySelectorAll` aceptan cualquier selector CSS (`"#id"`, `".clase"`, `"ul > li"`, `"[data-id='3']"`).
- `querySelectorAll` devuelve un **NodeList**, no un array. Tiene `.forEach`, pero no `.map`/`.filter` directamente — si necesitás eso, convertí con `Array.from(nodeList)` o `[...nodeList]`.
- Si el selector no matchea nada: `querySelector` devuelve `null` (no un error). Acceder a una propiedad de `null` (`null.textContent`) tira `TypeError`. Este es el error más común del módulo.

---

## 3. Leer y modificar contenido

```js
elemento.textContent = "Hola";     // texto plano, seguro siempre
elemento.innerHTML = "<b>Hola</b>"; // interpreta HTML — cuidado con datos de usuario (XSS)
```

Regla: `textContent` por defecto. `innerHTML` solo cuando necesitás insertar HTML real (por ejemplo, una tarjeta armada con template strings desde datos que vos generaste, nunca texto crudo de un usuario sin sanitizar).

---

## 4. Atributos y clases

```js
elemento.getAttribute("data-id");
elemento.setAttribute("data-id", "5");

elemento.classList.add("activo");
elemento.classList.remove("activo");
elemento.classList.toggle("activo");     // saca si está, pone si no está
elemento.classList.contains("activo");   // boolean
```

`classList` es casi siempre mejor que tocar `elemento.className` directamente (que pisa todas las clases de una).

---

## 5. Crear y eliminar elementos

```js
const li = document.createElement("li");
li.textContent = "Nuevo ítem";
listaEl.appendChild(li);        // lo agrega al final
listaEl.prepend(li);            // lo agrega al principio

li.remove();                    // se elimina a sí mismo del DOM
```

Patrón típico para pintar una lista desde un array de datos: `createElement` + setear contenido/atributos + `appendChild`, repetido por cada item (con `forEach` o `map` + `join("")` si armás el HTML como string).

---

## 6. Eventos

```js
boton.addEventListener("click", function (event) {
  console.log(event.target);       // el elemento exacto que disparó el evento
});
```

- El callback recibe un objeto `event` con info del evento (`event.target`, `event.key` en teclado, `event.preventDefault()` para forms, etc.).
- `event.target` ≠ el elemento al que le pusiste el listener necesariamente — es el elemento donde ocurrió el evento realmente (importante en delegación).

### Delegación de eventos

En vez de poner un listener por cada `<li>` de una lista (que además se rompe si agregás items nuevos después), se pone **un solo listener en el contenedor padre** y se revisa `event.target` adentro:

```js
listaEl.addEventListener("click", function (event) {
  if (event.target.matches(".borrar-btn")) {
    event.target.closest("li").remove();
  }
});
```

Esto es clave para cualquier lista dinámica (agregar/eliminar gastos, tareas, etc.) — vas a usarlo en `gastos-tracker`.

---

## 7. localStorage

Guarda datos como **strings**, en el navegador, persisten entre recargas de página (no entre navegadores/dispositivos distintos).

```js
localStorage.setItem("clave", "valor");      // guarda un string
localStorage.getItem("clave");               // lee (string o null si no existe)
localStorage.removeItem("clave");
localStorage.clear();                        // borra todo
```

Para guardar objetos o arrays hay que serializar/deserializar manualmente:

```js
localStorage.setItem("gastos", JSON.stringify(arrayDeGastos));
const gastos = JSON.parse(localStorage.getItem("gastos")) ?? [];
```

Errores comunes:
- Guardar un objeto sin `JSON.stringify` → se guarda como `"[object Object]"`, literal.
- Leer con `JSON.parse` cuando la clave no existe → `JSON.parse(null)` devuelve `null` (no rompe), pero si asumís que siempre hay datos y no chequeás, el siguiente `.map()` sobre `null` sí rompe. Usar `?? []` como fallback.

---

## 8. Patrón de estados de UI (cargando / error / vacío)

Esto es lo que conecta DOM con todo lo de `04-apis/` — es el criterio de salida de la Fase 1.

Estructura típica de cualquier fetch pintado en pantalla:

```js
async function cargarDatos() {
  mostrarEstado("cargando");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error ${response.status}`);

    const datos = await response.json();

    if (datos.length === 0) {
      mostrarEstado("vacio");
      return;
    }

    pintarResultados(datos);
    mostrarEstado("listo");
  } catch (error) {
    mostrarEstado("error", error.message);
  }
}
```

Tres estados como mínimo: **cargando** (mientras espera la respuesta), **error** (si `fetch` falla o `response.ok` es `false`), **vacío** (la petición fue exitosa pero no hay resultados que mostrar). Un cuarto estado implícito es el normal ("listo", resultados pintados).

---

## Glosario

| Término | Significado |
|---|---|
| DOM | Representación en memoria del HTML, editable con JS |
| Nodo | Cualquier elemento del DOM (un `<div>`, un texto, etc.) |
| NodeList | Lo que devuelve `querySelectorAll` — parecido a un array pero no lo es |
| Evento | Una acción del usuario o del navegador (click, submit, load, etc.) |
| Delegación de eventos | Un listener en el padre en vez de uno por cada hijo |
| `event.target` | El elemento exacto donde ocurrió el evento |
| localStorage | Almacenamiento persistente del navegador, solo strings |

## Checklist de errores comunes

- `querySelector` devolvió `null` porque el selector está mal escrito o el script corre antes de que el HTML exista (falta `defer` en el `<script>` o el script no está al final del `<body>`).
- Usar `innerHTML` con datos crudos de un input sin necesidad (riesgo de XSS, y de romper el HTML si el texto trae `<` o `"`).
- Poner un listener por cada elemento de una lista que se regenera, en vez de delegar en el padre.
- Guardar en `localStorage` sin `JSON.stringify`, o leer sin `JSON.parse`.
- No manejar el estado de "vacío": la request funciona pero la pantalla queda en blanco sin explicación.
- Olvidar `event.preventDefault()` en un `submit` de un `<form>` (la página recarga y se pierde todo).