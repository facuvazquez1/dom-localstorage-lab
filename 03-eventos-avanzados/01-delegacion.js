// 1. Ponerle un único click listener a #lista. Al hacer click en cualquier
//    parte (incluso el <ul> vacío, fuera de los <li>), mostrar por consola
//    event.target y event.currentTarget por separado.

const list = document.querySelector('#lista')

// list.addEventListener('click', (event) => {
//     console.log(event.target)
//     console.log(event.currentTarget)
// })


// 2. Modificar el listener anterior: cuando se clickea un <li>, mostrar por
//    consola su data-id. Cuando se clickea el <ul> pero fuera de un <li>,
//    no mostrar nada.

// list.addEventListener('click', (event) => {
//     if (event.target.matches('li')) {
//         console.log(event.target.dataset.id)
//     } 
    
// })



// 3. Usando el mismo listener delegado, hacer que al clickear un <li> se le
//    alterne la clase "completado" (agregá el CSS que necesites para verlo).

// list.addEventListener('click', (event) => {
//     if (event.target.matches('li')) {
//         console.log(event.target.classList.toggle('completado'))
//     } 
    
// })





// 4. Agregar un botón #agregar fuera de la lista. Al clickearlo, insertar un
//    nuevo <li> con un data-id incremental. Verificar que el listener
//    delegado también funciona sobre este <li> nuevo, sin tocar el
//    addEventListener de nuevo.

const btn = document.querySelector('#agregar')
let siguienteId = 4

btn.addEventListener('click', () => {
    list.insertAdjacentHTML("beforeend", `<li data-id="${siguienteId}">Nuevo elemento</li>`)
    siguienteId++
})


