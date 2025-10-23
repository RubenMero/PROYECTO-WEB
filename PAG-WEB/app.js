let vehiculosRegistrados = [
    { id: '1309876543', tipo: 'Auto', placa: 'PCL-0543', nombre: 'Juan Pérez' },
    { id: '1301234567', tipo: 'Moto', placa: 'MNS-987', nombre: 'Ana Gómez' }
];

let ingresosActivos = [
    { id: '1309876543', tipo: 'Auto', placa: 'PCL-0543', horaIngreso: '07:30', estado: 'Dentro' },
    { id: '1301234567', tipo: 'Moto', placa: 'MNS-987', horaIngreso: '08:15', estado: 'Dentro' },
];

let allRecords = [
    { id: '1309876543', nombre: 'Juan Pérez', placa: 'PCL-0543', tipo: 'Auto', horaIngreso: '07:30', horaSalida: '10:00', estado: 'Fuera' },
    { id: '1301234567', nombre: 'Ana Gómez', placa: 'MNS-987', tipo: 'Moto', horaIngreso: '08:15', horaSalida: null, estado: 'Dentro' },
    { id: '1302223334', nombre: 'Carlos Ruiz', placa: 'ABC-123', tipo: 'Camioneta', horaIngreso: '09:00', horaSalida: '11:00', estado: 'Fuera' },
    { id: '1304445556', nombre: 'Luisa Mora', placa: 'XYZ-900', tipo: 'Auto', horaIngreso: '10:30', horaSalida: null, estado: 'Dentro' },
    { id: '1309876543', nombre: 'Juan Pérez', placa: 'PCL-0543', tipo: 'Auto', horaIngreso: '12:00', horaSalida: '14:30', estado: 'Fuera' },
];

let usuarios = [
    { id: 1, nombre: 'Admin ULEAM', usuario: 'admin', rol: 'Administrador', estado: 'Activo' },
    { id: 2, nombre: 'Guardia Principal', usuario: 'guardia01', rol: 'Guardia', estado: 'Activo' },
    { id: 3, nombre: 'Supervisor Turno Noche', usuario: 'super01', rol: 'Supervisor', estado: 'Inactivo' },
];
let nextUserId = 4;
let editingUserId = null;

const reportData = {
    totalIngresos: 540,
    vehiculosActivos: 15,
    tiposVehiculo: [
        { tipo: 'Auto', count: 320 },
        { tipo: 'Camioneta', count: 150 },
        { tipo: 'Moto', count: 70 }
    ],
    topPlacas: [
        { placa: 'PCL-0543', count: 8 },
        { placa: 'ABC-123', count: 5 },
        { placa: 'XYZ-900', count: 3 }
    ]
};

const credentials = {
    'admin@uleam.edu.ec': 'admin12345',
    'admin': 'admin12345',
    'guardia': 'guardia12345',
    'guardia@uleam.edu.ec': 'guardia12345',
    'supervisor@uleam.edu.ec': 'supervisor12345',
    'supervisor': 'supervisor12345'
};

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    // Si no existe el contenedor de notificación, usa un alert básico
    if (!notification) { 
        console.log(`[${type.toUpperCase()}] ${message}`);
        return;
    }

    notification.textContent = message;
    notification.className = ''; 
    notification.classList.add(type, 'show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showError(inputElement, message) {
    const group = inputElement.closest('.input-group');
    let errorMessage;

    if (group) {
        errorMessage = group.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            group.appendChild(errorMessage);
        }
    } 
   
    else {
        errorMessage = document.getElementById(inputElement.id + 'Error');
    }

    if (!errorMessage) {
        console.error(`No se encontró contenedor de error para ${inputElement.id}`);
        return;
    }

    inputElement.classList.remove('valid');
    inputElement.classList.add('error');
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function clearError(inputElement) {
    const group = inputElement.closest('.input-group');
    let errorMessage;

    if (group) {
        errorMessage = group.querySelector('.error-message');
    } 

    else {
        errorMessage = document.getElementById(inputElement.id + 'Error');
    }

    if (errorMessage) {
        errorMessage.classList.remove('show');
    }
    inputElement.classList.remove('error');
    inputElement.classList.add('valid');
}

function logout() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        localStorage.removeItem('usuarioActivo');
        localStorage.removeItem('recordarSesion');
        showNotification('✓ Sesión cerrada exitosamente', 'success');
        window.location.href = window.location.origin + '/login.html'; 
    }
}
window.logout = logout; 

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@uleam\.edu\.ec$/;
    return regex.test(email);
}

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        if (localStorage.getItem('recordarSesion') === 'true' && localStorage.getItem('usuarioActivo')) {
            window.location.href = 'dashboard.html';
        }
        return;
    }

    const usuarioInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('password');
    const recordarCheckbox = document.getElementById('recordarSesion');
    const btnLogin = document.getElementById('btnLogin');
    const togglePassword = document.getElementById('togglePassword');
    
    if (localStorage.getItem('recordarSesion') === 'true' && localStorage.getItem('usuarioActivo')) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    usuarioInput.addEventListener('input', () => {
        const value = usuarioInput.value.trim();
        
        if (!value) {
            clearError(usuarioInput);
        } else if (value.includes('@')) {
            if (!validarEmail(value)) {
                showError(usuarioInput, 'Debe usar un correo institucional (@uleam.edu.ec)');
            } else {
                clearError(usuarioInput); 
            }
        } else if (value.length < 3) {
            showError(usuarioInput, 'El usuario debe tener al menos 3 caracteres');
        } else {
            clearError(usuarioInput);
        }
    });


    passwordInput.addEventListener('input', () => {
        const value = passwordInput.value;
        
        if (!value) {
            clearError(passwordInput);
        } else if (value.length < 8) {
            showError(passwordInput, 'La contraseña debe tener al menos 8 caracteres');
        } else {
            clearError(passwordInput); 
        }
    });
    
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.textContent = type === 'password' ? '👁' : '🙈';
        });
    }

    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt('Ingrese su correo institucional (@uleam.edu.ec):');
            
            if (email) {
                if (validarEmail(email)) {
                    showNotification('✓ Se ha enviado un enlace de recuperación', 'info');
                } else {
                    showNotification('⚠ Por favor ingrese un correo institucional válido', 'warning');
                }
            }
        });
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuario = usuarioInput.value.trim();
        const password = passwordInput.value;
        let isValid = true;

        if (!usuario) {
            showError(usuarioInput, 'El usuario o correo es obligatorio');
            isValid = false;
        }
        if (!password) {
            showError(passwordInput, 'La contraseña es obligatoria');
            isValid = false;
        }

        if (!isValid) return;

        if (credentials[usuario] && credentials[usuario] === password) {
            let userName = usuario;
            if (usuario.includes('@')) {
                userName = usuario.split('@')[0];
            }
            
            localStorage.setItem('usuarioActivo', userName);
            localStorage.setItem('ultimoAcceso', new Date().toLocaleString('es-EC'));
            
            if (recordarCheckbox.checked) {
                localStorage.setItem('recordarSesion', 'true');
            }
            
            btnLogin.disabled = true;
            btnLogin.textContent = '✓ Acceso concedido';
            btnLogin.classList.add('success');
            
            clearError(usuarioInput);
            clearError(passwordInput);
            usuarioInput.classList.add('valid');
            passwordInput.classList.add('valid');


            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1200);
            
        } else {
 
            showError(passwordInput, 'Usuario o contraseña incorrectos');
            passwordInput.value = '';
            
            btnLogin.classList.add('error');
            btnLogin.textContent = '✗ Credenciales incorrectas';
            
            setTimeout(() => {
                btnLogin.classList.remove('error');
                btnLogin.textContent = 'Iniciar Sesión';
            }, 2000);
        }
    });


    usuarioInput.addEventListener('focus', () => clearError(usuarioInput));
    passwordInput.addEventListener('focus', () => clearError(passwordInput));
}

function initDashboardPage() {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
        const height = bar.getAttribute('data-height');
        bar.style.setProperty('--bar-height', height);
        setTimeout(() => {
            bar.style.animation = 'growBar 1s ease-out forwards';
        }, index * 100);
    });
}

function agregarIngresoTabla(id, tipo, placa) {
    const hora = new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
    ingresosActivos.push({ id, tipo, placa, horaIngreso: hora, estado: 'Dentro' });
    allRecords.push({ id, nombre: 'Desconocido', placa, tipo, horaIngreso: hora, horaSalida: null, estado: 'Dentro' });
}

function initRegistroIngresoPage() {
    const ingresoForm = document.getElementById('ingresoForm');
    if (!ingresoForm) return;

    const idConductor = document.getElementById('idConductor');
    const tipoVehiculo = document.getElementById('tipoVehiculo');
    const placa = document.getElementById('placa');
    
    document.querySelectorAll('#ingresoForm input, #ingresoForm select').forEach(input => {
        input.addEventListener('input', function() {
            clearError(this);
            if (this.id === 'placa') { this.value = this.value.toUpperCase(); }
        });
    });

    ingresoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const idValue = idConductor.value.trim();
        const tipoValue = tipoVehiculo.value;
        const placaValue = placa.value.trim();
        let isValid = true;

        if (!idValue || !/^\d{10}$/.test(idValue)) {
            showError(idConductor, 'El ID debe tener exactamente 10 números');
            isValid = false;
        } else { clearError(idConductor); }

        if (!tipoValue) {
            showError(tipoVehiculo, 'El tipo es obligatorio');
            isValid = false;
        } else { clearError(tipoVehiculo); }

        const placaRegex = /^[A-Z]{3}-[0-9]{3,4}$/;
        if (!placaValue || !placaRegex.test(placaValue)) {
            showError(placa, 'Formato incorrecto. Use: ABC-123 o ABC-1234');
            isValid = false;
        } else { clearError(placa); }
        
        if (isValid) {
            agregarIngresoTabla(idValue, tipoValue, placaValue);
            showNotification(`✓ Ingreso registrado: ${placaValue}`, 'success');
            this.reset();
            idConductor.classList.remove('valid', 'error');
            tipoVehiculo.classList.remove('valid', 'error');
            placa.classList.remove('valid', 'error');
        }
    });

    ingresoForm.addEventListener('reset', function() {
        setTimeout(() => {
            document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
            document.querySelectorAll('input, select').forEach(el => el.classList.remove('valid', 'error'));
        }, 0);
    });
}

function buscarVehiculo() {
    const placaInput = document.getElementById('buscarPlaca');
    const placa = placaInput.value.trim().toUpperCase();
    const infoCard = document.getElementById('infoDisplayCard');

    const registro = ingresosActivos.find(i => i.placa === placa && i.estado === 'Dentro');

    if (registro) {
        document.getElementById('infoID').textContent = registro.id;
        document.getElementById('infoTipo').textContent = registro.tipo;
        document.getElementById('infoIngreso').textContent = registro.horaIngreso;
        document.getElementById('placaSalida').textContent = registro.placa;
        document.getElementById('horaSalidaActual').textContent = new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
        
        infoCard.style.display = 'block';
        document.getElementById('idSalida').value = ''; 
        document.getElementById('idSalida').classList.remove('error', 'valid');
        document.querySelector('#formRegistroSalida .error-message')?.classList.remove('show');
        showNotification(`✓ Vehículo ${placa} encontrado`, 'success');
        
    } else {
        infoCard.style.display = 'none';
        showNotification(`✗ Vehículo ${placa} no está registrado como 'Dentro'`, 'error');
    }
}

function cancelarSalida() {
    document.getElementById('buscarPlaca').value = '';
    document.getElementById('infoDisplayCard').style.display = 'none';
    document.getElementById('idSalida').value = '';
    document.getElementById('idSalida').classList.remove('error', 'valid');
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
}

function initRegistroSalidaPage() {
    const buscarPlacaBtn = document.getElementById('buscarPlacaBtn');
    const formSalida = document.getElementById('formRegistroSalida');
    const buscarPlacaInput = document.getElementById('buscarPlaca');
    
    if (!buscarPlacaBtn || !formSalida) return;

    buscarPlacaInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    buscarPlacaBtn.addEventListener('click', buscarVehiculo);

    formSalida.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const idSalidaInput = document.getElementById('idSalida');
        const idSalida = idSalidaInput.value.trim();
        const placaSalida = document.getElementById('placaSalida').textContent;
        const infoID = document.getElementById('infoID').textContent;
        
        let isValid = true;
        clearError(idSalidaInput);

        if (!idSalida) {
            showError(idSalidaInput, 'El ID es obligatorio');
            isValid = false;
        } else if (!/^\d{10}$/.test(idSalida)) {
            showError(idSalidaInput, 'El ID debe tener exactamente 10 números');
            isValid = false;
        } 
        
        if (isValid && idSalida !== infoID) {
            showError(idSalidaInput, 'El ID no coincide con el registrado');
            isValid = false;
        }
        
        if (isValid) {
            const index = ingresosActivos.findIndex(i => i.placa === placaSalida && i.estado === 'Dentro');
            if (index !== -1) {
                ingresosActivos[index].estado = 'Fuera'; 
                ingresosActivos[index].horaSalida = document.getElementById('horaSalidaActual').textContent;
                
                const allIndex = allRecords.findIndex(r => r.placa === placaSalida && r.estado === 'Dentro');
                if (allIndex !== -1) {
                    allRecords[allIndex].estado = 'Fuera';
                    allRecords[allIndex].horaSalida = ingresosActivos[index].horaSalida;
                }
                ingresosActivos.splice(index, 1);
            }
            showNotification(`✓ Salida registrada: ${placaSalida}`, 'success');
            cancelarSalida();
        }
    });

    window.buscarVehiculo = buscarVehiculo;
    window.cancelarSalida = cancelarSalida;
}

function renderTable(records) {
    const tbody = document.getElementById('ingresosTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    records.forEach(record => {
        const row = tbody.insertRow();
        row.insertCell().textContent = record.id;
        row.insertCell().textContent = record.nombre;
        row.insertCell().textContent = record.placa;
        row.insertCell().textContent = record.tipo;
        row.insertCell().textContent = record.horaIngreso;
        row.insertCell().textContent = record.horaSalida || 'N/A';
        
        const estadoCell = row.insertCell();
        const badge = document.createElement('span');
        badge.classList.add('badge');
        badge.textContent = record.estado;
        
        badge.classList.add(record.estado === 'Dentro' ? 'badge-success' : 'badge-danger');
        estadoCell.appendChild(badge);
    });

    document.getElementById('pageInfo').textContent = `Mostrando ${records.length} registro(s) en total`;
}

function aplicarFiltros() {
    const searchID = document.getElementById('searchID').value.trim();
    const searchPlaca = document.getElementById('searchPlaca').value.trim().toUpperCase();
    const searchTipo = document.getElementById('searchTipo').value;

    const filteredRecords = allRecords.filter(record => {
        const idMatch = !searchID || record.id.includes(searchID);
        const placaMatch = !searchPlaca || record.placa.includes(searchPlaca);
        const tipoMatch = !searchTipo || searchTipo === 'todos' || record.tipo === searchTipo;

        return idMatch && placaMatch && tipoMatch;
    });

    renderTable(filteredRecords);
    showNotification(`Filtro aplicado: ${filteredRecords.length} resultados`, 'info');
}

function cambiarPagina(direccion) {
    alert("La paginación avanzada no está implementada en este ejemplo. Usa los filtros de búsqueda.");
}

function initConsultaIngresosPage() {
    const searchBtn = document.getElementById('searchBtn');
    if (!searchBtn) return;

    renderTable(allRecords);

    searchBtn.addEventListener('click', aplicarFiltros);
    document.getElementById('searchPlaca').addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    const fechaActual = '2025-10-23';
    document.getElementById('searchFecha').value = fechaActual; 
    
    window.aplicarFiltros = aplicarFiltros;
    window.cambiarPagina = cambiarPagina;
}

function renderizarTabla() {
    const tbody = document.getElementById('vehiculosTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    vehiculosRegistrados.forEach(vehiculo => {
        const row = tbody.insertRow();
        row.insertCell().textContent = vehiculo.id;
        row.insertCell().textContent = vehiculo.nombre;
        row.insertCell().textContent = vehiculo.placa;
        row.insertCell().textContent = vehiculo.tipo;
        
        const actionCell = row.insertCell();
        actionCell.innerHTML = `
            <button class="btn btn-warning btn-sm" onclick="alert('Editar ${vehiculo.placa}')">✏️ Editar</button>
        `;
    });
}

function exportarCSV() {
    if (vehiculosRegistrados.length === 0) {
        showNotification('No hay datos para exportar', 'warning');
        return;
    }

    const headers = ['ID', 'Nombre Conductor', 'Placa', 'Tipo Vehículo'];
    const csvContent = [
        headers.join(','),
        ...vehiculosRegistrados.map(v => [v.id, v.nombre, v.placa, v.tipo].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `vehiculos_registrados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('✓ Vehículos exportados a CSV', 'success');
}

function initVehiculosRegistradosPage() {
    renderizarTabla();
    window.exportarCSV = exportarCSV;
}

function renderizarTablaUsuarios() {
    const tbody = document.getElementById('usuariosTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
        const row = tbody.insertRow();
        row.insertCell().textContent = usuario.id;
        row.insertCell().textContent = usuario.nombre;
        row.insertCell().textContent = usuario.usuario;
        row.insertCell().textContent = usuario.rol;
        
        const estadoCell = row.insertCell();
        const badge = document.createElement('span');
        badge.classList.add('badge');
        badge.textContent = usuario.estado;
        badge.classList.add(usuario.estado === 'Activo' ? 'badge-success' : 'badge-danger');
        estadoCell.appendChild(badge);

        const actionCell = row.insertCell();
        actionCell.innerHTML = `
            <button class="btn btn-warning btn-sm" onclick="abrirModal('editar', ${usuario.id})">✏️ Editar</button>
            <button class="btn btn-info btn-sm" onclick="cambiarEstado(${usuario.id})">🔄 Estado</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">🗑️ Eliminar</button>
        `;
    });
}

function abrirModal(mode = 'crear', id = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const modalTitle = document.getElementById('modalTitulo');
    const passwordInput = document.getElementById('password');
    form.reset();
    editingUserId = id;

    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('input, select').forEach(el => el.classList.remove('valid', 'error'));

    if (mode === 'crear') {
        modalTitle.textContent = 'Crear Nuevo Usuario';
        passwordInput.required = true;
        passwordInput.value = '';
    } else if (mode === 'editar') {
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) return;
        
        document.getElementById('id').value = usuario.id;
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('usuario').value = usuario.usuario;
        document.getElementById('rol').value = usuario.rol;
        passwordInput.value = '*****'; 
        passwordInput.required = false; 
        modalTitle.textContent = 'Editar Usuario';
    }

    modal.classList.add('show');
}

function cerrarModal() {
    document.getElementById('userModal').classList.remove('show');
    document.getElementById('userForm').reset();
    editingUserId = null;
}

function guardarUsuario(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const rol = document.getElementById('rol').value;
    const passwordInput = document.getElementById('password');

    let isValid = true;

    if (!nombre) { showError(document.getElementById('nombre'), 'El nombre es obligatorio'); isValid = false; } else { clearError(document.getElementById('nombre')); }
    
    if (!usuario) { showError(document.getElementById('usuario'), 'El usuario es obligatorio'); isValid = false; } else { clearError(document.getElementById('usuario')); }
    
    if (passwordInput.required && !passwordInput.value) {
         showError(passwordInput, 'La contraseña es obligatoria'); isValid = false;
    } else { clearError(passwordInput); }

    if (!isValid) return;

    if (editingUserId) {
        const index = usuarios.findIndex(u => u.id === editingUserId);
        if (index !== -1) {
            usuarios[index].nombre = nombre;
            usuarios[index].usuario = usuario;
            usuarios[index].rol = rol;
            showNotification('✓ Usuario editado correctamente', 'success');
        }
    } else {
        const nuevoUsuario = {
            id: nextUserId++,
            nombre: nombre,
            usuario: usuario,
            rol: rol,
            estado: 'Activo'
        };
        usuarios.push(nuevoUsuario);
        showNotification('✓ Usuario creado correctamente', 'success');
    }

    renderizarTablaUsuarios();
    cerrarModal();
}

function cambiarEstado(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    const nuevoEstado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';

    if (confirm(`¿Desea cambiar el estado de ${usuario.nombre} a ${nuevoEstado}?`)) {
        usuario.estado = nuevoEstado;
        renderizarTablaUsuarios();
        showNotification(`Estado de ${usuario.nombre} cambiado a ${nuevoEstado}`, 'info');
    }
}

function eliminarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    if (confirm(`¿Eliminar al usuario ${usuario.nombre}? Esta acción es irreversible.`)) {
        usuarios = usuarios.filter(u => u.id !== id);
        renderizarTablaUsuarios();
        showNotification('✓ Usuario eliminado correctamente', 'success');
    }
}

function initGestionUsuariosPage() {
    renderizarTablaUsuarios();

    window.abrirModal = abrirModal;
    window.cerrarModal = cerrarModal;
    window.guardarUsuario = guardarUsuario;
    window.cambiarEstado = cambiarEstado;
    window.eliminarUsuario = eliminarUsuario;

    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', guardarUsuario);
    }
}

function generarReporte() {
    const tipoReporte = document.getElementById('tipoReporte').value;
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;
    const visualizationDiv = document.getElementById('reporteVisualizacion');

    if (!tipoReporte || !fechaDesde || !fechaHasta) {
        showNotification('Todos los campos son obligatorios.', 'warning');
        return;
    }

    let content = `<div class="report-section-title">Reporte de ${tipoReporte} - Del ${fechaDesde} al ${fechaHasta}</div>`;

    if (tipoReporte === 'General') {
        content += `
            <div class="stats-grid-report">
                <div class="stat-card-report">
                    <div class="stat-value">${reportData.totalIngresos}</div>
                    <div class="stat-label">Total Ingresos Periodo</div>
                </div>
                <div class="stat-card-report">
                    <div class="stat-value">${reportData.vehiculosActivos}</div>
                    <div class="stat-label">Vehículos Activos Hoy</div>
                </div>
            </div>
        `;
    } else if (tipoReporte === 'Placas') {
        content += `
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>Placa</th><th>Frecuencia</th></tr></thead>
                    <tbody>
                        ${reportData.topPlacas.map(p => `<tr><td>${p.placa}</td><td>${p.count}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (tipoReporte === 'TipoVehiculo') {
         content += `
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>Tipo Vehículo</th><th>Conteo</th></tr></thead>
                    <tbody>
                        ${reportData.tiposVehiculo.map(v => `<tr><td>${v.tipo}</td><td>${v.count}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        content += `<p>Visualización de reporte para el tipo **${tipoReporte}** no implementada en la simulación.</p>`;
    }

    visualizationDiv.innerHTML = content;
    showNotification(`✓ Reporte de ${tipoReporte} generado`, 'success');
}

function imprimirReporte() {
    if (document.getElementById('reporteVisualizacion').innerHTML.trim().includes('Use los controles')) {
        showNotification('Debe generar un reporte primero.', 'warning');
        return;
    }
    window.print();
}

function descargarJSON() {
    if (document.getElementById('reporteVisualizacion').innerHTML.trim().includes('Use los controles')) {
        showNotification('Debe generar un reporte primero.', 'warning');
        return;
    }
    const tipoReporte = document.getElementById('tipoReporte').value;
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;

    const data = { reporte: tipoReporte, fechaDesde, fechaHasta, datos: reportData };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_${tipoReporte}_${fechaDesde}_${fechaHasta}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('✓ Datos descargados en formato JSON', 'success');
}

function initReportesPage() {
    window.generarReporte = generarReporte;
    window.imprimirReporte = imprimirReporte;
    window.descargarJSON = descargarJSON;

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaDesde').value = '2025-10-01'; 
    document.getElementById('fechaHasta').value = today;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    const usuarioActivo = localStorage.getItem('usuarioActivo');
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement && usuarioActivo) {
        userNameElement.textContent = `👤 ${usuarioActivo}`;
    }

    if (currentPage === 'login.html' || currentPage === '') {
        initLoginPage();
    } else if (currentPage === 'dashboard.html') {
        initDashboardPage();
    } else if (currentPage === 'registro-ingreso.html') {
        initRegistroIngresoPage();
    } else if (currentPage === 'registro-salida.html') {
        initRegistroSalidaPage();
    } else if (currentPage === 'consulta-ingresos.html') {
        initConsultaIngresosPage();
    } else if (currentPage === 'vehiculos-registrados.html') {
        initVehiculosRegistradosPage();
    } else if (currentPage === 'gestion-usuarios.html') {
        initGestionUsuariosPage();
    } else if (currentPage === 'reportes.html') {
        initReportesPage();
    }
});