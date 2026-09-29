// 1. Guardar el string "hola" bajo la clave "prueba" en localStorage.
//    Leerlo de vuelta y mostrarlo por consola. Abrir DevTools > Application > Local Storage y confirmar que aparece ahí.

const string = "hola"

localStorage.setItem('prueba', string)
console.log(localStorage.getItem('prueba'))


// 2. Guardar el array de abajo en localStorage (convertido a string).
//    Leerlo de vuelta, convertirlo de nuevo a array, y mostrar por
//    consola cuántos elementos tiene.
const colores = ["rojo", "verde", "azul"]
1
localStorage.setItem('colores', JSON.stringify(colores)) // Array -> JSON

console.log(localStorage.getItem('colores')) // Mostramos el resultado por consola

const conversion = JSON.parse(localStorage.getItem('colores')) // JSON -> Array

console.log(conversion.length) // cantidad de elementos del array 


// 3. Armar el patrón completo: un array "notas" que arranca leyendo de
//    localStorage (o vacío si no hay nada). Una función render() que
//    dibuje #lista-notas a partir del array. Al clickear #agregar-nota,tomar el valor de #nueva-nota, agregarlo al array, guardar el array actualizado en localStorage, y volver a renderizar. Recargar la página después de agregar algo y confirmar que la nota sigue ahí.

let notas = JSON.parse(localStorage.getItem('notas')) || []

const lista = document.querySelector('#lista-notas')

function render() {
    lista.innerHTML = ""
    notas.forEach(number => {
        lista.insertAdjacentHTML("beforeend", `<li>${number}</li>`)
    })
}

render()

const btnAddNote = document.querySelector('#agregar-nota')
const inputNota = document.querySelector('#nueva-nota')

btnAddNote.addEventListener('click', () => {
    const nuevaNota = inputNota.value

    notas.push(nuevaNota)
    localStorage.setItem('notas', JSON.stringify(notas))

    render()

    inputNota.value = ""
    
})





