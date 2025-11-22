fetch('productos.json')
  .then(response => {
    if (!response.ok) throw new Error('Error al cargar los productos.');
    return response.json();
  })
  .then(productos => {
    const pizzaList = document.getElementById('lista-pizza');
    const hamburguesaList = document.getElementById('lista-hamburguesa');
    const demasList = document.getElementById('lista-demas');
    // tolerancia: busca ambos posibles ids (corrección de typo)
    const hotdogList = document.getElementById('lista-hotdog') || document.getElementById('lista-hostdog');

    pizzaList.innerHTML = '';
    hamburguesaList.innerHTML = '';
    demasList.innerHTML = '';
    if (hotdogList) hotdogList.innerHTML = '';

    productos.forEach(producto => {
      const li = document.createElement('li');
      li.className = 'card shadow-hover';

      li.innerHTML = `
        <div class="card-content">
          <h4 class="card-title">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img">
            ${producto.nombre}
          </h4>
          <p class="card-desc">${producto.descripcion}</p>
          <span class="card-price">Precio: $${producto.precio}</span>
          <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">
            Agregar al carrito
          </button>
        </div>
      `;

      if (producto.clase === 'pizza') {
        pizzaList.appendChild(li);
      } else if (producto.clase === 'hamburguesa') {
        hamburguesaList.appendChild(li);
      } else if (producto.clase === 'hotdog') {
        // nueva categoría hotdog
        if (hotdogList) {
          hotdogList.appendChild(li);
        } else {
          demasList.appendChild(li); // fallback si no existe la lista-hotdog
        }
      } else {
        demasList.appendChild(li);
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('lista-pizza').innerHTML = '<li class="card">No se pudieron cargar los productos.</li>';
    // tolerancia en el catch también
    const h = document.getElementById('lista-hotdog') || document.getElementById('lista-hostdog');
    if (h) h.innerHTML = '<li class="card">No se pudieron cargar los productos.</li>';
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
  }, 3000);
}

function renderCarrito() {
  const ul = document.getElementById('carrito-lista');
  if (!ul) return;
  ul.innerHTML = '';
  if (carrito.length === 0) {
    ul.innerHTML = '<li class="carrito-vacio">El carrito está vacío.</li>';
    return;
  }
  let total = 0;
  carrito.forEach(item => {
    total += item.precio;
    ul.innerHTML += `<li>${item.nombre} <span>$${item.precio}</span></li>`;
  });
  ul.innerHTML += `<li style="font-weight:bold; border-bottom:none;">Total: <span>$${total.toFixed(2)}</span></li>`;
}

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  mostrarToast(`${nombre} agregado al carrito`);
  renderCarrito();
}

function enviarPedido() {
  if (carrito.length === 0) {
    mostrarToast("El carrito está vacío.");
    return;
  }

  const direccionInput = document.getElementById("direccion");
  const direccion = direccionInput?.value.trim();

  if (!direccion) {
    mostrarToast("Por favor ingresa la dirección de entrega.");
    direccionInput?.focus();
    return;
  }

  let mensaje = `Hola, me gustaría pedir:\nPara esta Dirección: ${direccion}\n\n`;
  let total = 0;

  carrito.forEach(item => {
    mensaje += `• ${item.nombre} - $${item.precio}\n`;
    total += item.precio;
  });

  mensaje += `\nTotal: $${total.toFixed(2)}`;

  const numero = "573115594224";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

function limpiarCarrito() {
  carrito = [];
  mostrarToast("Carrito limpiado.");
  renderCarrito();
}

function toggleCategoria(listaId, headerElem) {
  const lista = document.getElementById(listaId);
  const allLists = document.querySelectorAll('ul.productos');
  const allHeaders = document.querySelectorAll('.categoria-header');

  allLists.forEach(l => {
    if (l !== lista) l.classList.remove('open');
  });

  allHeaders.forEach(h => {
    if (h !== headerElem) h.classList.remove('active');
  });

  lista.classList.toggle('open');
  headerElem.classList.toggle('active');
}

function toggleNavbar() {
  const menu = document.getElementById('navbar-menu');
  menu.classList.toggle('hidden');
}

// Llama a renderCarrito al cargar la página para mostrar el estado inicial
document.addEventListener('DOMContentLoaded', renderCarrito);
