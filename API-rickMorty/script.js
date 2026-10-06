// ============================================================
// 1. ELEMENTOS DEL DOM
// ============================================================
const input = document.querySelector("#buscador");
const form = document.querySelector("#form-buscador");
const cardPersonajes = document.querySelector("#card-personajes");
const cardFavoritos = document.querySelector("#card-favoritos");

// ============================================================
// 2. ESTADO (los datos de la app)
// ============================================================
let listaPersonajes = [];

let listaFavoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // NUEVO: lee de localStorage

// ============================================================
// 3. API: pedir personajes
// ============================================================
async function obtenerPersonaje(name) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${name}`,
  );

  if (!response.ok) {
    // 200-299 = true, 400 o 500 = false
    throw new Error(`Error HTTP: ${response.status}`);
  } else {
    const datosPersonaje = await response.json();
    return datosPersonaje;
  }
}

// ============================================================
// 4. PANTALLA: dibujar resultados y favoritos
// ============================================================
function render() {
  cardPersonajes.innerHTML = "";
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
    );
  });
}

// ============================================================
// 5. PERSISTENCIA: guardar favoritos en localStorage
// ============================================================
function guardarFavoritos() { // NUEVO
  localStorage.setItem("favoritos", JSON.stringify(listaFavoritos));
}

// ============================================================
// 6. EVENTO: buscar personajes (submit del formulario)
// ============================================================
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const datos = new FormData(form);
  const nombre = datos.get("buscador");

  if (nombre.trim() === "") {
    return;
  }

  try {
    const datosPersonaje = await obtenerPersonaje(nombre);
    listaPersonajes = datosPersonaje.results;
    render();
  } catch (error) {
    cardPersonajes.innerHTML = "<p>No se encontraron personajes.</p>";
  }
});

// ============================================================
// 7. EVENTO: agregar a favoritos (click delegado)
// ============================================================
cardPersonajes.addEventListener("click", (event) => {
  if (event.target.matches("button")) {
    const id = Number(event.target.dataset.id);
    const personajeFav = listaPersonajes.find(
      (personaje) => personaje.id === id,
    );
    if (listaFavoritos.some((pj) => pj.id === id)) return;

    listaFavoritos.push(personajeFav);
    renderFavoritos();
    guardarFavoritos(); // NUEVO
  }
});

// ============================================================
// 8. EVENTO: eliminar de favoritos (click delegado)
// ============================================================
cardFavoritos.addEventListener("click", (event) => {
  if (event.target.matches("button")) {
    const id = Number(event.target.dataset.id);

    listaFavoritos = listaFavoritos.filter((personaje) => personaje.id !== id);
    renderFavoritos();
    guardarFavoritos(); // NUEVO
  }
});

// ============================================================
// 9. ARRANQUE: dibujar los favoritos guardados
// ============================================================
renderFavoritos(); // NUEVO


function guardarFavoritos() {
  
}


