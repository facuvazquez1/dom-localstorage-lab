// -------------- ELEMENTOS DEL DOM -----------

const listaGastos = document.querySelector("#lista-gastos");
const formGasto = document.querySelector("#form-gasto");
const mensajeError = document.querySelector("#error-form");

// ------------------ ESTADO ------------------

let gastos = cargarGastos(); // le asignamos los datos de localStorage, si el mismo esta vacio devolvera []

// ------------------ LOGICA ------------------

function validarGasto(descripcion, monto, categoria, fecha) {
  // esta funcion permite validar que los campos ingresados del form-gasto cumplan con las condiciones y no generen errores.
  const errores = [];

  if (descripcion.trim() === "") {
    errores.push("Falta completar el campo descripcion");
  }

  if (!(monto > 0)) {
    errores.push("El monto tiene que ser mayor a 0.");
  }

  if (!categoria) {
    errores.push("No se selecciono ninguna categoria.");
  }

  if (!fecha) {
    errores.push("No se selecciono ninguna fecha.");
  }

  return errores;
}

function escaparHtml(texto) {
  // evita la inyeccion de codigo mediante el campo "descripcion del form"
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;") // comillas doble
    .replaceAll("'", "&#39;"); // comillas simples
}

function calcularTotal(gasto) {
  const total = gasto.reduce((acc, gasto) => acc + gasto.monto, 0)
  return total 
}

console.log(calcularTotal(gastos))

// ---------------- PERSISTENCIA --------------

function guardarGastos(lista) {
  // guardamos en formato string los gastos dentro de la clave gastos
  localStorage.setItem("gastos", JSON.stringify(lista));
}

function cargarGastos() {
  try {
    return JSON.parse(localStorage.getItem("gastos")) || []; // convertimos la clave guardada a objeto devuelta, y ponemos || [], porque si arranca la aplicacion y la clave todavia no fue creada, devuelva un array vacio.
  } catch (error) {
    console.error("Los datos del array fallaron al obtenerse.", error);
    return [];
  }
}

// ------------------ RENDER ------------------

// Funcion: Construir el HTML de una fila
function crearFilaGasto(gasto) {
  // retornamos el template del li con el gasto y su informacion

  return `<li class="gasto" data-id="${gasto.id}">
     <div class="gasto__info">
       <span class="gasto__descripcion">${escaparHtml(gasto.descripcion)}</span>
       <span class="gasto__meta">
         <span class="badge badge--${gasto.categoria}">${gasto.categoria}</span>
         <span class="gasto__fecha">${gasto.fecha}</span>
       </span>
     </div>
     <span class="gasto__monto">${gasto.monto}</span>
     <div class="gasto__acciones">
       <button class="btn btn--secundario btn--chico" data-accion="editar" data-id="${gasto.id}">Editar</button>
       <button class="btn btn--peligro btn--chico" data-accion="eliminar" data-id="${gasto.id}">Eliminar</button>
     </div>
   </li>`;
}

// Funcion: Dibujar la lista completa en pantalla.
function renderLista(lista) {
  const filas = lista.map((gasto) => crearFilaGasto(gasto));
  const html = filas.join(""); // Convertimos el array en string.
  listaGastos.innerHTML = html;
}

function mostrarError(mensajes) {
  mensajeError.textContent = mensajes.join(" ");
}

// ------------------ EVENTOS ------------------
formGasto.addEventListener("submit", (event) => {
  event.preventDefault();
  const datos = new FormData(formGasto); // guardamos los datos del formulario en una variable para acceder a los name mediante get

  const descripcion = datos.get("descripcion").trim();
  const monto = Number(datos.get("monto")); // convertimos monto a numero
  const categoria = datos.get("categoria");
  const fecha = datos.get("fecha");

  const resultadoValidacion = validarGasto(
    descripcion,
    monto,
    categoria,
    fecha,
  );
  mostrarError(resultadoValidacion);
  if (resultadoValidacion.length > 0) {
    // si la validacion tiene algun elemento quiere decir que hay un error y corta conr return
    return;
  }

  const nuevoGasto = {
    id: Date.now(), // devuelve la marca de tiempo (timestamp) actual en milisegundos desde el 1 de enero de 1970 a las 00:00:00 UTC
    descripcion: descripcion,
    monto: monto,
    categoria: categoria,
    fecha: fecha,
  };

  gastos = [...gastos, nuevoGasto];
  renderLista(gastos); // renderizamos nuevos gastos

  guardarGastos(gastos); // guardamos en localStorage los gastos actualizados

  formGasto.reset(); // reseteamos los valores por defecto del form luego de agregar el gasto
});

listaGastos.addEventListener("click", (event) => {
  const boton = event.target.closest("[data-accion]"); // buscamos el boton del elemento lista-gastos

  if (!boton) {
    // si no trae un boton, cortar con return
    return;
  }

  const accionBoton = boton.dataset.accion;
  const botonId = Number(boton.dataset.id);

  if (accionBoton === "eliminar") {
    gastos = gastos.filter((n) => n.id !== botonId);
    renderLista(gastos);
    guardarGastos(gastos);
  }
});

// ------------------ ARRANQUE ----------------

// Renderizamos los gastos en la lista-gastos
renderLista(gastos);
