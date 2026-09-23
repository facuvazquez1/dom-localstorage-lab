// 1. Leer el href del #link y mostrarlo por consola. Después cambiarlo
//    para que apunte a "https://developer.mozilla.org".

const linkGoogle = document.querySelector('#link')
console.log(linkGoogle.getAttribute('href'))

linkGoogle.setAttribute('href', 'https://developer.mozilla.org')

console.log(linkGoogle.getAttribute('href'))


// 2. Recorrer los <li> de #lista y mostrar por consola el id y el precio
//    de cada uno, leídos desde dataset.

const listaProductos = document.querySelectorAll('#lista li')

listaProductos.forEach(producto => {
    console.log(producto.dataset.id, producto.dataset.precio )
});


// 3. Calcular el total sumando los precios de todos los <li> de #lista.
//    (Cuidado con el tipo de dato que devuelve dataset.)

const productos = Array.from(listaProductos)


const precioTotal = productos.reduce((acc, producto) => {
    return acc + Number(producto.dataset.precio)
}, 0)

console.log(precioTotal) // resultado: 4300