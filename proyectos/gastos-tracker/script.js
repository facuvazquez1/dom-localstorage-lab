// -------------- ELEMENTOS DEL DOM -----------

const listaGastos = document.querySelector("#lista-gastos");
const formGasto = document.querySelector("#form-gasto");
const mensajeError = document.querySelector("#error-form");

// ------------------ ESTADO ------------------

let gastos = [
  {
    id: 1,
    descripcion: "Compra Supermercado Octubre 2026",
    monto: 170000,
    categoria: "comida",
    fecha: "2026-10-02",
  },
  {
    id: 2,
    descripcion: "Entradas para Bad Bunny",
    monto: 50000,
    categoria: "ocio",
    fecha: "2026-07-28",
  },
  {
    id: 3,
    descripcion: "Nafta Auto",
    monto: 25000,
    categoria: "transporte",
    fecha: "2026-08-16",
  },
];

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

// ------------------ RENDER ------------------

// Funcion: Construir el HTML de una fila
function crearFilaGasto(gasto) {
  // retornamos el template del li con el gasto y su informacion

  return `<li class="gasto" data-id="${gasto.id}">
     <div class="gasto__info">
       <span class="gasto__descripcion">${gasto.descripcion}</span>
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
    return;
  }

  const nuevoGasto = {
    id: Date.now(),
    descripcion: descripcion,
    monto: monto,
    categoria: categoria,
    fecha: fecha,
  };

  gastos = [...gastos, nuevoGasto];
  renderLista(gastos) // renderizamos nuevos gastos

  formGasto.reset() // reseteamos los valores por defecto del form luego de agregar el gasto
});

// ------------------ ARRANQUE ----------------

// Renderizamos los gastos en la lista-gastos
renderLista(gastos);
