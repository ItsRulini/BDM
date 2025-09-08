document.addEventListener('DOMContentLoaded', function() {
    displayWorldCups(allWorldCups); // Llamada para mostrar los mundiales
    displayPosts(allPosts);
    document.querySelector('.search-input').addEventListener('input', handleSearchAndFilter);
    document.getElementById('filterCountry').addEventListener('change', handleSearchAndFilter);
    document.getElementById('orderBy').addEventListener('change', handleSearchAndFilter);
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
    const worldCupsContainer = document.getElementById('worldCupsGrid');
    worldCupsContainer.innerHTML = worldCups.map(worldCup => createWorldCupCard(worldCup)).join('');
}

function goToWorldCupPage(id) {
    console.log(`Redirigiendo a la página del Mundial ${id}`);
    // Aquí podrías redirigir a una página específica para ese mundial, por ejemplo:
    // window.location.href = `mundial.html?id=${id}`;
}