// Array para almacenar los países cargados desde la API
let countries = [];

// Array para almacenar los países seleccionados con su ID
let selectedCountries = [];

let uploadedFiles = [];
let currentYear = null;

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
            // Almacenar los países con su ID y nombre
            countries = data.data.map(pais => ({
                id: pais.id,
                nombre: pais.nombre
            }));
            
            renderCountryList();
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

// Renderizar lista de países
function renderCountryList(filteredCountries = countries) {
    const countryList = document.getElementById('countryList');
    countryList.innerHTML = '';

    if (filteredCountries.length === 0) {
        countryList.innerHTML = '<div class="country-item" style="text-align: center; color: #888;">No se encontraron países</div>';
        return;
    }

    filteredCountries.forEach(country => {
        // Verificar si el país ya está seleccionado usando su ID
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

// Seleccionar país
function selectCountry(country) {
    // Verificar que el país no esté ya seleccionado
    const exists = selectedCountries.some(c => c.id === country.id);
    
    if (!exists) {
        selectedCountries.push({
            id: country.id,
            nombre: country.nombre
        });
        
        updateSelectedCountries();
        updateMundialTitle();
        renderCountryList();
        
        // Limpiar el campo de búsqueda
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
            // Más de 2 países: "pais1, pais2 y pais3"
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

// Buscar países
function handleCountrySearch() {
    const searchTerm = document.getElementById('countrySearch').value.toLowerCase();
    const filteredCountries = countries.filter(country => 
        country.nombre.toLowerCase().includes(searchTerm)
    );
    renderCountryList(filteredCountries);
}

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

    prevBtn.disabled = carousel.scrollLeft <= 0;
    nextBtn.disabled = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth);
}

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();

    const year = document.getElementById('year').value;
    const descripcion = document.getElementById('descripcion').value;

    // Validaciones
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

    // Preparar los datos para enviar
    const formData = {
        year: parseInt(year),
        sedes: selectedCountries.map(c => ({
            id: c.id,
            nombre: c.nombre
        })),
        descripcion: descripcion.trim(),
        multimedia: uploadedFiles.map(file => ({
            name: file.file.name,
            type: file.type,
            size: file.file.size
        }))
    };

    console.log('Datos del mundial a crear:', formData);
    
    // Aquí irá la lógica para enviar al backend
    // Por ahora solo mostramos los datos en consola
    alert(`¡Mundial "${selectedCountries.map(c => c.nombre).join(' y ')} ${year}" listo para crear!`);
    
    // Descomentar para redirigir después de crear
    // window.location.href = 'admin.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cargar países desde la API
    cargarPaises();
    
    // Inicializar UI
    updateSelectedCountries();

    // Event listeners
    const yearInput = document.getElementById('year');
    yearInput.addEventListener('input', handleYearChange);
    yearInput.addEventListener('change', handleYearChange);
    
    document.getElementById('countrySearch').addEventListener('input', handleCountrySearch);
    document.getElementById('multimediaInput').addEventListener('change', handleFileSelect);
    document.getElementById('mundialForm').addEventListener('submit', handleFormSubmit);

    // Verificar si es edición
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        document.getElementById('submitBtn').textContent = 'Actualizar Mundial';
        document.querySelector('.mundial-form h2').textContent = 'Editar Mundial';
        console.log('Modo edición para mundial ID:', editId);
        // Aquí cargarías los datos del mundial a editar
    }
});