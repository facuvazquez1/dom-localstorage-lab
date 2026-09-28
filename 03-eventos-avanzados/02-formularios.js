// 1. Al enviar el formulario, evitar el reload de la página y mostrar por
//    consola el objeto event completo.

const form = document.querySelector('#form-gasto')

// form.addEventListener('submit', (event) => {
//     event.preventDefault() // el comportamiendo por defecto del sumbit es recargar la pagina, por eso con preventDefault() cortamos ese comportamiento.
//     console.log(event)
// })


// 2. Usando FormData, leer descripcion y monto del formulario y mostrarlos
//    por consola por separado.

// form.addEventListener('submit', (event) => {
//     event.preventDefault() 

//     const datos = new FormData(form) // guardamos el formulario
//     const descripcion = datos.get('descripcion') // accedemos alm input del form 
//     const monto = datos.get('monto') // accedemos alm input del form 

//     console.log(`${descripcion}: ${monto}`) 

// })


// 3. Validar: si descripcion está vacío o monto no es un número válido,
//    mostrar un mensaje de error por consola y no seguir. Si pasa la
//    validación, insertar un <li> en #lista-gastos con el texto
//    "descripcion - $monto".

// 4. Después de insertar el <li>, limpiar el formulario para que quede
//    listo para cargar el siguiente gasto (pista: form.reset()).

const listaGastos = document.querySelector('#lista-gastos')

form.addEventListener('submit', (event) => {
    event.preventDefault() 

    const datos = new FormData(form) 
    const descripcion = datos.get('descripcion') 
    const monto = datos.get('monto') 

    if(!(Number(monto) > 0) || descripcion === "") {
        console.log("Error: descripcion o monto invalido. Vuelva a intentar...")
    } else {

        listaGastos.insertAdjacentHTML("beforeend", `<li>${descripcion}: ${monto}</li>`)
        form.reset() // reseteamos valores de los campos
    }
    
})

