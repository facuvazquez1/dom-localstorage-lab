// 1. Dado el array de strings, escribir una función render() que borre #lista y la vuelva a dibujar completa a partir del array. Llamarla una vez al final del archivo.

let frutas = ["Manzana", "Banana", "Pera"]
const lista = document.querySelector('#lista')

function render() {
    lista.innerHTML = ""
    frutas.forEach(fruta => {
        lista.insertAdjacentHTML("beforeend", `<li>${fruta}</li>`)
    })
}


// 2. Al clickear #agregar, hacer push() de un nuevo string al array "frutas" y volver a llamar render(). Verificar que el DOM se actualiza sin que hayas tocado insertAdjacentHTML fuera de render().

const btnAdd = document.querySelector('#agregar')

btnAdd.addEventListener('click', () => {
    frutas.push("fruta" + frutas.length)
    render()
})


// 3. Ahora el array tiene objetos, no strings. Adaptar render() para mostrar el nombre de cada uno, y agregar un botón "Eliminar" dentro de cada <li> que saque ese objeto del array (con filter, no splice)  y vuelva a renderizar. Usar delegación de eventos para el click de "Eliminar", no un listener por botón.

let personajes = [
  { id: 1, nombre: "Zelda" },
  { id: 2, nombre: "Mario" },
  { id: 3, nombre: "Samus" }
]

const listaPersonajes = document.querySelector('#lista-personajes')

function renderPersonajes() {
    listaPersonajes.innerHTML = ""
    personajes.forEach(pj => {
        listaPersonajes.insertAdjacentHTML("beforeend", `<li data-id="${pj.id}">${pj.nombre} <button>Eliminar</button></li>`)
    })
}

listaPersonajes.addEventListener('click', (evento) => {
    if (evento.target.matches('button')) {
        const li = evento.target.closest('li')
        const idAEliminar = Number(li.dataset.id)

        personajes = personajes.filter(pj => pj.id !== idAEliminar)
        renderPersonajes()
    }
})

renderPersonajes()

render()


