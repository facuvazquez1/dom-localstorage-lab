// Con classList podemos acceder a la clase de un elemento HTML y mediante las siguientes propiedades hacer distintas modificaciones:

// activo = cualquier clase que exista, o que no exista del elemento. Ej: <li class = "activo"> Hola mundo </li>

// elemento.classList.add('activo')
// elemento.classList.remove('activo')
// elemento.classList.toggle('activo')    // si está la saca, si no está la pone
// elemento.classList.contains('activo')  // true / false

// 1. Agregarle la clase "destacado" al primer <li> de #lista.

const primeroLista = document.querySelector('li:first-child')

primeroLista.classList.add('destacado')



// 2. Recorrer todos los <li> de #lista y mostrar por consola el texto de
//    cada uno junto a si tiene o no la clase "completado".

const lista = document.querySelectorAll('#lista li')

lista.forEach(li => {
    const contieneCompletado = li.classList.contains('completado')
    console.log(`${li.textContent} : ${contieneCompletado}`)
})



// 3. Hacer que al clickear #btn se alterne la clase "completado" en el
//    último <li> de #lista.

const btn = document.querySelector('#btn');

const finLista = document.querySelector('#lista li:last-child')


function completado() {
    finLista.classList.toggle('completado')
}

btn.addEventListener('click', completado);
