// Lista de países
const countries = [
    'Argentina', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela', 'Bolivia',
    'México', 'Estados Unidos', 'Canadá', 'Costa Rica', 'Guatemala', 'Honduras', 'Nicaragua', 'Panamá', 'El Salvador',
    'España', 'Francia', 'Italia', 'Alemania', 'Inglaterra', 'Portugal', 'Holanda', 'Bélgica', 'Croacia', 'Polonia',
    'Rusia', 'Ucrania', 'Suecia', 'Noruega', 'Dinamarca', 'Finlandia', 'Suiza', 'Austria', 'República Checa',
    'Japón', 'Corea del Sur', 'China', 'India', 'Tailandia', 'Vietnam', 'Indonesia', 'Malasia', 'Singapur',
    'Australia', 'Nueva Zelanda', 'Sudáfrica', 'Nigeria', 'Ghana', 'Marruecos', 'Egipto', 'Túnez', 'Argelia',
    'Qatar', 'Arabia Saudita', 'Emiratos Árabes Unidos', 'Irán', 'Irak', 'Israel', 'Turquía'
];

let selectedCountries = [];
let uploadedFiles = [];
let currentYear = null;

// Generar opciones de años (1900 hasta año actual + 50)
function generateYearOptions() {
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const endYear = currentYear + 50;

    for (let year = endYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Renderizar lista de países
function renderCountryList(filteredCountries = countries) {
    const countryList = document.getElementById('countryList');
    countryList.innerHTML = '';

    filteredCountries.forEach(country => {
        if (!selectedCountries.includes(country)) {
            const countryItem = document.createElement('div');
            countryItem.className = 'country-item';
            countryItem.textContent = country;
            countryItem.onclick = () => selectCountry(country);
            countryList.appendChild(countryItem);
        }
    });
}

// Seleccionar país
function selectCountry(country) {
    if (!selectedCountries.includes(country)) {
        selectedCountries.push(country);
        updateSelectedCountries();
        updateMundialTitle();
        renderCountryList();
    }
}

// Remover país seleccionado
function removeCountry(country) {
    selectedCountries = selectedCountries.filter(c => c !== country);
    updateSelectedCountries();
    updateMundialTitle();
    renderCountryList();
}

// Actualizar países seleccionados
function updateSelectedCountries() {
    const container = document.getElementById('selectedCountries');
    
    if (selectedCountries.length === 0) {
        container.innerHTML = '<span class="placeholder-text">Ningún país seleccionado</span>';
    } else {
        container.innerHTML = selectedCountries.map(country => 
        `<div class="country-tag" onclick="removeCountry('${country}')">
        ${country} <i class="fas fa-times"></i>
            </div>`
        ).join('');
    }
}

// Actualizar título del mundial
function updateMundialTitle() {
    const titleElement = document.getElementById('mundialTitle');
    const subtitleElement = document.getElementById('mundialSubtitle');

    if (currentYear && selectedCountries.length > 0) {
        const countryText = selectedCountries.length === 1 
            ? selectedCountries[0] 
            : selectedCountries.join(' y ');
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
    const yearSelect = document.getElementById('year');
    currentYear = yearSelect.value;
    updateMundialTitle();
}

// Buscar países
function handleCountrySearch() {
    const searchTerm = document.getElementById('countrySearch').value.toLowerCase();
    const filteredCountries = countries.filter(country => 
country.toLowerCase().includes(searchTerm)
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
        if (uploadedFiles.length < 10) { // Límite de 10 archivos
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

    if (!year) {
        alert('Por favor selecciona un año para el mundial.');
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

    const formData = {
        year: year,
        sedes: selectedCountries,
        descripcion: descripcion,
        multimedia: uploadedFiles.map(file => ({
            name: file.file.name,
            type: file.type,
            size: file.file.size
        }))
    };

    console.log('Datos del mundial a crear:', formData);
    
    // Aquí iría la lógica para enviar al backend
    alert(`¡Mundial "${selectedCountries.join(' y ')} ${year}" creado exitosamente!`);
    
    // Redirigir de vuelta al dashboard
    window.location.href = 'admin.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    generateYearOptions();
    renderCountryList();
    updateSelectedCountries();

    // Event listeners
    document.getElementById('year').addEventListener('change', handleYearChange);
    document.getElementById('countrySearch').addEventListener('input', handleCountrySearch);
    document.getElementById('multimediaInput').addEventListener('change', handleFileSelect);
    document.getElementById('mundialForm').addEventListener('submit', handleFormSubmit);

    // Verificar si es edición
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        document.getElementById('submitBtn').textContent = 'Actualizar Mundial';
        document.querySelector('.mundial-form h2').textContent = 'Editar Mundial';
        // Aquí cargarías los datos del mundial a editar
        console.log('Modo edición para mundial ID:', editId);
    }
});