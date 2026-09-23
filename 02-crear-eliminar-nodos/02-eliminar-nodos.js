// 1. Eliminar el <li> con id "item-1" usando remove().

const itemUno = document.querySelector('#item-1')
itemUno.remove()


// 2. Eliminar el último <li> que quede en #lista, sin usar su id.
//    (Pista: querySelectorAll devuelve algo que podés indexar.)

const itemUltimo = document.querySelector('li:last-child')
itemUltimo.remove()

// 3. Vaciar #caja por completo, dejando el div en su lugar.

const cajaVacia = document.querySelector('#caja')
cajaVacia.innerHTML = ""


// 4. Volver a llenar #lista con los nombres del array, y después eliminar
//    solamente los que empiecen con "M".

const equipo = ["Mario", "Zelda", "Metroid", "Kirby"];

const lista = document.querySelector('#lista')

equipo.forEach(nombres => {
    lista.insertAdjacentHTML("beforeend", `<li>${nombres}</li>`)
    
})



