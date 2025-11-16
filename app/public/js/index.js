document.addEventListener('DOMContentLoaded', function() {
    // Cargar mundiales
    loadWorldCups();
    
    // Cargar premios
    loadRewards(); 

    // Cargar filtros
    populateFilterOptions();
    
    // Event listeners para búsqueda y filtros
    const searchInput = document.querySelector('.search-input');
    const filterCountry = document.getElementById('filterCountry');
    const filterYear = document.getElementById('filterYear');

    if (searchInput) searchInput.addEventListener('input', handleSearchAndFilter);
    if (filterCountry) filterCountry.addEventListener('change', handleSearchAndFilter);
    if (filterYear) filterYear.addEventListener('change', handleSearchAndFilter);
});

document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    // Asegurarse que los elementos existan antes de acceder a 'contains'
    if (hamburger && mobileMenu && !hamburger.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// ==========================================
// DATOS DE MUNDIALES
// ==========================================

// ELIMINAMOS LA VARIABLE allWorldCups
let fetchedWorldCups = []; // AÑADIDO: para guardar los mundiales de la API
let worldCupSwiperInstance = null; // AÑADIDO: para manejar el swiper


// ==========================================
// FUNCIONES PARA MUNDIALES
// ==========================================

// AÑADIDO: Nueva función para cargar mundiales desde la API
async function loadWorldCups() {
    try {
        const response = await fetch('index.php?controller=api&action=getMundiales');
        if (!response.ok) {
            throw new Error('Error al cargar los mundiales');
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
            fetchedWorldCups = data.data; // Guardar para los filtros
            displayWorldCups(fetchedWorldCups);
            worldCupSwiperInstance = initWorldCupSwiper(); // Iniciar Swiper después de cargar
        } else {
            console.error('Error en los datos recibidos:', data.message);
            displayWorldCups([]); // Mostrar vacío
        }
    } catch (error) {
        console.error(error);
        displayWorldCups([]); // Mostrar vacío en caso de error
    }
}


function createWorldCupCard(worldCup) {
    // Si el nombre contiene comas, reemplazar la última coma por " y " (manteniendo el resto igual)
    const rawName = (typeof worldCup.name === 'string') ? worldCup.name.trim() : '';
    if (rawName.includes(',')) {
        const parts = rawName.split(',').map(s => s.trim()).filter(Boolean);
        if (parts.length > 1) {
            worldCup.name = parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1];
        } else {
            worldCup.name = rawName;
        }
    } else {
        worldCup.name = rawName;
    }
    // La API ya manda 'image' (Base64), 'name' (Sede + Año) y 'description'
    return `
        <div class="world-cup-card" onclick="goToWorldCupPage(${worldCup.id})">
            <img src="${worldCup.image}" alt="Copa del Mundo ${worldCup.year}" onerror="this.src='assets/default-mundial.png'">
            <div class="world-cup-info">
                <h3>${worldCup.name}</h3>
                <p>${worldCup.description || 'Sin descripción.'}</p>
            </div>
        </div>
    `;
}

function displayWorldCups(worldCups) {
    const worldCupsContainer = document.getElementById('worldCupsWrapper');
    if (!worldCupsContainer) return;

    if (worldCups.length === 0) {
        worldCupsContainer.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No se encontraron mundiales.</p>';
        return;
    }

    worldCupsContainer.innerHTML = worldCups.map(worldCup => {
        return `<div class="swiper-slide">${createWorldCupCard(worldCup)}</div>`
    }).join('');
}

function initWorldCupSwiper() {
    // Devuelve la instancia para poder destruirla
    return new Swiper('.worldCupSwiper', {
        loop: false, // Es mejor false si no son muchos datos
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
        },
    });
}

function goToWorldCupPage(id) {
    console.log(`Redirigiendo a la página del Mundial ${id}`);
    window.location.href = `index.php?controller=home&action=mundial&id=${id}`;
}

// ==========================================
// FUNCIONES PARA PREMIOS
// ==========================================

async function loadRewards() {
    try {
        const response = await fetch('index.php?controller=api&action=getAllPremios');

        const data = await response.json();

        if (data.success) {
            const premios = await data.data;
            displayGoldenBallWinners(premios);
            displayGoldenBootWinners(premios);
            displayGoldenGloveWinners(premios);
        } else {
            console.error('Error en los datos recibidos de premios:', data.message);
        }

    } catch (error) {
        console.error('Error al cargar los premios:', error);
    }
}

async function displayGoldenBallWinners(winners) {
    const container = document.getElementById('golden-ball-grid');
    if (!container) return;
    container.innerHTML = winners.map(winner => `
        <div class="winner-card">
            <span class="year-badge">${winner.año}</span>
            <img class="winner-image" src="${`data:image/jpeg;base64,${winner.balon_oro_foto}`}" alt="${winner.balon_oro}">
            <div class="winner-info">
                <h3>${winner.balon_oro}</h3>
                <p>${winner.balon_oro_pais}</p>
            </div>
        </div>
    `).join('');
}

async function displayGoldenBootWinners(winners) {
    const container = document.getElementById('golden-boot-grid');
    if (!container) return;
    container.innerHTML = winners.map(winner => `
        <div class="winner-card">
            <span class="year-badge">${winner.año}</span>
            <img class="winner-image" src="${`data:image/jpeg;base64,${winner.bota_oro_foto}`}" alt="${winner.bota_oro}">
            <div class="winner-info">
                <h3>${winner.bota_oro}</h3>
                <p>${winner.bota_oro_pais}</p>
                <p class="goals-info">${winner.max_goles} goles</p>
            </div>
        </div>
    `).join('');
}

async function displayGoldenGloveWinners(winners) {
    const container = document.getElementById('golden-glove-grid');
    if (!container) return;
    container.innerHTML = winners.map(winner => `
        <div class="winner-card">
            <span class="year-badge">${winner.año}</span>
            <img class="winner-image" src="${`data:image/jpeg;base64,${winner.guante_oro_foto}`}" alt="${winner.guante_oro}">
            <div class="winner-info">
                <h3>${winner.guante_oro}</h3>
                <p>${winner.guante_oro_pais}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================
// BÚSQUEDA Y FILTROS
// ==========================================

function handleSearchAndFilter() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const filterCountry = document.getElementById('filterCountry').value.toLowerCase();
    const filterYear = document.getElementById('filterYear').value;

    // MODIFICADO: Filtra sobre fetchedWorldCups en lugar de allWorldCups
    let filteredWorldCups = fetchedWorldCups.filter(worldCup => {
        const matchesSearch = worldCup.name.toLowerCase().includes(searchTerm) ||
                            worldCup.year.toString().includes(searchTerm) ||
                            (worldCup.description && worldCup.description.toLowerCase().includes(searchTerm));
        
        // Asumimos que el filtro de país busca en el nombre (Ej. "Qatar 2022")
        const matchesCountry = !filterCountry || worldCup.name.toLowerCase().includes(filterCountry);
        const matchesYear = !filterYear || worldCup.year.toString() === filterYear;

        return matchesSearch && matchesCountry && matchesYear;
    });

    displayWorldCups(filteredWorldCups);
    
    // Reinicializar Swiper después de actualizar
    if (window.worldCupSwiperInstance) {
        window.worldCupSwiperInstance.destroy(true, true); // Destruir instancia anterior
    }
    window.worldCupSwiperInstance = initWorldCupSwiper(); // Crear nueva instancia
}