document.addEventListener('DOMContentLoaded', function() {
    // --- CÓDIGO QUE YA TENÍAS ---
    displayWorldCups(allWorldCups);
    initWorldCupSwiper();
    renderFifaRanking(fifaRankingData);
    renderConmebolTable(conmebolQualifiersData);
    displayTopScorers(topScorersData);
    displayGoldenBallWinners(goldenBallWinners);
    populateUefaGroupSelector();
    renderUefaGroupTable(uefaQualifiersData['Grupo A']);
    setupUefaGroupListener();
    initQualifiersSwiper();
    displayPosts(allPosts);
    document.querySelector('.search-input').addEventListener('input', handleSearchAndFilter);
    document.getElementById('filterCountry').addEventListener('change', handleSearchAndFilter);
    document.getElementById('orderBy').addEventListener('change', handleSearchAndFilter);

    // --- NUEVO CÓDIGO INTEGRADO ---

    // 1. Lógica para el botón "Siguiente"
    const nextButton = document.getElementById('btn-siguiente-post'); // Asegúrate de que tu botón "Siguiente" tenga este ID
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Opcional: Guarda el texto que el usuario ya haya escrito
            const postContent = document.querySelector('.main-feed textarea').value;
            if (postContent) {
                localStorage.setItem('postDraft', postContent);
            }
            // Redirige a la página de mundiales
            window.location.href = 'mundiales.html';
        });
    }

    // 2. Lógica para mostrar las categorías seleccionadas al volver
    const selectedMundial = localStorage.getItem('selectedMundial');
    const selectedCategoriesJSON = localStorage.getItem('selectedCategories');
    const rightSidebar = document.querySelector('.sidebar-right');

    if (selectedMundial && selectedCategoriesJSON && rightSidebar) {
        const categories = JSON.parse(selectedCategoriesJSON);

        // Creamos el nuevo widget para mostrar las selecciones
        const selectionWidget = document.createElement('div');
        selectionWidget.className = 'widget';
        let categoriesHTML = categories.map(cat => `
            <div class="trend">
                <span>${cat}</span>
            </div>
        `).join('');

        selectionWidget.innerHTML = `
            <h3>Categorías Seleccionadas</h3>
            <div class="trend">
                <h4>${selectedMundial}</h4>
            </div>
            ${categoriesHTML}
        `;

        // Reemplazamos el contenido de la barra derecha
        rightSidebar.innerHTML = '';
        rightSidebar.appendChild(selectionWidget);
        
        // Opcional: Restauramos el borrador del post
        const postDraft = localStorage.getItem('postDraft');
        if (postDraft) {
            document.querySelector('.main-feed textarea').value = postDraft;
        }

        // Limpiamos el localStorage para la próxima publicación
        localStorage.removeItem('selectedMundial');
        localStorage.removeItem('selectedCategories');
        localStorage.removeItem('postDraft');
    }
});


document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});


// Agrega esta nueva sección de datos de ejemplo (será reemplazada por el backend)
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

// ... (todo el código existente de `allPosts`, `createPostCard`, `displayPosts`, etc.) ...

// Nueva función para crear una tarjeta de mundial
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

// Nueva función para mostrar los mundiales
function displayWorldCups(worldCups) {
    // 1. Apuntamos al nuevo contenedor
    const worldCupsContainer = document.getElementById('worldCupsWrapper');
    
    // 2. Envolvemos cada tarjeta en un <div class="swiper-slide">
    worldCupsContainer.innerHTML = worldCups.map(worldCup => {
        return `<div class="swiper-slide">${createWorldCupCard(worldCup)}</div>`
    }).join('');
}

function initWorldCupSwiper() {
    const swiper = new Swiper('.worldCupSwiper', {
        loop: true,
        slidesPerView: 1, // Muestra 1 en móviles
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Vistas para diferentes tamaños de pantalla
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
        },
    });
}

function goToWorldCupPage(id) {
    console.log(`Redirigiendo a la página del Mundial ${id}`);
    // Aquí podrías redirigir a una página específica para ese mundial, por ejemplo:
    window.location.href = `index.php?controller=home&action=mundial&id=${id}`;
}


// Datos de ejemplo
const fifaRankingData = [ 
    { rank: 1, team: 'Argentina', code: 'ar', points: 1885.36, change: -0.8 }, 
    { rank: 2, team: 'España', code: 'es', points: 1867.09, change: 12.45 }, 
    { rank: 3, team: 'Francia', code: 'fr', points: 1862.03, change: 9.32 }, 
    { rank: 4, team: 'Inglaterra', code: 'gb-eng', points: 1813.32, change: -5.88 }, 
    { rank: 5, team: 'Brasil', code: 'br', points: 1770.53, change: +20.45 },
    { rank: 6, team: 'Portugal', code: 'pt', points: 1777.69, change: 1.66 }, 
    { rank: 7, team: 'Paises Bajos', code: 'nl', points: 1758.18, change: +5.74 }, 
    { rank: 8, team: 'Belgica', code: 'be', points: 1736.38, change: +0.63 }, 
    { rank: 9, team: 'Alemania', code: 'de', points: 1716.98, change: 0 }, 
    { rank: 10, team: 'Croacia', code: 'hr', points: 1707.51, change: +8.85 }  
];

const uefaQualifiersData = {
    "Grupo A": [
        { rank: 1, team: 'Eslovaquia', code: 'sk', pj: 2, g: 2, e: 0, p: 0, gf: 3, gc: 0, dg: 3, pts: 6 },
        { rank: 2, team: 'Irlanda del Norte', code: 'gb-nir', pj: 2, g: 1, e: 0, p: 1, gf: 4, gc: 4, dg: 0, pts: 3 },
        { rank: 3, team: 'Alemania', code: 'de', pj: 2, g: 1, e: 0, p: 1, gf: 3, gc: 3, dg: 0, pts: 3 },
        { rank: 4, team: 'Luxemburgo', code: 'lu', pj: 2, g: 0, e: 0, p: 2, gf: 1, gc: 4, dg: -3, pts: 0 }
    ],
    "Grupo B": [
        { rank: 1, team: 'Suiza', code: 'ch', pj: 2, g: 2, e: 0, p: 0, gf: 7, gc: 0, dg: 7, pts: 6 },
        { rank: 2, team: 'Kosovo', code: 'xk', pj: 2, g: 1, e: 0, p: 1, gf: 2, gc: 4, dg: -2, pts: 3 },
        { rank: 3, team: 'Suecia', code: 'se', pj: 2, g: 0, e: 1, p: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
        { rank: 4, team: 'Eslovenia', code: 'si', pj: 2, g: 0, e: 1, p: 1, gf: 2, gc: 5, dg: -3, pts: 1 }
    ],
    "Grupo C": [
        { rank: 1, team: 'Dinamarca', code: 'dk', pj: 2, g: 1, e: 1, p: 0, gf: 3, gc: 0, dg: 3, pts: 4 },
        { rank: 2, team: 'Escocia', code: 'gb-sct', pj: 2, g: 1, e: 1, p: 0, gf: 2, gc: 0, dg: 2, pts: 4 },
        { rank: 3, team: 'Grecia', code: 'gr', pj: 2, g: 1, e: 0, p: 1, gf: 5, gc: 4, dg: 1, pts: 3 },
        { rank: 4, team: 'Bielorrusia', code: 'by', pj: 2, g: 0, e: 0, p: 2, gf: 1, gc: 7, dg: -6, pts: 0 }
    ],
    "Grupo D": [
        { rank: 1, team: 'Francia', code: 'fr', pj: 2, g: 2, e: 0, p: 0, gf: 4, gc: 1, dg: 3, pts: 6 },
        { rank: 2, team: 'Islandia', code: 'is', pj: 2, g: 1, e: 0, p: 1, gf: 6, gc: 2, dg: -4, pts: 3 },
        { rank: 3, team: 'Ucrania', code: 'ua', pj: 2, g: 0, e: 1, p: 1, gf: 1, gc: 3, dg: -2, pts: 1 },
        { rank: 4, team: 'Azerbaiyán', code: 'az', pj: 2, g: 0, e: 1, p: 1, gf: 1, gc: 6, dg: -5, pts: 1 }
    ],
    "Grupo E": [
        { rank: 1, team: 'España', code: 'es', pj: 2, g: 2, e: 0, p: 0, gf: 9, gc: 0, dg: 9, pts: 6 },
        { rank: 2, team: 'Georgia', code: 'ge', pj: 2, g: 1, e: 0, p: 1, gf: 5, gc: 3, dg: 2, pts: 3 },
        { rank: 3, team: 'Turquía', code: 'tr', pj: 2, g: 1, e: 0, p: 1, gf: 3, gc: 8, dg: -5, pts: 3 },
        { rank: 4, team: 'Bulgaria', code: 'bg', pj: 2, g: 0, e: 0, p: 2, gf: 0, gc: 6, dg: -6, pts: 0 }
    ],
    "Grupo F": [
        { rank: 1, team: 'Portugal', code: 'pt', pj: 2, g: 2, e: 0, p: 0, gf: 8, gc: 2, dg: 6, pts: 6 },
        { rank: 2, team: 'Armenia', code: 'am', pj: 2, g: 1, e: 0, p: 1, gf: 2, gc: 6, dg: -4, pts: 3 },
        { rank: 3, team: 'Hungría', code: 'hu', pj: 2, g: 0, e: 1, p: 1, gf: 4, gc: 5, dg: -1, pts: 1 },
        { rank: 4, team: 'Irlanda', code: 'ie', pj: 2, g: 0, e: 1, p: 1, gf: 3, gc: 4, dg: -1, pts: 1 }
    ],
    "Grupo G": [
        { rank: 1, team: 'Países Bajos', code: 'nl', pj: 4, g: 3, e: 1, p: 0, gf: 14, gc: 3, dg: 11, pts: 10 },
        { rank: 2, team: 'Polonia', code: 'pl', pj: 5, g: 3, e: 1, p: 1, gf: 8, gc: 4, dg: 4, pts: 10 },
        { rank: 3, team: 'Finlandia', code: 'fi', pj: 5, g: 2, e: 1, p: 2, gf: 6, gc: 8, dg: -2, pts: 7 },
        { rank: 4, team: 'Lituania', code: 'lt', pj: 5, g: 0, e: 3, p: 2, gf: 5, gc: 7, dg: -2, pts: 3 },
        { rank: 5, team: 'Malta', code: 'mt', pj: 5, g: 0, e: 2, p: 3, gf: 1, gc: 12, dg: -11, pts: 2 }
    ],
    "Grupo H": [
        { rank: 1, team: 'Bosnia y Herzegovina', code: 'ba', pj: 5, g: 4, e: 0, p: 1, gf: 11, gc: 3, dg: 8, pts: 12 },
        { rank: 2, team: 'Austria', code: 'at', pj: 4, g: 4, e: 0, p: 0, gf: 9, gc: 2, dg: 7, pts: 12 },
        { rank: 3, team: 'Rumania', code: 'ro', pj: 5, g: 2, e: 1, p: 2, gf: 10, gc: 6, dg: 4, pts: 7 },
        { rank: 4, team: 'Chipre', code: 'cy', pj: 5, g: 1, e: 1, p: 3, gf: 5, gc: 7, dg: -2, pts: 4 },
        { rank: 5, team: 'San Marino', code: 'sm', pj: 5, g: 0, e: 0, p: 5, gf: 1, gc: 18, dg: -17, pts: 0 }
    ],
    "Grupo I": [
        { rank: 1, team: 'Noruega', code: 'no', pj: 5, g: 5, e: 0, p: 0, gf: 24, gc: 3, dg: 21, pts: 15 },
        { rank: 2, team: 'Italia', code: 'it', pj: 4, g: 3, e: 0, p: 1, gf: 12, gc: 7, dg: 5, pts: 9 },
        { rank: 3, team: 'Israel', code: 'il', pj: 5, g: 3, e: 0, p: 2, gf: 15, gc: 11, dg: 4, pts: 9 },
        { rank: 4, team: 'Estonia', code: 'ee', pj: 5, g: 1, e: 0, p: 4, gf: 5, gc: 13, dg: -8, pts: 3 },
        { rank: 5, team: 'Moldavia', code: 'md', pj: 5, g: 0, e: 0, p: 5, gf: 3, gc: 25, dg: -22, pts: 0 }
    ],
    "Grupo J": [
        { rank: 1, team: 'Macedonia del Norte', code: 'mk', pj: 5, g: 3, e: 2, p: 0, gf: 11, gc: 2, dg: 9, pts: 11 },
        { rank: 2, team: 'Bélgica', code: 'be', pj: 4, g: 3, e: 1, p: 0, gf: 17, gc: 4, dg: 13, pts: 10 },
        { rank: 3, team: 'Gales', code: 'gb-wls', pj: 5, g: 3, e: 1, p: 1, gf: 11, gc: 6, dg: 5, pts: 10 },
        { rank: 4, team: 'Kazajistán', code: 'kz', pj: 5, g: 1, e: 0, p: 4, gf: 3, gc: 11, dg: -8, pts: 3 },
        { rank: 5, team: 'Liechtenstein', code: 'li', pj: 5, g: 0, e: 0, p: 5, gf: 0, gc: 19, dg: -19, pts: 0 }
    ],
    "Grupo K": [
        { rank: 1, team: 'Inglaterra', code: 'gb-eng', pj: 5, g: 5, e: 0, p: 0, gf: 13, gc: 0, dg: 13, pts: 15 },
        { rank: 2, team: 'Albania', code: 'al', pj: 5, g: 2, e: 2, p: 1, gf: 5, gc: 3, dg: 2, pts: 8 },
        { rank: 3, team: 'Serbia', code: 'rs', pj: 4, g: 2, e: 1, p: 1, gf: 4, gc: 5, dg: -1, pts: 7 },
        { rank: 4, team: 'Letonia', code: 'lv', pj: 5, g: 1, e: 1, p: 3, gf: 2, gc: 6, dg: -4, pts: 4 },
        { rank: 5, team: 'Andorra', code: 'ad', pj: 5, g: 0, e: 0, p: 5, gf: 0, gc: 10, dg: -10, pts: 0 }
    ],
    "Grupo L": [
        { rank: 1, team: 'Croacia', code: 'hr', pj: 4, g: 4, e: 0, p: 0, gf: 17, gc: 1, dg: 16, pts: 12 },
        { rank: 2, team: 'Chequia', code: 'cz', pj: 5, g: 4, e: 0, p: 1, gf: 11, gc: 6, dg: 5, pts: 12 },
        { rank: 3, team: 'Islas Feroe', code: 'fo', pj: 5, g: 2, e: 0, p: 3, gf: 4, gc: 5, dg: -1, pts: 6 },
        { rank: 4, team: 'Montenegro', code: 'me', pj: 5, g: 2, e: 0, p: 3, gf: 4, gc: 9, dg: -5, pts: 6 },
        { rank: 5, team: 'Gibraltar', code: 'gi', pj: 5, g: 0, e: 0, p: 5, gf: 2, gc: 17, dg: -15, pts: 0 }
    ]
    // Puedes añadir los demás grupos (D, E, F...) aquí si quieres
};
const conmebolQualifiersData = [
    { rank: 1, team: 'Argentina', code: 'ar', points: 38, played: 18 },
    { rank: 2, team: 'Ecuador', code: 'ec', points: 29, played: 18 },
    { rank: 3, team: 'Colombia', code: 'co', points: 28, played: 18 },
    { rank: 4, team: 'Uruguay', code: 'uy', points: 28, played: 18 },
    { rank: 5, team: 'Brasil', code: 'br', points: 28, played: 18 },
    { rank: 6, team: 'Paraguay', code: 'py', points: 28, played: 18 }
];

// Función para renderizar la tabla del Ranking FIFA
function renderFifaRanking(data) { 
    const container = document.getElementById('fifaRankingBody'); 
    if (!container) return; container.innerHTML = data.map(item => `<div class="table-row"><span class="col-rank">${item.rank}</span>
        <span class="col-team"><img class="flag-img" src="https://flagcdn.com/w20/${item.code}.png" 
        alt="${item.team}"> ${item.team}</span><span class="col-points">${item.points.toFixed(2)}</span>
        <span class="col-change ${item.change >= 0 ? 'positive' : 'negative'}">
        ${item.change.toFixed(2)}</span></div>`).join(''); 
    }


// Función para renderizar tablas de eliminatorias
function renderQualifiersTable(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map(item => `
        <div class="table-row">
            <span class="col-rank">${item.rank}</span>
            <span class="col-team"><span class="flag">${item.flag}</span> ${item.team}</span>
            <span class="col-points">${item.points}</span>
            <span class="col-played">${item.played}</span>
        </div>
    `).join('');
}

// Función para inicializar el carrusel de eliminatorias
function initQualifiersSwiper() {
    const swiper = new Swiper('.qualifiersSwiper', {
        loop: false,
        autoHeight: true
    });

    document.querySelectorAll('.btn-qualifier').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const slideIndex = parseInt(btn.getAttribute('data-slide'));
        swiper.slideTo(slideIndex);
    });
});

}




// Dibuja las opciones (Grupo A, B, C...) en el menú desplegable
function populateUefaGroupSelector() { 
    const selector = document.getElementById('uefa-group-selector'); 
    if (!selector) return; const groups = Object.keys(uefaQualifiersData); 
    selector.innerHTML = groups.map(group => `<option value="${group}">${group}</option>`).join(''); 
}


// Dibuja la tabla para el grupo seleccionado
function renderUefaGroupTable(groupData) {
    const container = document.getElementById('uefaQualifiersBody');
    if (!container) return;
    container.innerHTML = groupData.map(item => `
        <div class="table-row uefa-row">  <span class="col-pos">${item.rank}</span>
            <span class="col-team-uefa">
                <img class="flag-img" src="https://flagcdn.com/w20/${item.code}.png" alt="${item.team}">
                ${item.team}
            </span>
            <span class="col-stat">${item.pj}</span>
            <span class="col-stat">${item.g}</span>
            <span class="col-stat">${item.e}</span>
            <span class="col-stat">${item.p}</span>
            <span class="col-stat">${item.gf}</span>
            <span class="col-stat">${item.gc}</span>
            <span class="col-stat">${item.dg}</span>
            <span class="col-stat col-pts">${item.pts}</span>
        </div>
    `).join('');
}


function renderConmebolTable(data) { 
    const container = document.getElementById('conmebolQualifiersBody'); 
    if (!container) return; 
    container.innerHTML = data.map(item => `<div class="table-row"><span class="col-rank">${item.rank}</span><span class="col-team"><img class="flag-img" src="https://flagcdn.com/w20/${item.code}.png" alt="${item.team}"> ${item.team}</span><span class="col-points">${item.points}</span><span class="col-played">${item.played}</span></div>`).join(''); 
}


// Hace que el menú desplegable funcione: al cambiar de grupo, actualiza la tabla
function setupUefaGroupListener() {
    const selector = document.getElementById('uefa-group-selector');
    if (!selector) return;
    
    selector.addEventListener('change', (event) => {
        const selectedGroup = event.target.value;
        renderUefaGroupTable(uefaQualifiersData[selectedGroup]);
    });
}







// --- DATOS PARA SECCIONES DE LEYENDAS ---
const topScorersData = [
    { rank: 1, name: 'Miroslav Klose', country: 'Alemania', code: 'de', goals: 16 },
    { rank: 2, name: 'Ronaldo Nazário', country: 'Brasil', code: 'br', goals: 15 },
    { rank: 3, name: 'Gerd Müller', country: 'Alemania', code: 'de', goals: 14 },
    { rank: 4, name: 'Just Fontaine', country: 'Francia', code: 'fr', goals: 13 },
    { rank: 4, name: 'Lionel Messi', country: 'Argentina', code: 'ar', goals: 13 },
    { rank: 6, name: 'Kylian Mbappé', country: 'Francia', code: 'fr', goals: 12 },
    { rank: 6, name: 'Pelé', country: 'Brasil', code: 'br', goals: 12 },
];
const goldenBallWinners = [
    { year: 2022, player: 'Lionel Messi', country: 'Argentina', code: 'ar', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXRw4AOnv5WxG5MdVXVjCl1hueGvP7mg_BPA&s' },
    { year: 2018, player: 'Luka Modrić', country: 'Croacia', code: 'hr', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwBnP5ikhN_zRhgFm_hK5dNsVdJ7b0nz7-Kg&s' },
    { year: 2014, player: 'Lionel Messi', country: 'Argentina', code: 'ar', image: 'https://ichef.bbci.co.uk/ace/ws/640/amz/worldservice/live/assets/images/2014/07/14/140714020901_lionel_messi_624x351_afp.jpg.webp' },
    { year: 2010, player: 'Diego Forlan', country: 'Uruguay', code: 'ur', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/U10_Diego_Forl%C3%A1n_7524.jpg/960px-U10_Diego_Forl%C3%A1n_7524.jpg'},
    { year: 2006, player: 'Zinedine Zidane', country: 'Francia', code: 'fr', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd7Rqo8j6nguCbqqOHDRf5wr7HHaAmYzqwXg&s'},
    { year: 2002, player: 'Oliver Kahn', country: 'Alemania', code: 'am', image: 'https://e00-elmundo.uecdn.es/mundial/2002/imagenes/2002/07/03/1025707610_1.jpg'},
    { year: 1998, player: 'Ronaldo', country: 'Brasil', code: 'br', image: 'https://pbs.twimg.com/media/C-gA69pWsAA6Wcp?format=jpg&name=4096x4096'},
    { year: 1994, player: 'Romario', country: 'Brasil', code: 'br', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlAdKTDwfIfsYNKApj4YCWrrysxo0tc48BDQ&s'},
    { year: 1990, player: 'Salvatore Schillaci', country: 'Italia', code: 'br', image: 'https://www.clarin.com/img/2024/09/10/K5rFRg6uP_600x600__1.jpg'},
    { year: 1986, player: 'Diego Maradona', country: 'Argentina', code: 'br', image: 'https://i0.wp.com/thesefootballtimes.co/wp-content/uploads/2017/03/maradona86.jpg?fit=1600%2C1053&ssl=1'},
    { year: 1982, player: 'Paolo Rossi', country: 'Italia', code: 'br', image: 'https://imagenes.elpais.com/resizer/v2/https%3A%2F%2Fcloudfront-eu-central-1.images.arcpublishing.com%2Fprisa%2FFM3LPK5GHRG6DKX6GGXZXVKMH4.jpg?auth=995398a2bb1be2783bcc70e9d7067e11bf16408a8ba4c8df58716ca7da628856&width=1200&height=675&smart=true'},
    { year: 1978, player: 'Mario Kempes', country: 'Argentina', code: 'br', image: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Mario_Kempes_1978_Argentina_-_Holanda.jpg'},
];

// --- FUNCIONES PARA DIBUJAR LAS SECCIONES DE LEYENDAS ---
function displayTopScorers(scorers) {
    const container = document.getElementById('top-scorers-table');
    if (!container) return;
    container.innerHTML = scorers.map(scorer => `
        <div class="scorer-row">
            <span class="scorer-rank">${scorer.rank}</span>
            <span class="scorer-name">
                <img class="flag-img" src="https://flagcdn.com/w40/${scorer.code}.png" alt="${scorer.country}">
                ${scorer.name}
            </span>
            <span class="scorer-goals">${scorer.goals}</span>
        </div>
    `).join('');
}
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