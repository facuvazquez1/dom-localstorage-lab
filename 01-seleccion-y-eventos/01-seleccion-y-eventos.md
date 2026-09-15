# Teoría — 01: Selección de elementos y Eventos

> Repo: `dom-localstorage-lab` — módulo `01-seleccion-y-eventos/`. Corre en el navegador, no con `node`. Se verifica abriendo `index.html` y mirando la consola de DevTools (F12).

---

## 1. Seleccionar elementos

```js
document.getElementById("titulo");              // por id, sin "#"
document.querySelector(".card");                 // el PRIMER elemento que matchea el selector CSS
document.querySelectorAll(".card");               // TODOS los que matchean → NodeList
```

- `querySelector`/`querySelectorAll` aceptan cualquier selector CSS (`"#id"`, `".clase"`, `"ul > li"`, `"[data-id='3']"`).
- `querySelectorAll` devuelve un **NodeList**, no un array. Tiene `.forEach`, pero no `.map`/`.filter` directamente — si necesitás eso, convertí con `Array.from(nodeList)` o `[...nodeList]`.
- Si el selector no matchea nada: `querySelector` devuelve `null` (no un error). Acceder a una propiedad de `null` (`null.textContent`) tira `TypeError`. Este es el error más común del módulo.

---

## 2. Leer y modificar contenido

```js
elemento.textContent = "Hola";     // texto plano, seguro siempre
elemento.innerHTML = "<b>Hola</b>"; // interpreta HTML — cuidado con datos de usuario (XSS)
```

Regla: `textContent` por defecto. `innerHTML` solo cuando necesitás insertar HTML real (por ejemplo, una tarjeta armada con template strings desde datos que vos generaste, nunca texto crudo de un usuario sin sanitizar).

---

## 3. Atributos y clases

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

## 4. Crear y eliminar elementos

```js
const li = document.createElement("li");
li.textContent = "Nuevo ítem";
listaEl.appendChild(li);        // lo agrega al final
listaEl.prepend(li);            // lo agrega al principio

li.remove();                    // se elimina a sí mismo del DOM
```

Patrón típico para pintar un elemento nuevo desde datos: `createElement` + setear contenido/atributos + `appendChild`.

---

## 5. Eventos

### Cómo se arma un event listener

```js
elemento.addEventListener(tipo, callback, opciones);
```

- `tipo` (string): nombre del evento a escuchar — `"click"`, `"submit"`, `"keydown"`, etc.
- `callback` (función): la que el navegador ejecuta cuando el evento ocurre. No la llamás vos — el navegador la invoca solo y le pasa un único argumento: el objeto `event`.
- `opciones` (opcional, tercer parámetro): un objeto de configuración, por ejemplo `{ once: true }` para que el listener se dispare una sola vez y se autoelimine.

```js
boton.addEventListener("click", function (event) {
  console.log(event.target);       // el elemento exacto que disparó el evento
});
```

`event` es solo el nombre elegido para el parámetro — podría llamarse `e`, `ev`, lo que sea. Lo que importa es que es el primer (y único) parámetro que recibe la función; el navegador lo completa automáticamente, no se le pasa nada al invocar `addEventListener`. Si el callback no necesita nada del evento (por ejemplo, un simple toggle de clase), no hace falta declarar el parámetro.

### Propiedades más usadas del objeto `event`

| Propiedad/método | Para qué sirve |
|---|---|
| `event.target` | el elemento exacto donde ocurrió el evento |
| `event.type` | el nombre del evento (`"click"`, `"submit"`, ...) |
| `event.preventDefault()` | cancela el comportamiento por defecto (ej: que un `<form>` recargue la página al enviarse) |
| `event.key` | en eventos de teclado, qué tecla se apretó (`"Enter"`, `"a"`, ...) |
| `event.currentTarget` | el elemento al que le pusiste el listener (distinto de `target` en delegación) |

### Tipos de eventos más comunes

| Categoría | Eventos |
|---|---|
| Mouse | `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout` |
| Teclado | `keydown`, `keyup` |
| Formulario | `submit`, `change`, `input`, `focus`, `blur` |
| Documento/ventana | `load`, `DOMContentLoaded`, `resize`, `scroll` |

Diferencia `input` vs `change`: `input` dispara en cada tecleo/cambio inmediato; `change` recién dispara cuando el elemento pierde el foco (blur) con un valor distinto al que tenía.

### Delegación de eventos

En vez de poner un listener por cada `<li>` de una lista (que además se rompe si agregás items nuevos después), se pone **un solo listener en el contenedor padre** y se revisa `event.target` adentro:

```js
listaEl.addEventListener("click", function (event) {
  if (event.target.matches(".borrar-btn")) {
    event.target.closest("li").remove();
  }
});
```

Esto es clave para cualquier lista dinámica (agregar/eliminar items) donde los elementos hijos se crean y destruyen en tiempo de ejecución — un listener puesto directamente sobre un `<li>` que ya no existe no sirve de nada, y uno puesto sobre uno que se creó después nunca se llegó a agregar.

---

## Glosario

| Término | Significado |
|---|---|
| Nodo | Cualquier elemento del DOM (un `<div>`, un texto, etc.) |
| NodeList | Lo que devuelve `querySelectorAll` — parecido a un array pero no lo es |
| Evento | Una acción del usuario o del navegador (click, submit, load, etc.) |
| Listener | La función que queda "escuchando" un evento sobre un elemento |
| Delegación de eventos | Un listener en el padre en vez de uno por cada hijo |
| `event.target` | El elemento exacto donde ocurrió el evento |

## Checklist de errores comunes

- `querySelector` devolvió `null` porque el selector está mal escrito (falta el `#` para un id, o la `.` para una clase) o el script corre antes de que el HTML exista (falta `defer` en el `<script>` o el script no está al final del `<body>`).
- Usar `innerHTML` con datos crudos de un input sin necesidad (riesgo de XSS, y de romper el HTML si el texto trae `<` o `"`).
- Poner un listener por cada elemento de una lista que se regenera, en vez de delegar en el padre.
- Olvidar `event.preventDefault()` en un `submit` de un `<form>` (la página recarga y se pierde todo).
- Declarar el parámetro del callback como algo que no es `event` esperando que traiga otra cosa — el navegador siempre pasa el objeto evento ahí, nunca un dato propio.

