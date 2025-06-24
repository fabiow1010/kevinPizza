fetch('productos.json')  // Asegúrate de que la ruta sea correcta
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(productos => {
        const ul = document.getElementById('lista-productos');
        ul.innerHTML = '';
        productos.forEach(producto => {
            const li = document.createElement('li');
            li.className = 'card';
            li.innerHTML = `
                <h4>
                    <img src="${producto.imagen}" alt="${producto.nombre}" style="width:100px;">
                    ${producto.nombre}
                </h4>
                <p class="card-desc">${producto.descripcion}</p>
                <span>Precio: $${producto.precio}</span>
                <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar</button>
            `;
            ul.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        const ul = document.getElementById('lista-productos');
        ul.innerHTML = '<li>Error al cargar los productos.</li>';
    });

let carrito = [];

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, 3000); // se oculta a los 3 segundos
}

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  mostrarToast(`${nombre} agregada al carrito`);
}

function enviarPedido() {
  if (carrito.length === 0) {
    mostrarToast("El carrito está vacío");
    return;
  }

  let total = 0;
  const direccionInput = document.getElementById("direccion");
  let direccion = direccionInput ? direccionInput.value.trim() : "";
  if (!direccion) {
    mostrarToast("Por favor ingresa la dirección de entrega.");
    if (direccionInput) direccionInput.focus();
    return;
  }
  let mensaje = "Hola, me gustaría pedir:\n" + `Dirección: ${direccion}\n\n`;
  carrito.forEach((item) => {
    mensaje += `• ${item.nombre} - $${item.precio}\n`;
    total += item.precio;
  });

  mensaje += `\nTotal: $${total.toFixed(2)}`;
  const numero = "573142008771"; 
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

function limpiarCarrito() {
  carrito = [];
  mostrarToast("Carrito limpiado");
}