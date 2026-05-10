async function cargarProductos() {
  const res = await fetch('/productos');
  const productos = await res.json();

  const lista = document.getElementById('listaProductos');
  lista.innerHTML = '';

  productos.forEach(producto => {
    lista.innerHTML += `
      <li>
        ${producto.nombre} - $${producto.precio}

        <button onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio})">
          Editar
        </button>

        <button onclick="eliminarProducto(${producto.id})">
          Eliminar
        </button>
      </li>
    `;
  });
}

async function guardarProducto() {
  const id = document.getElementById('productoId').value;
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;

  if(id) {
    await fetch(`/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, precio })
    });
  } else {
    await fetch('/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, precio })
    });
  }

  limpiarFormulario();
  cargarProductos();
}

function editarProducto(id, nombre, precio) {
  document.getElementById('productoId').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('precio').value = precio;
}

async function eliminarProducto(id) {
  await fetch(`/productos/${id}`, {
    method: 'DELETE'
  });

  cargarProductos();
}

function limpiarFormulario() {
  document.getElementById('productoId').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('precio').value = '';
}

cargarProductos();