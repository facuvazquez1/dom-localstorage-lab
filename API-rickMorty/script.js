// Conectá el input/botón a una función que haga el fetch, maneje el caso de status no-ok (if/throw, como en 04-apis), y guarde lo que llega en resultados. Todavía sin pensar en persistencia ni en delegación — el objetivo acá es solo confirmar que la data llega y se ve.

// Funcion: obtener personajes mediante la API
async function obtenerPersonaje(name) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${name}`,
  );

  if (!response.ok) {
    // response 200.. = true // 400 o 500 false
    throw new Error(`Error HTTP: ${response.status}`);
  } else {
    const datosPersonaje = await response.json();
    return datosPersonaje;
  }
}

// Creamos el render de la lista de personajes
function render() {
  cardPersonajes.innerHTML = ""; // limpiamos la lista
  listaPersonajes.forEach((personaje) => {
    cardPersonajes.insertAdjacentHTML(
      "beforeend",
      ` <div class="card">
          <img class="card-img" src="${personaje.image}" alt="${personaje.name}">
          <h4>${personaje.name}</h4>
          <p>${personaje.status} - ${personaje.species}</p>
          <button data-id="${personaje.id}">Agregar a favoritos</button>
      </div>`,
    );
  });
}

// Buscador form
const input = document.querySelector("#buscador");
const form = document.querySelector("#form-buscador");
const cardPersonajes = document.querySelector("#card-personajes");
const cardFavoritos = document.querySelector("#card-favoritos")

let listaPersonajes = [];

let listaFavoritos = [];

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // cortamos el reload del sumbit

  const datos = new FormData(form); // leemos el valor del input
  const nombre = datos.get("buscador"); // guardamos el valor del input

  if (nombre.trim() === "") {
    // manejo de error cuando el buscador esta vacio
    return;
  }

  try {
    const datosPersonaje = await obtenerPersonaje(nombre); // trae el objeto completo con varios parametros

    listaPersonajes = datosPersonaje.results; // el results, sale de la API, que nos da ese parametro para llamar y que traiga los datos del personaje

    render();
  } catch (error) {
    cardPersonajes.innerHTML = "<p>No se encontraron personajes.</p>";
  }
});

// click en favoritos, match con el ID del personaje para identificar que boton de favorito se clickeo y luego agregar el favorito a al array de favoritos sin duplicar
cardPersonajes.addEventListener("click", (event) => {
  if (event.target.matches("button")) {
    const id = Number(event.target.dataset.id);
    const personajeFav = listaPersonajes.find(
      (personaje) => personaje.id === id,
    );
    if (listaFavoritos.some((pj) => pj.id === id)) return; // si el id ya esta en favoritos, return corta la funcion

    listaFavoritos.push(personajeFav);
    renderFavoritos()
  }
});

function renderFavoritos() {
  cardFavoritos.innerHTML = "";
  listaFavoritos.forEach((personaje) => {
    cardFavoritos.insertAdjacentHTML(
      "beforeend",
        ` <div class="card">
          <img class="card-img" src="${personaje.image}" alt="${personaje.name}">
          <h4>${personaje.name}</h4>
          <p>${personaje.status} - ${personaje.species}</p>
          <button data-id="${personaje.id}">Eliminar</button>
      </div>`,
    )
  })
}

// Boton eliminar de favoritos
cardFavoritos.addEventListener("click", (event) => {
  if (event.target.matches("button")) {
    const id = Number(event.target.dataset.id);

    listaFavoritos = listaFavoritos.filter((personaje) => personaje.id !== id);
    renderFavoritos();
  }
});




