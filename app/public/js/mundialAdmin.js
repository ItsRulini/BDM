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
                nombre: pais.nombre
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
            option.textContent = `${player.nombre} (${player.nacionalidad || 'N/A'})`;
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
function handleFormSubmit(event) {
    event.preventDefault();

    // Recopilar datos básicos
    const year = document.getElementById('year').value;
    const descripcion = document.getElementById('descripcion').value;
    const nombreMascota = document.getElementById('nombreMascota').value;

    // Validaciones básicas
    if (!year || year < 1900 || year > 2100) {
        alert('Por favor ingresa un año válido entre 1900 y 2100.');
        return;
    }

    if (selectedCountries.length === 0) {
        alert('Por favor selecciona al menos una sede.');
        return;
    }

    if (!descripcion.trim()) {
        alert('Por favor escribe una descripción del mundial.');
        return;
    }

    // Validar marcadores
    const marcador = document.getElementById('marcador').value;
    const marcadorTiempoExtra = document.getElementById('marcadorTiempoExtra').value;
    
    if (marcador && !validarMarcador(marcador)) {
        alert('El marcador debe tener el formato: goles-goles (Ej: 3-3)');
        return;
    }

    if (marcadorTiempoExtra && !validarMarcador(marcadorTiempoExtra)) {
        alert('El marcador de tiempo extra debe tener el formato: goles-goles (Ej: 3-3)');
        return;
    }

    // Recopilar posiciones
    const posiciones = {
        campeon: document.getElementById('campeon').value,
        subcampeon: document.getElementById('subcampeon').value,
        tercerPuesto: document.getElementById('tercerPuesto').value,
        cuartoPuesto: document.getElementById('cuartoPuesto').value
    };

    // Recopilar resultados
    const resultados = {
        marcador: marcador,
        tiempoExtra: document.getElementById('tiempoExtra').checked,
        marcadorTiempoExtra: marcadorTiempoExtra,
        penalties: document.getElementById('penalties').checked,
        muerteSubita: document.getElementById('muerteSubita').checked,
        marcadorFinal: document.getElementById('marcadorFinal').value
    };

    // Recopilar premios
    const premios = {
        balonOro: document.getElementById('balonOro').value,
        balonPlata: document.getElementById('balonPlata').value,
        balonBronce: document.getElementById('balonBronce').value,
        botinOro: document.getElementById('botinOro').value,
        botinPlata: document.getElementById('botinPlata').value,
        botinBronce: document.getElementById('botinBronce').value,
        guanteOro: document.getElementById('guanteOro').value
    };

    // Recopilar máxima cantidad de goles anotados
    const maxGoles = document.getElementById('golesMaximoGoleador').value;

    // Preparar FormData para envío
    const formData = new FormData();
    formData.append('year', parseInt(year));
    formData.append('descripcion', descripcion.trim());
    formData.append('sedes', JSON.stringify(selectedCountries.map(c => c.id)));
    
    // Mascota
    formData.append('nombreMascota', nombreMascota);
    const imgMascota = document.getElementById('imgMascota').files[0];
    if (imgMascota) {
        formData.append('imgMascota', imgMascota);
    }

    // Logo
    const logo = document.getElementById('logo').files[0];
    if (logo) {
        formData.append('logo', logo);
    }

    // Posiciones
    Object.keys(posiciones).forEach(key => {
        if (posiciones[key]) {
            formData.append(key, posiciones[key]);
        }
    });

    // Resultados
    Object.keys(resultados).forEach(key => {
        if (resultados[key] !== '' && resultados[key] !== false) {
            formData.append(key, resultados[key]);
        }
    });

    // Premios
    Object.keys(premios).forEach(key => {
        if (premios[key]) {
            formData.append(key, premios[key]);
        }
    });

    // Máxima cantidad de goles
    formData.append('golesMaximoGoleador', maxGoles);

    // Multimedia adicional
    uploadedFiles.forEach((fileObj, index) => {
        formData.append(`multimedia_${index}`, fileObj.file);
    });

    console.log('Datos del mundial a crear:');
    console.log('Año:', year);
    console.log('Sedes:', selectedCountries);
    console.log('Posiciones:', posiciones);
    console.log('Resultados:', resultados);
    console.log('Premios:', premios);
    
    // TODO: Enviar al backend
    /*
    fetch('index.php?controller=admin&action=crearMundial', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Mundial creado exitosamente');
            window.location.href = 'index.php?controller=admin&action=index';
        } else {
            alert('Error al crear mundial: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    });
    */

    // Simulación de éxito
    alert(`¡Mundial "${selectedCountries.map(c => c.nombre).join(' y ')} ${year}" listo para crear!`);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos desde la API
    cargarPaises();
    cargarJugadores();
    
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