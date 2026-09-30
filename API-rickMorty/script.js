// Conectá el input/botón a una función que haga el fetch, maneje el caso de status no-ok (if/throw, como en 04-apis), y guarde lo que llega en resultados. Todavía sin pensar en persistencia ni en delegación — el objetivo acá es solo confirmar que la data llega y se ve.

// Funcion: obtener personajes mediante la API
async function obtenerPersonaje(name) {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${name}`,
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    } else {
      const datosPersonaje = await response.json();
      return datosPersonaje;
    }
  } catch (error) {
    console.log(error);
  }
}

// Buscador form
const input = document.querySelector("#buscador");
const form = document.querySelector("#form-buscador");

let listaPersonajes = []

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // cortamos el reload del sumbit

  const datos = new FormData(form); // leemos el valor del input
  const nombre = datos.get("buscador"); // guardamos el valor del input

  const datosPersonaje = await obtenerPersonaje(nombre);

  listaPersonajes.push(datosPersonaje.name)
});


