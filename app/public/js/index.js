document.addEventListener('DOMContentLoaded', function() {
    // Cargar mundiales
    displayWorldCups(allWorldCups);
    initWorldCupSwiper();
    
    // Cargar premios
    displayGoldenBallWinners(goldenBallWinners);
    displayGoldenBootWinners(goldenBootWinners);
    displayGoldenGloveWinners(goldenGloveWinners);
    
    // Event listeners para búsqueda y filtros
    document.querySelector('.search-input').addEventListener('input', handleSearchAndFilter);
    document.getElementById('filterCountry').addEventListener('change', handleSearchAndFilter);
    document.getElementById('filterYear').addEventListener('change', handleSearchAndFilter);
});

document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// ==========================================
// DATOS DE MUNDIALES
// ==========================================

const allWorldCups = [
    { id: 1, year: 2022, name: "Qatar 2022", image: "https://cdn-3.expansion.mx/dims4/default/68cb107/2147483647/strip/true/crop/1371x876+0+0/resize/1800x1150!/format/webp/quality/80/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F6f%2Fc4%2F8766f2ff44a9b37bcd371593de2f%2Fqatar-2022.JPG", description: "El primer mundial en el Medio Oriente, lleno de sorpresas y con la épica final entre Argentina y Francia." },
    { id: 2, year: 2018, name: "Rusia 2018", image: "https://i.pinimg.com/736x/51/96/44/519644869b0fe4d59baa467249594234.jpg", description: "La sorprendente victoria de Francia y la memorable actuación de Croacia." },
    { id: 3, year: 2014, name: "Brasil 2014", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq06obpmRyvsfrJT8CZCMvgdKK4fON5LNe8A&s", description: "El mundial en la cuna del fútbol, recordado por el 7-1 de Alemania a Brasil." },
    { id: 4, year: 2010, name: "Sudáfrica 2010", image: "https://s3.superluchas.com/2021/07/mundial-sudafrica-2010.jpg", description: "El primer mundial en África. Se caracterizó por la 'Vuvuzela' y el gol de Iniesta que le dio la victoria a España." },
    { id: 5, year: 2006, name: "Alemania 2006", image: "https://www.sopitas.com/wp-content/uploads/2015/09/MundialAlemania2006.jpg", description: "" },
    { id: 6, year: 2002, name: "Corea del Sur y Japón 2002", image: "https://i.ytimg.com/vi/8PKmFt-FQ_A/hqdefault.jpg", description: "" },
    { id: 7, year: 1998, name: "Francia 1998", image: "https://static.wikia.nocookie.net/futbol/images/a/a4/Francia_98.png/revision/latest?cb=20150723192137", description: "" },
    { id: 8, year: 1994, name: "Estados Unidos 1994", image: "https://photos1.blogger.com/x/blogger/7251/2454/400/104044/94.jpg", description: "" },
    { id: 9, year: 1990, name: "Italia 1990", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgBB2O7QSHQ-zWdI3may0iY0YCoNW7RSnfNyEjnYI2NdligdtOLFI4uL8r3_b04NCf7Bc&usqp=CAU", description: "" },
    { id: 10, year: 1986, name: "México 1986", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrkN6EKOFBAMVMpE1q1lHEWkeVvVe0hkTZAQ&s", description: "" },
    { id: 11, year: 1982, name: "España 1982", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUvrgcBm-JUc1T9pTcUCac82InBBPKg8ml-A&s", description: "" },
    { id: 12, year: 1978, name: "Argentina 1978", image: "https://i.pinimg.com/1200x/30/b7/65/30b76543bc79fd19621417e4301ea294.jpg", description: "" },
    { id: 13, year: 1974, name: "Alemania 1974", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST-oEQykSHP6U7yZHJAl1_cljoPjJddUWrjw&s", description: "" },
    { id: 14, year: 1970, name: "México 1970", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbzRN5_SP3SkSjV5iP5QRqSAAAS7_wk_IqNw&s", description: "" },
    { id: 15, year: 1966, name: "Inglaterra 1966", image: "https://wc-2022.com/wp-content/uploads/2022/05/England-1966-Mascot-Willie-300x300.jpg", description: "" },
    { id: 16, year: 1962, name: "Chile 1962", image: "https://i.pinimg.com/736x/2c/b4/03/2cb40311871fc9d42edd3e1eaab661ac.jpg", description: "" },
    { id: 17, year: 1958, name: "Suecia 1958", image: "https://static.wikia.nocookie.net/logopedia/images/c/c9/Worldcup-sweden-1958.jpg/revision/latest/scale-to-width-down/250?cb=20211008030701&path-prefix=es", description: "" },
    { id: 18, year: 1954, name: "Suiza 1954", image: "https://i.ytimg.com/vi/aWHr05G5XYc/maxresdefault.jpg", description: "" },
    { id: 19, year: 1950, name: "Brasil 1950", image: "https://i.etsystatic.com/11494662/r/il/ee4ad9/6823565202/il_fullxfull.6823565202_nnbt.jpg", description: "" },
    { id: 20, year: 1938, name: "Francia 1938", image: "https://www.panoramadigital.co.cr/wp-content/uploads/2018/02/poster-francia-1-1938-pandemonium.com_.mx_.jpg", description: "" },
    { id: 21, year: 1934, name: "Italia 1934", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgz72nxetm23vXIJ2MhYpwbSTHZJxbZ9NFWA&s", description: "" },
    { id: 22, year: 1930, name: "Uruguay 1930", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw9aiuzPwpyblji1WvAvbnvwiUqm6NxnwxrQ&s", description: "" },
];

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

function createWorldCupCard(worldCup) {
    return `
        <div class="world-cup-card" onclick="goToWorldCupPage(${worldCup.id})">
            <img src="${worldCup.image}" alt="Copa del Mundo ${worldCup.year}">
            <div class="world-cup-info">
                <h3>${worldCup.name}</h3>
                <p>${worldCup.description}</p>
            </div>
        </div>
    `;
}

function displayWorldCups(worldCups) {
    const worldCupsContainer = document.getElementById('worldCupsWrapper');
    worldCupsContainer.innerHTML = worldCups.map(worldCup => {
        return `<div class="swiper-slide">${createWorldCupCard(worldCup)}</div>`
    }).join('');
}

function initWorldCupSwiper() {
    const swiper = new Swiper('.worldCupSwiper', {
        loop: true,
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

    let filteredWorldCups = allWorldCups.filter(worldCup => {
        const matchesSearch = worldCup.name.toLowerCase().includes(searchTerm) ||
                            worldCup.year.toString().includes(searchTerm) ||
                            worldCup.description.toLowerCase().includes(searchTerm);
        
        const matchesCountry = !filterCountry || worldCup.name.toLowerCase().includes(filterCountry);
        const matchesYear = !filterYear || worldCup.year.toString() === filterYear;

        return matchesSearch && matchesCountry && matchesYear;
    });

    displayWorldCups(filteredWorldCups);
    
    // Reinicializar Swiper después de actualizar
    if (window.worldCupSwiperInstance) {
        window.worldCupSwiperInstance.destroy();
    }
    window.worldCupSwiperInstance = initWorldCupSwiper();
}