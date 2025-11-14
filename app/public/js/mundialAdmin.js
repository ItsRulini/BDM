// Arrays para almacenar datos
let countries = [];
let players = [];
let selectedCountries = [];
let uploadedFiles = [];
let multimediaFiles = []; // Array para archivos multimedia
let currentYear = null;

// Variables globales para almacenar los files
let existingLogoFile = null;
let existingMascotaFile = null;

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
        
        titleElement.textContent = `Mundial ${countryText} ${currentYear}`;
        subtitleElement.textContent = `Copa del Mundo FIFA ${currentYear}`;
    } else if (currentYear) {
        titleElement.textContent = `Mundial ${currentYear}`;
        subtitleElement.textContent = 'Selecciona las sedes para ver el título completo';
    } else if (selectedCountries.length > 0) {
        titleElement.textContent = 'Mundial';
        subtitleElement.textContent = 'Selecciona el año para ver el título completo';
    } else {
        titleElement.textContent = 'Mundial';
        subtitleElement.textContent = 'Selecciona el año y las sedes para ver el título';
    }
}

// ==========================================
// FUNCIONES DE IMÁGENES
// ==========================================

// Vista previa de imagen (logo y mascota)
function previewImage(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);
    
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        event.target.value = '';
        return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
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

// Validar tipo de archivo multimedia
function validarTipoArchivo(file) {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
        'video/ogg'
    ];
    
    return allowedTypes.includes(file.type);
}

// Manejar selección de archivos multimedia
async function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    const carousel = document.getElementById('multimediaCarousel');
    
    for (const file of files) {
        // Validar tipo de archivo
        if (!validarTipoArchivo(file)) {
            alert(`El archivo "${file.name}" no es un tipo válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP) y videos (MP4, WEBM, OGG).`);
            continue;
        }

        // Validar tamaño (máx 50MB para videos, 5MB para imágenes)
        // const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
        // if (file.size > maxSize) {
        //     const maxSizeMB = file.type.startsWith('video/') ? '50MB' : '5MB';
        //     alert(`El archivo "${file.name}" supera el tamaño máximo de ${maxSizeMB}.`);
        //     continue;
        // }

        // Guardar el índice actual ANTES de hacer push
        const currentIndex = multimediaFiles.length;
        
        // Agregar archivo al array
        multimediaFiles.push(file);

        // Crear preview
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.setAttribute('data-file-index', currentIndex);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            // IMPORTANTE: Usar el índice guardado, no multimediaFiles.length - 1
            reader.onload = function(e) {
                mediaItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <button type="button" class="remove-btn" onclick="removeMultimediaFile(${currentIndex})">
                        <i class="fas fa-times"></i>
                    </button>
                    <span class="media-filename">${file.name}</span>
                `;
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            const videoURL = URL.createObjectURL(file);
            mediaItem.innerHTML = `
                <video controls>
                    <source src="${videoURL}" type="${file.type}">
                    Tu navegador no soporta el elemento de video.
                </video>
                <button type="button" class="remove-btn" onclick="removeMultimediaFile(${currentIndex})">
                    <i class="fas fa-times"></i>
                </button>
                <span class="media-filename">${file.name}</span>
            `;
        }

        // Insertar ANTES del placeholder
        const placeholder = carousel.querySelector('.upload-placeholder');
        if (placeholder) {
            carousel.insertBefore(mediaItem, placeholder);
        } else {
            carousel.appendChild(mediaItem);
        }
    }

    // Limpiar input para permitir seleccionar los mismos archivos de nuevo
    event.target.value = '';
}

// Remover archivo multimedia
function removeMultimediaFile(index) {
    // Remover del array (marcar como null en lugar de splice para mantener índices)
    if (index < 0 || index >= multimediaFiles.length) return;
    
    multimediaFiles[index] = null;

    // Actualizar el carrusel - remover solo el elemento con ese índice
    const carousel = document.getElementById('multimediaCarousel');
    const items = carousel.querySelectorAll('.media-item');
    
    items.forEach((item) => {
        const itemIndex = parseInt(item.getAttribute('data-file-index'));
        if (itemIndex === index) {
            item.remove();
        }
    });
}

// Scroll del carrusel
function scrollCarousel(direction) {
    const carousel = document.getElementById('multimediaCarousel');
    const scrollAmount = 320; // Ancho del item + margen
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// ==========================================
// FUNCIONES DE RESULTADO FINAL
// ==========================================

function handleYearChange() {
    const yearInput = document.getElementById('year');
    currentYear = yearInput.value ? parseInt(yearInput.value) : null;
    updateMundialTitle();
}

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
// ENVÍO DEL FORMULARIO
// ==========================================

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

    // Convertir imágenes a Base64 - MODIFICADO
    let logoBase64 = null;
    let mascotaBase64 = null;

    const logoFile = document.getElementById('logo').files[0];
    const mascotaFile = document.getElementById('imgMascota').files[0];

    // Usar el nuevo file si se subió, o el existente si no
    if (logoFile) {
        logoBase64 = await toBase64(logoFile);
    } else if (existingLogoFile) {
        logoBase64 = await toBase64(existingLogoFile);
    }

    if (mascotaFile) {
        mascotaBase64 = await toBase64(mascotaFile);
    } else if (existingMascotaFile) {
        mascotaBase64 = await toBase64(existingMascotaFile);
    }

    // Convertir archivos multimedia a Base64
    const multimediaBase64 = [];
    if (multimediaFiles.length > 0) {
        for (let i = 0; i < multimediaFiles.length; i++) {
            const file = multimediaFiles[i];
            
            // Saltar archivos eliminados (null)
            if (file === null) continue;
            
            try {
                const base64 = await toBase64(file);
                multimediaBase64.push(base64);
            } catch (error) {
                console.error('Error al convertir archivo multimedia:', error);
                alert(`Error al procesar el archivo "${file.name}"`);
                return;
            }
        }
    }

    const mundialData = {
        year: parseInt(year),
        descripcion: descripcion.trim(),
        nombreMascota: nombreMascota || null,
        sedes: JSON.stringify(selectedCountries.map(c => c.id)),
        logo: logoBase64,
        imgMascota: mascotaBase64,
        multimedia: multimediaBase64, // Agregar multimedia al objeto
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

    let action = '';

    if (!mundialId) { // Nuevo mundial
        action = 'crearMundial';
    } else { // Edición de mundial existente
        action = 'actualizarMundial';
        mundialData.id = mundialId;
    }
    //return;
    
    try {
        const response = await fetch(`index.php?controller=api&action=${action}`, {
            method: !mundialId ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mundialData)
        });

        const data = await response.json();

        if (data.success) {
            !mundialId ? alert('¡Mundial creado exitosamente!') : alert('¡Mundial actualizado exitosamente!');
            window.location.href = 'index.php?controller=admin&action=index';
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de en el servidor al procesar la solicitud.');
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


function editarMundial(id) {
    window.location.href = `index.php?controller=admin&action=crearMundial&edit=${id}`;
}

async function loadMundialActual(id) {
    try {
        const response = await fetch(`index.php?controller=api&action=getMundial&id=${id}`);
        const data = await response.json();
        
        if (!data.success) {
            console.error('Error al cargar el mundial:', data.message);
            alert('No se pudo cargar el mundial.');
            return;
        }
        
        const mundial = data.data;

        populateMundialForm(mundial, id);
        cargarSedesSeleccionadas(data.sedes);
        loadMultimediaMundial(id);
        
    } catch (error) {
        console.error('Error al cargar el mundial:', error);
    }
}

async function populateMundialForm(mundial, id) {
    // ======== Información básica ========
    document.getElementById('year').value = mundial.año;
    currentYear = mundial.año;
    updateMundialTitle();

    document.getElementById('descripcion').value = mundial.descripcion || '';
    document.getElementById('nombreMascota').value = mundial.nombreMascota || '';

    // ======== Logo ========
    if (mundial.logo) {
        const logoPreview = document.getElementById('logoPreview');
        logoPreview.innerHTML = `<img src="${mundial.logo}" alt="Logo del Mundial">`;
        logoPreview.classList.add('has-image');

        // Convertir la imagen existente a File
        try {
            const response = await fetch(mundial.logo);
            const blob = await response.blob();
            existingLogoFile = new File([blob], 'logo_existente.jpg', { type: blob.type });
        } catch (error) {
            console.error('Error cargando logo existente:', error);
        }
    }

    // ======== Imagen Mascota ========
    if (mundial.imgMascota) {
        const mascotaPreview = document.getElementById('mascotaPreview');
        mascotaPreview.innerHTML = `<img src="${mundial.imgMascota}" alt="Mascota del Mundial">`;
        mascotaPreview.classList.add('has-image');

        // Convertir la imagen existente a File
        try {
            const response = await fetch(mundial.imgMascota);
            const blob = await response.blob();
            existingMascotaFile = new File([blob], 'mascota_existente.jpg', { type: blob.type });
        } catch (error) {
            console.error('Error cargando mascota existente:', error);
        }
    }

    // ======== Posiciones finales ========
    const posiciones = [
        { id: 'campeon', value: mundial.campeon },
        { id: 'subcampeon', value: mundial.subcampeon },
        { id: 'tercerPuesto', value: mundial.tercerPuesto },
        { id: 'cuartoPuesto', value: mundial.cuartoPuesto }
    ];
    posiciones.forEach(p => {
        const select = document.getElementById(p.id);
        if (select && p.value) select.value = p.value;
    });

    // ======== Resultado final ========
    document.getElementById('marcador').value = mundial.marcador || '';

    if (mundial.tiempoExtra) {
        document.getElementById('tiempoExtra').checked = true;
        document.getElementById('marcadorTiempoExtraGroup').style.display = 'block';
        document.getElementById('marcadorTiempoExtra').value = mundial.marcadorTiempoExtra || '';
    }

    if (mundial.penalties) {
        document.getElementById('penalties').checked = true;
        document.getElementById('marcadorFinalGroup').style.display = 'block';
        document.getElementById('marcadorFinal').value = mundial.marcadorFinal || '';
    }

    if (mundial.muerteSubita) {
        document.getElementById('muerteSubita').checked = true;
    }

    // ======== Premios individuales ========
    const premios = [
        { id: 'balonOro', value: mundial.balonOro },
        { id: 'balonPlata', value: mundial.balonPlata },
        { id: 'balonBronce', value: mundial.balonBronce },
        { id: 'botinOro', value: mundial.botinOro },
        { id: 'botinPlata', value: mundial.botinPlata },
        { id: 'botinBronce', value: mundial.botinBronce },
        { id: 'guanteOro', value: mundial.guanteOro }
    ];
    premios.forEach(p => {
        const select = document.getElementById(p.id);
        if (select && p.value) select.value = p.value;
    });

    document.getElementById('golesMaximoGoleador').value = mundial.maxGoles || '';

    // ======== Ajustar el botón principal ========
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Guardar Cambios';
    // submitBtn.onclick = async (e) => {
    //     e.preventDefault();
    //     await actualizarMundial(id);
    // };
}

async function cargarSedesSeleccionadas(sedes) {
    // ======== Sedes ========
    if (Array.isArray(sedes)) {
        selectedCountries = sedes.map(sedeId => {
            const country = countries.find(c => c.id === parseInt(sedeId));
            console.log('Buscando país para sede ID:', sedeId, 'Encontrado:', country);
            if (country) {
                return {
                    id: country.id,
                    nombre: country.nombre
                };
            }
            return null;
        }).filter(c => c !== null);

        console.log('Sedes cargadas:', selectedCountries);
        updateSelectedCountries();
        updateMundialTitle();
        renderCountryList();
    }
}

// Función auxiliar para obtener extensión del archivo
function getFileExtension(mimeType) {
    const extensions = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/ogg': 'ogg',
    };
    return extensions[mimeType] || 'bin';
}

// Cargar multimedia del mundial desde la BD
async function loadMultimediaMundial(id) {
    try {
        console.log('Cargando multimedia del mundial ID:', id);
        
        const response = await fetch(`index.php?controller=api&action=getMultimediaMundial&id=${id}`);
        const data = await response.json();
        
        if (!data.success) {
            console.error('Error al cargar multimedia del mundial:', data.message);
            return;
        }

        const multimedia = data.data;
        console.log('Multimedia recibida:', multimedia);
        
        if (Array.isArray(multimedia) && multimedia.length > 0) {
            const carousel = document.getElementById('multimediaCarousel');
            const placeholder = carousel.querySelector('.upload-placeholder');

            // Limpiar array existente
            multimediaFiles = [];

            for (const item of multimedia) {
                try {
                    // Convertir URL a File object
                    const response = await fetch(item.url);
                    const blob = await response.blob();
                    
                    // Crear File object con metadata
                    const file = new File([blob], 
                        item.filename || `multimedia_${item.id}.${getFileExtension(blob.type)}`, 
                        { type: blob.type }
                    );
                    
                    // Guardar información adicional si la necesitas
                    file.dbId = item.id; // ID de la BD
                    file.existingUrl = item.url; // URL original
                    
                    // Agregar al array
                    const currentIndex = multimediaFiles.length;
                    multimediaFiles.push(file);

                    // Crear elemento visual
                    const mediaItem = document.createElement('div');
                    mediaItem.className = 'media-item';
                    mediaItem.setAttribute('data-file-index', currentIndex);
                    mediaItem.setAttribute('data-bd-id', item.id);

                    let mediaContent = '';
                    if (blob.type.startsWith('image')) {
                        mediaContent = `
                            <img src="${item.url}" alt="Multimedia del mundial">
                            <button type="button" class="remove-btn" onclick="removeMultimediaFile(${currentIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                            <span class="media-filename">${file.name}</span>
                        `;
                    } else if (blob.type.startsWith('video')) {
                        mediaContent = `
                            <video controls>
                                <source src="${item.url}" type="${blob.type}">
                                Tu navegador no soporta el elemento de video.
                            </video>
                            <button type="button" class="remove-btn" onclick="removeMultimediaFile(${currentIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                            <span class="media-filename">${file.name}</span>
                        `;
                    } else {
                        mediaContent = `
                            <img src="${item.url}" alt="Multimedia del mundial">
                            <button type="button" class="remove-btn" onclick="removeMultimediaFile(${currentIndex})">
                                <i class="fas fa-times"></i>
                            </button>
                            <span class="media-filename">${file.name}</span>
                        `;
                    }

                    mediaItem.innerHTML = mediaContent;

                    if (placeholder) {
                        carousel.insertBefore(mediaItem, placeholder);
                    } else {
                        carousel.appendChild(mediaItem);
                    }
                    
                } catch (error) {
                    console.error('Error procesando archivo multimedia:', error);
                    // Continuar con el siguiente archivo
                    continue;
                }
            }
            
            console.log('Multimedia cargada exitosamente:', multimediaFiles.length, 'archivos');
        } else {
            console.log('No hay multimedia para cargar');
            multimediaFiles = []; // Asegurar que esté vacío
        }
    } catch (error) {
        console.error('Error al cargar multimedia del mundial:', error);
    }
}

// Actualizar mundial existente
async function actualizarMundial(id) {
    alert('Funcionalidad de actualización aún no implementada.');
}

// INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', async function() {
    // Cargar datos desde la API
    await cargarPaises();
    await cargarJugadores();
    
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
    if (mundialId) {
        console.log('Modo edición para mundial ID:', mundialId);
        await loadMundialActual(mundialId);
    }
});