document.addEventListener('DOMContentLoaded', function() {
    // Cargar mundiales
    loadWorldCups(); // AÑADIDO
    
    // Cargar premios (estos siguen hardcodeados, pero está bien por ahora)
    displayGoldenBallWinners(goldenBallWinners);
    displayGoldenBootWinners(goldenBootWinners);
    displayGoldenGloveWinners(goldenGloveWinners);
    
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
// DATOS DE PREMIOS
// ==========================================

const goldenBallWinners = [
    { year: 2022, player: 'Lionel Messi', country: 'Argentina', code: 'ar', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXRw4AOnv5WxG5MdVXVjCl1hueGvP7mg_BPA&s' },
    { year: 2018, player: 'Luka Modrić', country: 'Croacia', code: 'hr', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwBnP5ikhN_zRhgFm_hK5dNsVdJ7b0nz7-Kg&s' },
    { year: 2014, player: 'Lionel Messi', country: 'Argentina', code: 'ar', image: 'https://ichef.bbci.co.uk/ace/ws/640/amz/worldservice/live/assets/images/2014/07/14/140714020901_lionel_messi_624x351_afp.jpg.webp' },
    { year: 2010, player: 'Diego Forlan', country: 'Uruguay', code: 'uy', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/U10_Diego_Forl%C3%A1n_7524.jpg/960px-U10_Diego_Forl%C3%A1n_7524.jpg'},
    { year: 2006, player: 'Zinedine Zidane', country: 'Francia', code: 'fr', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd7Rqo8j6nguCbqqOHDRf5wr7HHaAmYzqwXg&s'},
    { year: 2002, player: 'Oliver Kahn', country: 'Alemania', code: 'de', image: 'https://e00-elmundo.uecdn.es/mundial/2002/imagenes/2002/07/03/1025707610_1.jpg'},
    { year: 1998, player: 'Ronaldo', country: 'Brasil', code: 'br', image: 'https://pbs.twimg.com/media/C-gA69pWsAA6Wcp?format=jpg&name=4096x4096'},
    { year: 1994, player: 'Romario', country: 'Brasil', code: 'br', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlAdKTDwfIfsYNKApj4YCWrrysxo0tc48BDQ&s'},
    { year: 1990, player: 'Salvatore Schillaci', country: 'Italia', code: 'it', image: 'https://www.clarin.com/img/2024/09/10/K5rFRg6uP_600x600__1.jpg'},
    { year: 1986, player: 'Diego Maradona', country: 'Argentina', code: 'ar', image: 'https://i0.wp.com/thesefootballtimes.co/wp-content/uploads/2017/03/maradona86.jpg?fit=1600%2C1053&ssl=1'},
    { year: 1982, player: 'Paolo Rossi', country: 'Italia', code: 'it', image: 'https://imagenes.elpais.com/resizer/v2/https%3A%2F%2Fcloudfront-eu-central-1.images.arcpublishing.com%2Fprisa%2FFM3LPK5GHRG6DKX6GGXZXVKMH4.jpg?auth=995398a2bb1be2783bcc70e9d7067e11bf16408a8ba4c8df58716ca7da628856&width=1200&height=675&smart=true'},
    { year: 1978, player: 'Mario Kempes', country: 'Argentina', code: 'ar', image: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Mario_Kempes_1978_Argentina_-_Holanda.jpg'},
];

const goldenBootWinners = [
    { year: 2022, player: 'Kylian Mbappé', country: 'Francia', code: 'fr', goals: 8, image: 'https://e.rpp-noticias.io/xlarge/2022/12/18/551755_1428181.jpg' },
    { year: 2018, player: 'Harry Kane', country: 'Inglaterra', code: 'gb-eng', goals: 6, image: 'https://library.sportingnews.com/styles/crop_style_16_9_desktop/s3/2022-12/Harry%20Kane%20Tottenham%202022-23.jpg?h=920929c4&itok=YUwKN02p' },
    { year: 2014, player: 'James Rodríguez', country: 'Colombia', code: 'co', goals: 6, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZyGzxrQN5mKsYqM7YVrXTJx0VqZvGqXEzVw&s' },
    { year: 2010, player: 'Thomas Müller', country: 'Alemania', code: 'de', goals: 5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvT0qvvYzp9vWGPMIYxpRBHq7cE6v3aUgfpg&s' },
    { year: 2006, player: 'Miroslav Klose', country: 'Alemania', code: 'de', goals: 5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tJEMHLxQ8aXN0jKQJVgJpRPBQNFYyqTDVQ&s' },
    { year: 2002, player: 'Ronaldo', country: 'Brasil', code: 'br', goals: 8, image: 'https://pbs.twimg.com/media/C-gA69pWsAA6Wcp?format=jpg&name=4096x4096' },
    { year: 1998, player: 'Davor Šuker', country: 'Croacia', code: 'hr', goals: 6, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP8YmQbLkqKVFQdPGVBOPqvFJzQXEBOE1AHw&s' },
    { year: 1994, player: 'Hristo Stoichkov', country: 'Bulgaria', code: 'bg', goals: 6, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjX_3aY9YGKhX8Eh7xO7OqJpWDYvQ9Sk7V8g&s' },
    { year: 1990, player: 'Salvatore Schillaci', country: 'Italia', code: 'it', goals: 6, image: 'https://www.clarin.com/img/2024/09/10/K5rFRg6uP_600x600__1.jpg' },
    { year: 1986, player: 'Gary Lineker', country: 'Inglaterra', code: 'gb-eng', goals: 6, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnX4N5dUqVr_vQBYYz8VqQGXWfZD8QZx7GKg&s' },
    { year: 1982, player: 'Paolo Rossi', country: 'Italia', code: 'it', goals: 6, image: 'https://imagenes.elpais.com/resizer/v2/https%3A%2F%2Fcloudfront-eu-central-1.images.arcpublishing.com%2Fprisa%2FFM3LPK5GHRG6DKX6GGXZXVKMH4.jpg?auth=995398a2bb1be2783bcc70e9d7067e11bf16408a8ba4c8df58716ca7da628856&width=1200&height=675&smart=true' },
    { year: 1978, player: 'Mario Kempes', country: 'Argentina', code: 'ar', goals: 6, image: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Mario_Kempes_1978_Argentina_-_Holanda.jpg' },
];

const goldenGloveWinners = [
    { year: 2022, player: 'Emiliano Martínez', country: 'Argentina', code: 'ar', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxzEVWEUP5gAslIuzj_iXhGEe8CxW2vxQOgg&s' },
    { year: 2018, player: 'Thibaut Courtois', country: 'Bélgica', code: 'be', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxWPFQkZ5_XZLJYkVJzf7B3xUG7pVaRLHI5w&s' },
    { year: 2014, player: 'Manuel Neuer', country: 'Alemania', code: 'de', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0T5gYZ6QXZnNcJxU7JzRX1yQGXqzGzH6Wlg&s' },
    { year: 2010, player: 'Iker Casillas', country: 'España', code: 'es', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTrBWLjHh0xzZtPt8KYqL5JkXCfJH5VqHFGQ&s' },
    { year: 2006, player: 'Gianluigi Buffon', country: 'Italia', code: 'it', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxBz9qN8F7vDqY5xXHZMzVnZQMKP_XJKPWA&s' },
    { year: 2002, player: 'Oliver Kahn', country: 'Alemania', code: 'de', image: 'https://e00-elmundo.uecdn.es/mundial/2002/imagenes/2002/07/03/1025707610_1.jpg' },
    { year: 1998, player: 'Fabien Barthez', country: 'Francia', code: 'fr', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqtZYMqVXXpQ8k0VhVR_X8KYqRLPh8VqMQ9Q&s' },
    { year: 1994, player: 'Michel Preud\'homme', country: 'Bélgica', code: 'be', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF7YnHZVK0qYQqX5qF8VqGVXPQJKMQ9qLQQQ&s' },
];

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

function displayGoldenBallWinners(winners) {
    const container = document.getElementById('golden-ball-grid');
    if (!container) return;
    container.innerHTML = winners.map(winner => `
        <div class="winner-card">
            <span class="year-badge">${winner.year}</span>
            <img class="winner-image" src="${winner.image}" alt="${winner.player}">
            <div class="winner-info">
                <h3>${winner.player}</h3>
                <p>${winner.country}</p>
            </div>
        </div>
    `).join('');
}

function displayGoldenBootWinners(winners) {
    const container = document.getElementById('golden-boot-grid');
    if (!container) return;
    container.innerHTML = winners.map(winner => `
        <div class="winner-card">
            <span class="year-badge">${winner.year}</span>
            <img class="winner-image" src="${winner.image}" alt="${winner.player}">
            <div class="winner-info">
                <h3>${winner.player}</h3>
                <p>${winner.country}</p>
                <p class="goals-info">${winner.goals} goles</p>
            </div>
        </div>
    `).join('');
}

function displayGoldenGloveWinners(winners) {
    const container = document.getElementById('golden-glove-grid');
    if (!container) return;
    container.innerHTML = winners.map(winner => `
        <div class="winner-card">
            <span class="year-badge">${winner.year}</span>
            <img class="winner-image" src="${winner.image}" alt="${winner.player}">
            <div class="winner-info">
                <h3>${winner.player}</h3>
                <p>${winner.country}</p>
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