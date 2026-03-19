// VARIABLES GLOBALES:
let movies = [
  {
    title: "A Nightmare on Elm Street",
    year: 1984,
    description:
      "Un asesino ataca a adolescentes a través de sus sueños, donde no pueden escapar.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/a_nightmare_on_elm_street-960435841-mmed.jpg",
  },
  {
    title: "A Nightmare on Elm Street 2: Freddy's Revenge",
    year: 1985,
    description:
      "Freddy intenta poseer a un joven para regresar al mundo real.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/a_nightmare_on_elm_street_2_freddy_s_revenge-329113889-mmed.jpg",
  },
  {
    title: "A Nightmare on Elm Street 3: Dream Warriors",
    year: 1987,
    description:
      "Un grupo de adolescentes con poderes en sueños se enfrenta a Freddy.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/a_nightmare_on_elm_street_3_dream_warriors-725612823-mmed.jpg",
  },
  {
    title: "A Nightmare on Elm Street 4: The Dream Master",
    year: 1988,
    description:
      "Freddy regresa y se enfrenta a una nueva heroína con habilidades especiales.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/a_nightmare_on_elm_street_4_the_dream_master-374245138-mmed.jpg",
  },
  {
    title: "A Nightmare on Elm Street 5: The Dream Child",
    year: 1989,
    description:
      "Freddy utiliza los sueños de un bebé no nacido para volver a matar.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/a_nightmare_on_elm_street_5_the_dream_child-776011595-mmed.jpg",
  },
  {
    title: "Freddy's Dead: The Final Nightmare",
    year: 1991,
    description:
      "Freddy parece haber acabado con todos los niños de Springwood.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/freddy_s_dead_the_final_nightmare_a_nightmare_on_elm_street_6-934501006-mmed.jpg",
  },
  {
    title: "Wes Craven's New Nightmare",
    year: 1994,
    description:
      "Freddy invade el mundo real persiguiendo a los actores de la saga.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/wes_craven_s_new_nightmare_aka_a_nightmare_on_elm_street_7-603261504-mmed.jpg",
  },
  {
    title: "Freddy vs. Jason",
    year: 2003,
    description:
      "Freddy manipula a Jason Voorhees para sembrar el terror y recuperar su poder.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/freddy_vs_jason-860246573-mmed.jpg",
  },
  {
    title: "A Nightmare on Elm Street",
    year: 2010,
    description:
      "Remake moderno del clásico donde Freddy vuelve a aterrorizar a los jóvenes.",
    genre: "terror",
    img:
      "https://pics.filmaffinity.com/a_nightmare_on_elm_street-511303390-mmed.jpg",
  },
];
// FORMULARIO
const form = document.getElementById("moviesForm");
// INPUT AÑO FORMULARIO
const yearInput = document.getElementById("year");
yearInput.max = new Date().getFullYear();
// INPUT IMAGEN FORMULARIO
const imgInput = document.getElementById("img");
const preview = document.getElementById("preview");
// FILTROS TABLA
const filterTitle = document.getElementById("filter-title");
const filtergenre = document.getElementById("filter-genre");
// INDICE FICTICIO USADO EN EDITAR PELICULA DE LA TABLA
let indexEdit = null;

// EVENT LISTENERS:
// INPUT IMAGEN FORMULARIO
imgInput.addEventListener("change", async () => {
  const url = imgInput.value;
  const esimg = await validateImg(url);

  if (esimg) {
    preview.src = url;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
    alert("La URL no es una img válida");
  }
});
// FILTROS
filtergenre.addEventListener("change", renderTable);
filterTitle.addEventListener("input", renderTable);

// SUBMIT DEL FORMULARIO
form.addEventListener("submit", addMovie);

// EVENTOS DEL MODAL: CERRAR MODAL Y SUBMIT DE EDITAR EN EL MODAL
document.getElementById("cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-edit").style.display = "none";
});

document.getElementById("form-edit").addEventListener("submit", (e) => {
  e.preventDefault();

  if (indexEdit === null) return;

  movies[indexEdit] = {
    title: document.getElementById("edit-title").value,
    year: parseInt(document.getElementById("edit-year").value),
    description: document.getElementById("edit-description").value,
    img: document.getElementById("edit-img").value,
    genre: document.getElementById("edit-genre").value,
  };

  renderTable();
  document.getElementById("modal-edit").style.display = "none";
  indexEdit = null;
});


// FUNCIONES:

// VALIDACION DE LA IMAGEN
function validateImg(url) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);

    img.src = url;
  });
}
// AÑADIR PELICULA
function addMovie(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const year = document.getElementById("year").value;
  const description = document.getElementById("description").value;
  const genre = document.getElementById("genre").value;
  const img = document.getElementById("img").value;

  const pelicula = {
    title,
    year,
    description,
    genre,
    img,
  };

  movies.push(pelicula);
  preview.src = "";
  preview.style.display = "none";
  form.reset();
  renderTable();
}
// BORRAR PELICULA DESDE TABLA
function deleteMovie(event) {
  const index = event.target.dataset.index;
  const pelicula = getFilteredMovies()[index];

  const indiceReal = movies.findIndex(
    (p) => p.title === pelicula.title && p.year === pelicula.year,
  );

  if (indiceReal > -1) {
    movies.splice(indiceReal, 1);
    renderTable();
  }
}

// EDITAR PELICULA DESDE LA TABLA (MOSTRAR MODAL EDITAR)
function editMovie(event) {
  const index = event.target.dataset.index;
  const pelicula = getFilteredMovies()[index];
  indexEdit = movies.findIndex(
    (p) => p.title === pelicula.title && p.year === pelicula.year,
  );

  if (indexEdit === -1) return;

  document.getElementById("edit-title").value = movies[indexEdit].title;
  document.getElementById("edit-year").value = movies[indexEdit].year;
  document.getElementById("edit-description").value =
    movies[indexEdit].description;
  document.getElementById("edit-img").value = movies[indexEdit].img;
  document.getElementById("edit-genre").value = movies[indexEdit].genre;

  document.getElementById("modal-edit").style.display = "flex";
}

// RENDERIZADO table
function renderTable() {
  const contenedor = document.getElementById("table-Movies");
  const filteredMovies = getFilteredMovies();

  if (filteredMovies.length === 0 && movies.length !== 0) {
    console.log("no movies");
    contenedor.innerHTML = "Ninguna Pelicula corresponde con el filter actual";
    return;
  }

  if (movies.length === 0) {
    contenedor.innerHTML = "";
    return;
  }

  let html = `
    <table border="1" class="table">
      <thead class="table-header">
        <tr>
          <th>Título</th>
          <th>year</th>
          <th>Descripción</th>
          <th>img</th>
          <th>Género</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody class="table-body">
  `;

  filteredMovies.forEach((pelicula, index) => {
    html += `
      <tr>
        <td>${pelicula.title}</td>
        <td>${pelicula.year}</td>
        <td>${pelicula.description}</td>
        <td class="img-table"><img src="${pelicula.img}"></td>
        <td>${pelicula.genre}</td>
        <td>
          <button class="edit" data-index="${index}">Editar</button>
          <button class="delete" data-index="${index}">Borrar</button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  contenedor.innerHTML = html;

  // eventos de los botones borrar y editar
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", deleteMovie);
  });

  document.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", editMovie);
  });
}

// LOGICA FILTROS
function getFilteredMovies() {
  const genreSeleccionado = filtergenre?.value ? filtergenre?.value : "";
  const textoBusqueda = filterTitle?.value
    ? filterTitle?.value.toLowerCase()
    : "";

  return movies.filter((pelicula) => {
    const coincidegenre =
      genreSeleccionado === "" || pelicula.genre === genreSeleccionado;

    const coincidetitle = pelicula.title
      .toLowerCase()
      .includes(textoBusqueda || "");

    return coincidegenre && coincidetitle;
  });
}

// INICIALIZACION

renderTable();

