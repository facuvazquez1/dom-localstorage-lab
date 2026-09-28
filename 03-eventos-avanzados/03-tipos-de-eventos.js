// 1. Al apretar cualquier tecla dentro de #nombre, mostrar por consola cuál fue (event.key).

const input = document.querySelector('#nombre')

input.addEventListener('keydown', (event) => {
    console.log(event.key)
})

// 2. Mientras se escribe en #nombre, reflejar el texto en #espejo en tiempo real (evento input).

const espejo = document.querySelector('#espejo')

input.addEventListener('input', (event) => {
    const dato = event.target.value
    espejo.textContent = dato

})


// 3. Al elegir una opción en #categoria, mostrar el valor elegido en #seleccion (evento change).

const showSelection = document.querySelector('#seleccion')
const categoria = document.querySelector('#categoria')

categoria.addEventListener('change', (event) => {
    const dato = event.target.value
    showSelection.textContent = dato
})




// 4. Al hacer focus en #nombre, agregarle la clase "enfocado". Al hacer blur, sacársela.

input.addEventListener('focus', (evento) => {
    const dato = evento.target
    dato.classList.add('enfocado')
})

input.addEventListener('blur', (evento) => {
    const dato = evento.target
    dato.classList.remove('enfocado')
})




// 5. Si se aprieta "Escape" dentro de #nombre, vaciar el input y #espejo.

input.addEventListener('keydown', (evento) => {
    if(evento.key === "Escape") {
        input.value = ""
        espejo.textContent = ""
    }
})