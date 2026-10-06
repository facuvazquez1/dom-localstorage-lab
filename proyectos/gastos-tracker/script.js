// ELEMENTOS DEL DOM

// ESTADO

let gastos = [
    {
        id: 1,
        descripcion: "Compra Supermercado Octubre 2026",
        monto: 170000,
        categoria: "comida",
        fecha: "2026-10-02"
    },
    {
        id: 2,
        descripcion: "Entradas para Bad Bunny",
        monto: 50000,
        categoria: "ocio",
        fecha: "2026-07-28"
    },
    {
        id: 3,
        descripcion: "Nafta Auto",
        monto: 25000,
        categoria: "transporte",
        fecha: "2026-08-16"
    }
];

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
   </li>`
};

// RENDER

// ARRANQUE