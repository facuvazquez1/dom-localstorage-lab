// 1. Crear un <p> con el texto "Hola DOM" e insertarlo dentro de #contenedor-1.

const nuevoParrafo = document.createElement('p');
const contenedor = document.getElementById('contenedor-1');

contenedor.append(nuevoParrafo, "Hola DOM"); 


// 2. Crear un <li> con el texto "Primer item" e insertarlo dentro de #lista.

const nuevaTarea = document.createElement('li') // creo el elemento li
nuevaTarea.textContent = "Primer item" // le asigno un contenido
const lista = document.querySelector('#lista') // selecciona la lista

lista.append(nuevaTarea) // inserto el li al la lista ul




// 3. Dado el array de abajo, insertar un <li> dentro de #lista por cada nombre.
const nombres = ["Zelda", "Mario", "Samus"];
const lista2 = document.querySelector('#lista')

nombres.forEach(nombre => {
    const nuevoNombre = document.createElement('li')
    nuevoNombre.textContent = nombre
    
    lista2.append(nuevoNombre)
})

