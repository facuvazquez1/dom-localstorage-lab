// Módulo: Selección de elementos y Eventos
// Repo: dom-localstorage-lab
// Este archivo corre en el navegador, no con node.
// Para probarlo: abrí index.html (doble clic o Live Server) y mirá la consola con F12.

// Ejercicio 1
// Seleccioná el elemento con id "titulo" usando getElementById y cambiá su textContent a "Mis tareas de hoy".
function ejercicio1() {

    const titulo = document.getElementById('titulo');
    titulo.textContent = "Mis tareas de hoy";

}

// ejercicio1()

// Ejercicio 2
// Seleccioná el botón con id "toggle-tema" usando querySelector y agregale un event listener de tipo "click"
// que le haga toggle a la clase "oscuro" sobre el <body>.
function ejercicio2() {

    const boton = document.querySelector('#toggle-tema');

    // agregagoms la clase oscuro al body class="oscuro"
    function alternaTema (){
        document.body.classList.toggle('oscuro')
    }

    boton.addEventListener('click', alternaTema);

}

// ejercicio2()


// Ejercicio 3
// Seleccioná todos los elementos con clase "tarea" usando querySelectorAll, convertilos a array
// y usá forEach para imprimir en consola el textContent de cada uno.
function ejercicio3() {

    const todasLasTareas = document.querySelectorAll('.tarea');
    
    const arrayDeTareas = [...todasLasTareas];

    arrayDeTareas.forEach(tarea => console.log(tarea.textContent));

}

ejercicio3()

// Ejercicio 4
// Agregale un event listener de tipo "click" al botón con id "agregar-btn" que:
// - lea el valor del input con id "input-tarea"
// - cree un nuevo <li class="tarea"> con ese texto
// - lo agregue al final de la lista con id "lista-tareas"

function ejercicio4() {

    // seleccionamos el boton agregar tarea
    const btnAgregarTarea = document.querySelector('#agregar-btn');

    btnAgregarTarea.addEventListener('click', function () {
        // selecciono el valor del input 
        const valorInput = document.getElementById('input-tarea').value;

        // creo una nueva lista, con el valor del input y agregamos la clase tarea
        const nuevaTarea = document.createElement('li')
         nuevaTarea.textContent = valorInput;
        nuevaTarea.classList.add('tarea');

        // selecciono la lista de tareas y le agrego la tarea nueva creada a lo ultimo de la lista 
        const listaTareas = document.getElementById('lista-tareas')
        listaTareas.appendChild(nuevaTarea);

    })
   
}

ejercicio4()

// Ejercicio 5 (delegación de eventos)
// Agregale UN SOLO event listener al <ul id="lista-tareas"> (no uno por cada botón de la lista) que:
// - detecte cuando se clickea un elemento con clase "eliminar-btn"
// - elimine el <li> padre de ese botón

function ejercicio5() {
    const listaTareas = document.getElementById('lista-tareas');

    listaTareas.addEventListener('click', function (event) {
        // 1. ¿el click fue sobre un botón "eliminar-btn"?
        if (event.target.classList.contains('eliminar-btn')) {
            // 2. subir hasta el <li> más cercano y eliminarlo
            event.target.closest('li').remove();
        }
    });
}

ejercicio5();