// 1. Insertar un <p> con el texto "Soy el último hijo" como último hijo de #caja.

const caja = document.querySelector('#caja')

caja.insertAdjacentHTML("beforeend", "<p>Soy el último hijo</p>")


// 2. Insertar un <p> con el texto "Soy el primer hijo" como primer hijo de #caja.

caja.insertAdjacentHTML("afterbegin", "<p>Soy el primer hijo</p>")


// 3. Insertar un <h2> con el texto "Título" justo antes de #caja (como hermano, no adentro).

caja.insertAdjacentHTML("beforebegin", "<h1>Título</h1>")


// 4. Dado el array de abajo, insertar dentro de #lista un <li> por cada nombre,
//    usando insertAdjacentHTML en vez de createElement.
const personajes = ["Link", "Kirby", "Fox"];

const lista = document.querySelector('#lista')

personajes.forEach(person => {
    lista.insertAdjacentHTML("beforeend", `<li>${person}</li>`)
})