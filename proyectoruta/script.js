// Array de clientes
let clients = [
  {
    nombre: "michelin",
    calle: "Av. puertoprincipe",
    deuda: 1000,
    telefono: "809-123-4567",
    referencia: "el hijo de kokito el jukero",
    semana: 1,
    semanasTotales: 10,
    pagoSemanal: 100,
    totalPagado: 0,
    deudaRestante: 1000,
    weeksPaidAmounts: [] // Inicia un arreglo vacío para los pagos semanales si no existe
  }
];

// Declaración de eventos
document.getElementById('menuToggle').addEventListener('click', toggleMenu);
document.getElementById('clientDataForm').addEventListener('submit', agregarCliente);
document.getElementById('addReference').addEventListener('change', function () {
  const referenceField = document.getElementById('referenceField');
  referenceField.style.display = this.checked ? 'block' : 'none';
});

// Cambia la posición del menú entre visible y oculto
function toggleMenu() {
  const menu = document.getElementById('menu');
  const currentLeft = menu.style.left || '-250px'; // Valor predeterminado si no está definido
  menu.style.left = currentLeft === '0px' ? '-250px' : '0px';

  document.querySelectorAll('.menu ul li a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}

// Muestra la sección seleccionada y oculta las demás
function mostrarSeccion(seccionId) {
  document.querySelectorAll('main > section').forEach(section => {
    section.style.display = 'none';
  });

  if (seccionId === 'registro') {
    mostrarSeccionRegistro();
  } else if (seccionId === 'pagos') {
    mostrarSeccionPagos();
  } else if (seccionId === 'agregar') {
    mostrarSeccionAgregar();
  }
}

// Muestra la lista de clientes en la sección de registro
function mostrarSeccionRegistro() {
  document.querySelectorAll('main > section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('registro').style.display = 'block';
  renderizarListaClientes();
}

// Muestra la lista de clientes en la sección de pagos
function mostrarSeccionPagos() {
  document.querySelectorAll('main > section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('pagos').style.display = 'block';
  renderizarListaPagos();
}

// Muestra la sección de agregar cliente
function mostrarSeccionAgregar() {
  document.querySelectorAll('main > section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('agregar').style.display = 'block';
}

// Renderiza la lista de clientes en la sección de registro
function renderizarListaClientes() {
  const listaClientes = document.getElementById('clientList');
  listaClientes.innerHTML = '';

  if (clients.length === 0) {
    listaClientes.innerHTML = '<p>No hay clientes registrados.</p>';
    return;
  }

  clients.forEach((cliente, index) => {
    const li = document.createElement('li');
    li.textContent = cliente.nombre;
    li.addEventListener('click', () => mostrarDetallesCliente(index));
    listaClientes.appendChild(li);
  });
}

// Renderiza la lista de clientes en la sección de pagos
function renderizarListaPagos() {
  const listaPagos = document.getElementById('pagosList');
  listaPagos.innerHTML = '';

  if (clients.length === 0) {
    listaPagos.innerHTML = '<p>No hay clientes registrados para pagos.</p>';
    return;
  }

  clients.forEach((cliente, index) => {
    const li = document.createElement('li');
    li.textContent = cliente.nombre;
    li.addEventListener('click', () => mostrarOpcionesPago(index));
    listaPagos.appendChild(li);
  });
}

// Muestra los detalles de un cliente específico
function mostrarDetallesCliente(index) {
  const cliente = clients[index];
  const listaClientes = document.getElementById('clientList');

  // Almacenando el total pagado en cada semana
  const totalPagadoEnSemana = cliente.weeksPaidAmounts.reduce((acc, current) => acc + current, 0);

  listaClientes.innerHTML = `
    <p><strong>Nombre:</strong> ${cliente.nombre}</p>
    <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
    <p><strong>Dirección:</strong> ${cliente.calle}</p>
    <p><strong>Deuda:</strong> $${cliente.deuda}</p>
    <p><strong>Semana Actual:</strong> ${cliente.semana} de ${cliente.semanasTotales}</p>
    <p><strong>Pago Semanal:</strong> $${cliente.pagoSemanal}</p>
    <p><strong>Referencia:</strong> ${cliente.referencia}</p>
    <p><strong>Total Pagado:</strong> $${cliente.totalPagado}</p>
    <p><strong>Total Pagado en Semana:</strong> $${totalPagadoEnSemana}</p>
    <button onclick="renderizarListaClientes()">Volver</button>
  `;
}


// Agregar un nuevo cliente
function agregarCliente(event) {
  event.preventDefault();
  const nombre = document.getElementById('name').value;
  const calle = document.getElementById('street').value;
  const telefono = document.getElementById('Telefono').value;
  const semanasTotales = document.getElementById('semanasTotales').value;
  const deuda = parseFloat(document.getElementById('debt').value)

  const referencia = document.getElementById('addReference').checked
    ? document.getElementById('reference').value
    : 'Ninguna';

  const cliente = {
    nombre,
    calle,
    deuda,
    telefono,
    referencia,
    semana: 1,
    semanasTotales,
    pagoSemanal: deuda / semanasTotales,
    totalPagado: 0, 
    deudaRestante: deuda,
    weeksPaidAmounts: [] // Inicia un arreglo vacío para los pagos semanales si no existe
  };
  clients.push(cliente);
  document.getElementById('clientDataForm').reset();
  mostrarSeccion('registro'); // Actualiza la lista de registro automáticamente
}


// Muestra las opciones de pago para un cliente específico
function mostrarOpcionesPago(index) {
  const cliente = clients[index];
  const listaPagos = document.getElementById('pagosList');

  // Crear un formulario dinámico para manejar los pagos
  listaPagos.innerHTML = `
    <p><strong>Nombre:</strong> ${cliente.nombre}</p>
    <p><strong>Semana Actual:</strong> <span id="semanaActual">${cliente.semana}</span> de ${cliente.semanasTotales}</p>
    <p><strong>Pago Semanal:</strong> $${cliente.pagoSemanal}</p>
    <p><strong>Total Pagado:</strong> $<span id="totalPagado">${cliente.totalPagado}</span></p>
    <p><strong>Devolución:</strong> $<span id="refund">0</span></p>
    <label for="paymentAmount">Monto del Pago:</label>
    <input type="number" id="paymentAmount" min="1" placeholder="Ingresa el monto" />
    <button id="payButton">Registrar Pago</button>
    <div class="output">
        <h3>Estado:</h3>
        <div id="status"></div>
    </div>
    <button onclick="renderizarListaPagos()">Volver</button>
  `;

  const payButton = document.getElementById('payButton');
  const paymentInput = document.getElementById('paymentAmount');
  const statusOutput = document.getElementById('status');
  const totalPagadoOutput = document.getElementById('totalPagado');
  const refundOutput = document.getElementById('refund');
  const semanaActualOutput = document.getElementById('semanaActual');

  // Inicializa la cantidad pagada por semana si no existe
  cliente.weeksPaidAmounts = cliente.weeksPaidAmounts || Array(cliente.semanasTotales).fill(0);

  function updateStatusDisplay() {
    const currentWeekIndex = cliente.weeksPaidAmounts.findIndex((amount) => amount < cliente.pagoSemanal);

    if (currentWeekIndex === -1) {
      statusOutput.innerText = '¡Todas las semanas están pagadas!';
      semanaActualOutput.innerText = cliente.semanasTotales;
    } else {
      const weekNumber = currentWeekIndex + 1;
      semanaActualOutput.innerText = weekNumber;
      const totalPagadoEnSemana = cliente.weeksPaidAmounts[currentWeekIndex];
      statusOutput.innerText = `Semana ${weekNumber}: Pago incompleto - Total pagado: $${totalPagadoEnSemana}`;
    }

    totalPagadoOutput.innerText = cliente.totalPagado;
    refundOutput.innerText = cliente.devolucion || 0;
  }

  payButton.addEventListener('click', () => {
    const payment = parseFloat(paymentInput.value);
    if (isNaN(payment) || payment <= 0) {
      statusOutput.innerText = 'Por favor, ingresa un monto válido.';
      return;
    }

    const currentWeekIndex = cliente.weeksPaidAmounts.findIndex((amount) => amount < cliente.pagoSemanal);
    if (currentWeekIndex === -1) {
      statusOutput.innerText = '¡Todas las semanas están pagadas!';
      return;
    }

    cliente.weeksPaidAmounts[currentWeekIndex] += payment;
    cliente.totalPagado += payment;
    cliente.deudaRestante -= payment;

    updateStatusDisplay();
  });

  updateStatusDisplay();
}
