const añoInput = document.getElementById("año");
añoInput.max = new Date().getFullYear();

const imagenInput = document.getElementById("imagen");
const preview = document.getElementById("preview");

const filtroTitulo = document.getElementById("filtro-titulo");
const filtroGenero = document.getElementById("filtro-genero");

// VALIDACION DE LA IMAGEN
function validarImagen(url) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);

    img.src = url;
  });
}

imagenInput.addEventListener("change", async () => {
  const url = imagenInput.value;
  const esImagen = await validarImagen(url);

  if (esImagen) {
    preview.src = url;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
    alert("La URL no es una imagen válida");
  }
});

// SUBMIT DEL FORMULARIO
const form = document.getElementById("pelisform");
form.addEventListener("submit", añadirPelicula);

peliculas = [];

function añadirPelicula(event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const año = document.getElementById("año").value;
  const descripcion = document.getElementById("descripcion").value;
  const genero = document.getElementById("genero").value;
  const imagen = document.getElementById("imagen").value;

  const pelicula = {
    titulo,
    año,
    descripcion,
    genero,
    imagen
  };

  peliculas.push(pelicula);
  preview.src = '';
  preview.style.display = "none";
  form.reset();
  renderizarTabla();
}

// RENDERIZADO TABLA
function renderizarTabla() {
  const contenedor = document.getElementById("tabla-peliculas");
  const peliculasFiltradas = obtenerPeliculasFiltradas();

  if (peliculasFiltradas.length === 0 && peliculas.length !== 0) {
    console.log("no pelis")
    contenedor.innerHTML = "Ninguna Pelicula corresponde con el filtro actual";
    return;
  } 
  
  if (peliculas.length === 0) {
    contenedor.innerHTML = "";
    return;
  }

  let html = `
    <table border="1" class="tabla">
      <thead class="tabla-header">
        <tr>
          <th>Título</th>
          <th>Año</th>
          <th>Descripción</th>
          <th>Imagen</th>
          <th>Género</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody class="tabla-body">
  `;

  peliculasFiltradas.forEach((pelicula, index) => {
    html += `
      <tr>
        <td>${pelicula.titulo}</td>
        <td>${pelicula.año}</td>
        <td>${pelicula.descripcion}</td>
        <td class="img-tabla"><img src="${pelicula.imagen}" width="80"></td>
        <td>${pelicula.genero}</td>
        <td>
          <button class="editar" data-index="${index}">Editar</button>
          <button class="borrar" data-index="${index}">Borrar</button>
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
  document.querySelectorAll(".borrar").forEach(btn => {
    btn.addEventListener("click", borrarPelicula);
  });

  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", editarPelicula);
  });
}

// LOGICA FILTROS

filtroGenero.addEventListener("change", renderizarTabla);

filtroTitulo.addEventListener("input", renderizarTabla);


function obtenerPeliculasFiltradas() {

  const generoSeleccionado = filtroGenero?.value ? filtroGenero?.value : '';
  const textoBusqueda = filtroTitulo?.value ? filtroTitulo?.value
    .toLowerCase() : '';

  return peliculas.filter(pelicula => {
    const coincideGenero =
      generoSeleccionado === "" || pelicula.genero === generoSeleccionado;

    const coincideTitulo =
      pelicula.titulo.toLowerCase().includes(textoBusqueda || "");

    return coincideGenero && coincideTitulo;

  });
}

// LOGICA BORRADO

function borrarPelicula(event) {
  const index = event.target.dataset.index;
  const pelicula = obtenerPeliculasFiltradas()[index];

  const indiceReal = peliculas.findIndex(p => p.titulo === pelicula.titulo && p.año === pelicula.año);

  if (indiceReal > -1) {
    peliculas.splice(indiceReal, 1);
    renderizarTabla();
  }
}

// LOGICA MODAL EDITAR

let indiceEditar = null;

function editarPelicula(event) {
  const index = event.target.dataset.index;
  const pelicula = obtenerPeliculasFiltradas()[index];
  indiceEditar = peliculas.findIndex(p => p.titulo === pelicula.titulo && p.año === pelicula.año);

  if (indiceEditar === -1) return;

  document.getElementById("edit-titulo").value = peliculas[indiceEditar].titulo;
  document.getElementById("edit-año").value = peliculas[indiceEditar].año;
  document.getElementById("edit-descripcion").value = peliculas[indiceEditar].descripcion;
  document.getElementById("edit-imagen").value = peliculas[indiceEditar].imagen;
  document.getElementById("edit-genero").value = peliculas[indiceEditar].genero;

  document.getElementById("modal-editar").style.display = "flex";
}


document.getElementById("cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-editar").style.display = "none";
});

document.getElementById("form-editar").addEventListener("submit", (e) => {
  e.preventDefault();

  if (indiceEditar === null) return;

  peliculas[indiceEditar] = {
    titulo: document.getElementById("edit-titulo").value,
    año: parseInt(document.getElementById("edit-año").value),
    descripcion: document.getElementById("edit-descripcion").value,
    imagen: document.getElementById("edit-imagen").value,
    genero: document.getElementById("edit-genero").value
  };

  renderizarTabla();
  document.getElementById("modal-editar").style.display = "none";
  indiceEditar = null;
});
