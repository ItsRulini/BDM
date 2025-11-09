// Arrays para almacenar datos
let countries = [];
let players = [];
let selectedCountries = [];
let uploadedFiles = [];
let currentYear = null;

// ==========================================
// CARGA INICIAL DE DATOS
// ==========================================

// Cargar países dinámicamente desde la API
async function cargarPaises() {
    try {
        const response = await fetch('index.php?controller=api&action=getPaises', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            countries = data.data.map(pais => ({
                id: pais.id,
                nombre: pais.nombre,
                nacionalidad: pais.nacionalidad
            }));
            
            renderCountryList();
            loadCountrySelects();
            console.log('Países cargados exitosamente:', countries.length);
        } else {
            console.error("Error desde el API:", data.message);
            alert('Error al cargar los países: ' + data.message);
        }
    } catch (error) {
        console.error("Error al cargar los países:", error);
        alert('Error de conexión al cargar los países');
    }
}

// Cargar jugadores desde la API
async function cargarJugadores() {
    try {
        const response = await fetch('index.php?controller=api&action=getJugadores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            players = data.data.map(jugador => ({
                id: jugador.id,
                nombre: jugador.nombre,
                nacionalidad: jugador.nacionalidad
            }));
            
            loadPlayerSelects();
            console.log('Jugadores cargados exitosamente:', players.length);
        } else {
            console.error("Error desde el API:", data.message);
            alert('Error al cargar los jugadores: ' + data.message);
        }
    } catch (error) {
        console.error("Error al cargar los jugadores:", error);
        alert('Error de conexión al cargar los jugadores');
    }
}

// ==========================================
// FUNCIONES DE PAÍSES
// ==========================================

// Renderizar lista de países en el dropdown
function renderCountryList(filteredCountries = countries) {
    const countryList = document.getElementById('countryList');
    if (!countryList) return;
    
    countryList.innerHTML = '';

    if (filteredCountries.length === 0) {
        countryList.innerHTML = '<div class="country-item" style="text-align: center; color: #888;">No se encontraron países</div>';
        return;
    }

    filteredCountries.forEach(country => {
        const isSelected = selectedCountries.some(c => c.id === country.id);
        
        if (!isSelected) {
            const countryItem = document.createElement('div');
            countryItem.className = 'country-item';
            countryItem.textContent = country.nombre;
            countryItem.setAttribute('data-country-id', country.id);
            countryItem.onclick = () => selectCountry(country);
            countryList.appendChild(countryItem);
        }
    });
}

// Seleccionar país para sedes
function selectCountry(country) {
    const exists = selectedCountries.some(c => c.id === country.id);
    
    if (!exists) {
        selectedCountries.push({
            id: country.id,
            nombre: country.nombre
        });
        
        updateSelectedCountries();
        updateMundialTitle();
        renderCountryList();
        
        document.getElementById('countrySearch').value = '';
    }
}

// Remover país seleccionado
function removeCountry(countryId) {
    selectedCountries = selectedCountries.filter(c => c.id !== countryId);
    updateSelectedCountries();
    updateMundialTitle();
    renderCountryList();
}

// Actualizar países seleccionados en la UI
function updateSelectedCountries() {
    const container = document.getElementById('selectedCountries');
    
    if (selectedCountries.length === 0) {
        container.innerHTML = '<span class="placeholder-text">Ningún país seleccionado</span>';
    } else {
        container.innerHTML = selectedCountries.map(country => 
            `<div class="country-tag" data-country-id="${country.id}" onclick="removeCountry(${country.id})">
                ${country.nombre} <i class="fas fa-times"></i>
            </div>`
        ).join('');
    }
}

// Cargar países en los selects de posiciones
function loadCountrySelects() {
    const selects = [
        'campeon',
        'subcampeon',
        'tercerPuesto',
        'cuartoPuesto'
    ];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Seleccionar país...</option>';
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.id;
            option.textContent = country.nombre;
            select.appendChild(option);
        });
    });
}

// Buscar países
function handleCountrySearch() {
    const searchTerm = document.getElementById('countrySearch').value.toLowerCase();
    const filteredCountries = countries.filter(country => 
        country.nombre.toLowerCase().includes(searchTerm)
    );
    renderCountryList(filteredCountries);
}

// ==========================================
// FUNCIONES DE JUGADORES
// ==========================================

// Cargar jugadores en los selects de premios
function loadPlayerSelects() {
    const selects = [
        'balonOro',
        'balonPlata',
        'balonBronce',
        'botinOro',
        'botinPlata',
        'botinBronce',
        'guanteOro'
    ];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Seleccionar jugador...</option>';
        
        players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.id;
            const nacionalidad = countries.find(c => c.id === player.nacionalidad)?.nombre || 'N/A';
            option.textContent = `${player.nombre} (${nacionalidad})`;
            select.appendChild(option);
        });
    });
}

// ==========================================
// FUNCIONES DE TÍTULO
// ==========================================

// Actualizar título del mundial
function updateMundialTitle() {
    const titleElement = document.getElementById('mundialTitle');
    const subtitleElement = document.getElementById('mundialSubtitle');

    if (currentYear && selectedCountries.length > 0) {
        let countryText = '';
        
        if (selectedCountries.length === 1) {
            countryText = selectedCountries[0].nombre;
        } else if (selectedCountries.length === 2) {
            countryText = `${selectedCountries[0].nombre} y ${selectedCountries[1].nombre}`;
        } else {
            const lastCountry = selectedCountries[selectedCountries.length - 1].nombre;
            const otherCountries = selectedCountries.slice(0, -1).map(c => c.nombre).join(', ');
            countryText = `${otherCountries} y ${lastCountry}`;
        }
        
        titleElement.textContent = `${countryText} ${currentYear}`;
        subtitleElement.textContent = 'Mundial de la FIFA';
    } else if (currentYear) {
        titleElement.textContent = `Mundial ${currentYear}`;
        subtitleElement.textContent = 'Selecciona las sedes para completar el título';
    } else {
        titleElement.textContent = 'Mundial';
        subtitleElement.textContent = 'Selecciona el año y las sedes para ver el título';
    }
}

// Manejar cambio de año
function handleYearChange() {
    const yearInput = document.getElementById('year');
    currentYear = yearInput.value;
    updateMundialTitle();
}

// ==========================================
// FUNCIONES DE IMÁGENES
// ==========================================

// Previsualizar imagen
function previewImage(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);
    
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Vista previa">`;
        preview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

// ==========================================
// FUNCIONES DE MULTIMEDIA
// ==========================================

// Activar input de archivos
function triggerFileInput() {
    document.getElementById('multimediaInput').click();
}

// Manejar archivos seleccionados
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (uploadedFiles.length < 10) {
            uploadedFiles.push({
                file: file,
                id: Date.now() + Math.random(),
                type: getFileType(file),
                url: URL.createObjectURL(file)
            });
        }
    });

    renderMediaCarousel();
}

// Determinar tipo de archivo
function getFileType(file) {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
}

// Renderizar carrusel de multimedia
function renderMediaCarousel() {
    const carousel = document.getElementById('multimediaCarousel');
    
    carousel.innerHTML = `
    <div class="upload-placeholder" onclick="triggerFileInput()">
        <i class="fas fa-plus-circle"></i>
        <p>Agregar más archivos</p>
        <span>Imágenes, videos, documentos</span>
    </div>`;

    uploadedFiles.forEach(fileObj => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';

        let content = '';
        if (fileObj.type === 'image') {
            content = `<img src="${fileObj.url}" alt="Imagen">`;
        } else if (fileObj.type === 'video') {
            content = `<video src="${fileObj.url}" muted></video>`;
        } else {
            content = `<div class="file-icon"><i class="fas fa-file-alt"></i></div>`;
        }

        mediaItem.innerHTML = `
            ${content}
            <button class="remove-btn" onclick="removeFile(${fileObj.id})">
                <i class="fas fa-times"></i>
            </button>`;

        carousel.appendChild(mediaItem);
    });

    updateCarouselControls();
}

// Remover archivo
function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
    renderMediaCarousel();
}

// Controles del carrusel
function scrollCarousel(direction) {
    const carousel = document.getElementById('multimediaCarousel');
    const scrollAmount = 200;
    carousel.scrollLeft += direction * scrollAmount;
    
    setTimeout(updateCarouselControls, 300);
}

function updateCarouselControls() {
    const carousel = document.getElementById('multimediaCarousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (prevBtn && nextBtn) {
        prevBtn.disabled = carousel.scrollLeft <= 0;
        nextBtn.disabled = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth);
    }
}

// ==========================================
// FUNCIONES DE RESULTADOS
// ==========================================

// Toggle tiempo extra
function toggleTiempoExtra() {
    const checkbox = document.getElementById('tiempoExtra');
    const group = document.getElementById('marcadorTiempoExtraGroup');
    
    if (checkbox.checked) {
        group.style.display = 'block';
    } else {
        group.style.display = 'none';
        document.getElementById('marcadorTiempoExtra').value = '';
    }
}

// Toggle penales
function togglePenalties() {
    const checkbox = document.getElementById('penalties');
    const group = document.getElementById('marcadorFinalGroup');
    
    if (checkbox.checked) {
        group.style.display = 'block';
    } else {
        group.style.display = 'none';
        document.getElementById('marcadorFinal').value = '';
    }
}

// ==========================================
// ENVÍO DE FORMULARIO
// ==========================================

// Validar marcador
function validarMarcador(marcador) {
    if (!marcador) return true; // Opcional
    const regex = /^\d+-\d+$/;
    return regex.test(marcador);
}

// Manejar envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault();

    const year = document.getElementById('year').value;
    const descripcion = document.getElementById('descripcion').value;
    const nombreMascota = document.getElementById('nombreMascota').value;

    if (!year || year < 1930 || year > 2100) {
        alert('Por favor ingresa un año válido.');
        return;
    }

    if (selectedCountries.length === 0) {
        alert('Por favor selecciona al menos una sede.');
        return;
    }

    if (!descripcion.trim()) {
        alert('Por favor escribe una descripción.');
        return;
    }

    // Convertir imágenes a Base64
    let logoBase64 = null;
    let mascotaBase64 = null;

    const logoFile = document.getElementById('logo').files[0];
    const mascotaFile = document.getElementById('imgMascota').files[0];

    if (logoFile) {
        logoBase64 = await toBase64(logoFile);
    }

    if (mascotaFile) {
        mascotaBase64 = await toBase64(mascotaFile);
    }

    const mundialData = {
        year: parseInt(year),
        descripcion: descripcion.trim(),
        nombreMascota: nombreMascota || null,
        sedes: JSON.stringify(selectedCountries.map(c => c.id)),
        logo: logoBase64,
        imgMascota: mascotaBase64,
        campeon: document.getElementById('campeon').value || null,
        subcampeon: document.getElementById('subcampeon').value || null,
        tercerPuesto: document.getElementById('tercerPuesto').value || null,
        cuartoPuesto: document.getElementById('cuartoPuesto').value || null,
        marcador: document.getElementById('marcador').value || null,
        tiempoExtra: document.getElementById('tiempoExtra').checked,
        marcadorTiempoExtra: document.getElementById('marcadorTiempoExtra').value || null,
        penalties: document.getElementById('penalties').checked,
        muerteSubita: document.getElementById('muerteSubita').checked,
        marcadorFinal: document.getElementById('marcadorFinal').value || null,
        balonOro: document.getElementById('balonOro').value || null,
        balonPlata: document.getElementById('balonPlata').value || null,
        balonBronce: document.getElementById('balonBronce').value || null,
        botinOro: document.getElementById('botinOro').value || null,
        botinPlata: document.getElementById('botinPlata').value || null,
        botinBronce: document.getElementById('botinBronce').value || null,
        guanteOro: document.getElementById('guanteOro').value || null,
        golesMaximoGoleador: document.getElementById('golesMaximoGoleador').value || null
    };

    try {
        const response = await fetch('index.php?controller=api&action=crearMundial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mundialData)
        });

        const data = await response.json();

        if (data.success) {
            alert('¡Mundial creado exitosamente!');
            window.location.href = 'index.php?controller=admin&action=index';
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Función auxiliar para convertir archivo a Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}




// ==========================================
// CARGAR Y MOSTRAR MUNDIALES CREADOS
// ==========================================

async function cargarMundialesCreados() {
    try {
        const response = await fetch('index.php?controller=api&action=getMundiales', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            mostrarMundialesEnUI(data.data);
            console.log('Mundiales cargados:', data.data.length);
        } else {
            console.log('No hay mundiales creados todavía');
        }
    } catch (error) {
        console.error("Error al cargar los mundiales:", error);
    }
}

function mostrarMundialesEnUI(mundiales) {
    // Buscar el contenedor donde se muestran los mundiales
    // (Necesitas tener este div en tu HTML del admin)
    const container = document.getElementById('mundialesContainer');
    
    if (!container) {
        console.warn('No se encontró el contenedor de mundiales');
        return;
    }

    container.innerHTML = '';

    mundiales.forEach(mundial => {
        const sedesText = mundial.sedes && mundial.sedes.length > 0 
            ? mundial.sedes.join(', ') 
            : 'Sin sedes';

        const mundialCard = document.createElement('div');
        mundialCard.className = 'mundial-card';
        mundialCard.innerHTML = `
            <div class="mundial-header">
                ${mundial.logo ? `<img src="${mundial.logo}" alt="Logo" class="mundial-logo">` : ''}
                <h3>${sedesText} ${mundial.año}</h3>
            </div>
            <div class="mundial-body">
                <p class="mundial-descripcion">${mundial.descripcion || 'Sin descripción'}</p>
                ${mundial.nombreMascota ? `<p class="mundial-mascota">Mascota: ${mundial.nombreMascota}</p>` : ''}
            </div>
            <div class="mundial-actions">
                <button onclick="editarMundial(${mundial.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="verDetalles(${mundial.id})" class="btn-view">
                    <i class="fas fa-eye"></i> Ver detalles
                </button>
            </div>
        `;
        
        container.appendChild(mundialCard);
    });
}

function editarMundial(id) {
    window.location.href = `index.php?controller=admin&action=crearMundial&edit=${id}`;
}

function verDetalles(id) {
    // Implementar vista de detalles
    console.log('Ver detalles del mundial:', id);
}








// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', async function() {
    // Cargar datos desde la API
    await cargarPaises();
    await cargarJugadores();
    await cargarMundialesCreados();
    
    // Inicializar UI
    updateSelectedCountries();

    // Event listeners
    const yearInput = document.getElementById('year');
    if (yearInput) {
        yearInput.addEventListener('input', handleYearChange);
        yearInput.addEventListener('change', handleYearChange);
    }
    
    const countrySearch = document.getElementById('countrySearch');
    if (countrySearch) {
        countrySearch.addEventListener('input', handleCountrySearch);
    }
    
    const multimediaInput = document.getElementById('multimediaInput');
    if (multimediaInput) {
        multimediaInput.addEventListener('change', handleFileSelect);
    }
    
    const mundialForm = document.getElementById('mundialForm');
    if (mundialForm) {
        mundialForm.addEventListener('submit', handleFormSubmit);
    }

    // Verificar si es edición
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        document.getElementById('submitBtn').textContent = 'Actualizar Mundial';
        console.log('Modo edición para mundial ID:', editId);
        // TODO: Cargar datos del mundial a editar
    }
});