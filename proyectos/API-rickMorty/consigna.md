# Integrador final — Fase 1: Buscador de personajes con favoritos

Cierre de `dom-localstorage-lab`. Combina todo lo visto en la fase: `fetch` (de `04-apis`), estado + render, delegación de eventos, `dataset` y `localStorage`. Es el proyecto más grande hecho hasta ahora — no hay scaffolding de ejercicio suelto, se arma de punta a punta.

---

## Qué hace la app

Un input busca personajes de **Rick and Morty** contra una API pública. Los resultados se muestran en pantalla, y cada uno tiene un botón para guardarlo como favorito. Los favoritos se listan aparte y **persisten** aunque se recargue la página.

---

## API

**Rick and Morty API** — pública, sin API key, mismo tipo de `fetch` que ya usaste en `04-apis`.

```
GET https://rickandmortyapi.com/api/character/?name=NOMBRE
```

- Devuelve un objeto con la forma `{ results: [ {...}, {...} ] }` — el array de personajes está adentro de `results`, no es la respuesta directa.
- Cada personaje trae, entre otros campos: `id`, `name`, `status`, `species`, `image` (URL de la imagen).
- Si no encuentra ningún personaje con ese nombre, la API responde con status **404**. No es un error de red — es una respuesta válida que hay que manejar, no dejar que rompa.

---

## Modelo de datos

Dos arrays, con roles distintos. No los mezcles.

### `resultados`
- Lo que devolvió la última búsqueda.
- Vive solo en memoria (`let`, sin `localStorage`).
- Se pisa completo con cada búsqueda nueva.

### `favoritos`
- Los personajes guardados por el usuario.
- **Persiste** en `localStorage`.
- Arranca leyendo de ahí con el patrón `|| []` ya conocido.
- Cada objeto guardado necesita al menos `id`, `name` e `image` — lo mínimo para poder mostrarlo en la sección de favoritos sin volver a pedirlo a la API.

---

## Funcionalidad requerida

- [ ] Input de búsqueda + botón (o Enter) dispara la consulta a la API
- [ ] Mostrar los resultados: imagen, nombre, status, especie
- [ ] Cada resultado tiene un botón para agregarlo a favoritos
- [ ] Sección aparte de "Favoritos", renderizada desde su propio array
- [ ] Poder sacar un personaje de favoritos
- [ ] Los favoritos sobreviven a un reload de la página
- [ ] Si la búsqueda no encuentra nada (404), mostrar un mensaje — nunca un error roto en consola
- [ ] Limpiar el input después de buscar (opcional, a tu criterio)

### Fuera de alcance
No hace falta: paginación de resultados, buscar por otros criterios (especie, status), editar un favorito ya guardado, ni animaciones. Si sobra tiempo y querés sumar algo, mejor un loading mientras espera el fetch que features nuevas.

---

## Orden sugerido — no lo saltees

Cada paso se apoya en el anterior. Si te trabás en uno, no sigas de largo — volvé un paso atrás o abrí un archivo de aislamiento para el concepto puntual, como ya veníamos haciendo en el lab.

### 1. HTML base
Armá el esqueleto: input + botón de búsqueda, un contenedor para resultados, un contenedor para favoritos. Sin estilos todavía, solo estructura.

### 2. Fetch + mostrar resultados (sin favoritos)
Conectá el input/botón a una función que haga el `fetch`, maneje el caso de status no-ok (if/throw, como en `04-apis`), y guarde lo que llega en `resultados`. Todavía sin pensar en persistencia ni en delegación — el objetivo acá es solo confirmar que la data llega y se ve.

### 3. Render de resultados
Función que recorra `resultados` y dibuje una tarjeta por personaje (imagen, nombre, status, especie) dentro del contenedor. Mismo patrón vaciar+recorrer+insertar que ya usaste varias veces. Todavía sin botón de favorito — el objetivo es que la lista se vea bien primero.

### 4. Manejo del caso sin resultados
Antes de sumar más funcionalidad, probá buscar algo que no existe (ej. "asdasdasd") y confirmá que no rompe nada — mostrá un mensaje en el contenedor en vez de una lista vacía silenciosa.

### 5. Botón de favorito + delegación
Agregale el botón "Favorito" a cada tarjeta en el render, con el `id` del personaje como `data-id`. Un solo listener delegado en el contenedor de resultados (no uno por botón) que identifique el click, encuentre el `id`, y agregue ese personaje a `favoritos`.

### 6. Render de favoritos
Misma lógica que el render de resultados, pero apuntando al array y contenedor de favoritos. Pensá si te conviene reusar una única función de render genérica para ambos casos, o tener dos funciones separadas — cualquiera de las dos es válida, elegí la que te resulte más clara.

### 7. Sacar de favoritos
Botón "Quitar" en cada tarjeta de favoritos, delegación de eventos, `filter` sobre el array (no `splice`, mismo criterio que en `04-estado-y-render`), volver a renderizar.

### 8. Persistencia
`localStorage.setItem` con `JSON.stringify` cada vez que `favoritos` cambia (al agregar y al quitar). Confirmá recargando la página después de guardar.

### 9. Pulido final
Revisión completa contra el checklist de "Done when" de abajo. Ahí es donde metés el opcional de limpiar el input, o un loading mientras espera el fetch, si querés sumarlo.

---

## Done when

- [ ] Buscás un personaje real (ej. "Rick") y aparece en pantalla con imagen, nombre, status y especie
- [ ] Buscás algo que no existe y ves un mensaje, no un error roto en consola
- [ ] Marcás un favorito y aparece en la sección de favoritos
- [ ] Sacás un favorito y desaparece de esa sección
- [ ] Recargás la página con favoritos guardados y siguen ahí
- [ ] El listener de favoritos y el de quitar-favorito están delegados, no uno por botón

---

## Convenciones del proyecto (recordatorio)

- Corre en el navegador (Live Server), se verifica por consola F12 — no con `node`.
- Scaffolding: pistas y estructura, nunca solución completa a menos que se pida explícitamente.
- Si un paso resulta mucho más grande de lo esperado, se frena y se aísla el concepto en un archivo chico aparte antes de seguir.
- Commits en inglés, modo imperativo, uno por avance significativo (no hace falta uno por línea en un proyecto de este tamaño).
