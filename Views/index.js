// Sample data for posts (esto será reemplazado por la base de datos)
const allPosts = [
    {
        id: 1, user: "Diego_Futbol", avatar: "DF", time: "hace 2 horas", title: "¡Increíble jugada de Messi en el Mundial!",
        content: "No puedo creer lo que acabo de ver. Esa jugada de Messi en el minuto 89 fue simplemente mágica. Argentina sigue demostrando por qué son los campeones del mundo.",
        likes: 245, comments: 89, shares: 34, featured: true, year: 2022, country: "Qatar"
    },
    {
        id: 2, user: "Mundial2022Fan", avatar: "MF", time: "hace 4 horas", title: "Análisis táctico: Francia vs Argentina",
        content: "Después de ver el partido 3 veces, creo que la clave estuvo en el cambio de sistema de Scaloni en el segundo tiempo. La presión alta funcionó perfectamente.",
        likes: 189, comments: 67, shares: 23, featured: true, year: 2022, country: "Qatar"
    },
    {
        id: 3, user: "FutbolExperto", avatar: "FE", time: "hace 6 horas", title: "Los mejores goles del Mundial Qatar 2022",
        content: "He compilado los 20 mejores goles del mundial. Desde el golazo de Richarlison hasta el tiro libre perfecto de Messi. ¿Cuál fue tu favorito?",
        likes: 156, comments: 78, shares: 45, featured: true, year: 2022, country: "Qatar"
    },
    {
        id: 4, user: "Lionel_Messi_Fan", avatar: "LM", time: "hace 30 minutos", title: "Messi es el GOAT, change my mind",
        content: "Después de ganar el Mundial, ya no hay discusión posible. Leo demostró que es el mejor de todos los tiempos.",
        likes: 67, comments: 23, shares: 8, year: 2022, country: "Qatar"
    },
    {
        id: 5, user: "ArgentinaAlbiceleste", avatar: "AA", time: "hace 1 hora", title: "La celebración más emotiva del Mundial",
        content: "Ver a Messi llorando de felicidad con la copa en sus manos fue el momento más emotivo del fútbol. 36 años esperando este momento.",
        likes: 134, comments: 41, shares: 19, year: 2022, country: "Qatar"
    },
    {
        id: 6, user: "TacticaFutbol", avatar: "TF", time: "hace 2 horas", title: "¿Cómo cambió el fútbol en Qatar 2022?",
        content: "Este Mundial nos mostró nuevas tendencias tácticas. Los equipos asiáticos sorprendieron con su juego directo y efectivo.",
        likes: 89, comments: 34, shares: 12, year: 2022, country: "Qatar"
    },
    {
        id: 7, user: "MundialStats", avatar: "MS", time: "hace 3 horas", title: "Estadísticas sorprendentes del Mundial",
        content: "Datos que quizás no sabías: Se marcaron 172 goles en total, Messi corrió 65.8 km en toda la competición, y Emiliano Martínez hizo 11 atajadas clave.",
        likes: 78, comments: 28, shares: 15, year: 2022, country: "Qatar"
    },
    {
        id: 8, user: "FutbolFemenino", avatar: "FF", time: "hace 4 horas", title: "El futuro del fútbol femenino post-Mundial",
        content: "Con la atención mundial en el fútbol, es el momento perfecto para impulsar más el fútbol femenino. ¿Qué opinan?",
        likes: 92, comments: 37, shares: 22, year: 2022, country: "Qatar"
    }
];

function createPostCard(post) {
    return `
        <div class="post-card" onclick="viewPost(${post.id})">
            ${post.featured ? '<span class="featured-badge">⭐ Destacada</span>' : ''}
            <div class="post-header">
                <div class="user-avatar">${post.avatar}</div>
                <div class="user-info">
                    <h4>@${post.user}</h4>
                    <span class="post-time">${post.time}</span>
                </div>
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            </div>
            <div class="post-interactions">
                <div class="interaction-buttons">
                    <button class="interaction-btn" onclick="event.stopPropagation(); likePost(${post.id})">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <button class="interaction-btn" onclick="event.stopPropagation(); commentPost(${post.id})">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments}</span>
                    </button>
                    <button class="interaction-btn" onclick="event.stopPropagation(); sharePost(${post.id})">
                        <i class="fas fa-share"></i>
                        <span>${post.shares}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function displayPosts(posts) {
    const featuredContainer = document.getElementById('featuredPosts');
    const recentContainer = document.getElementById('recentPosts');

    const featuredPosts = posts.filter(post => post.featured);
    const recentPosts = posts.filter(post => !post.featured);

    featuredContainer.innerHTML = featuredPosts.map(post => createPostCard(post)).join('');
    recentContainer.innerHTML = recentPosts.map(post => createPostCard(post)).join('');
}

function handleSearchAndFilter() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const filterCountry = document.getElementById('filterCountry').value;
    const orderBy = document.getElementById('orderBy').value;
    
    let filteredPosts = allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) || post.content.toLowerCase().includes(searchTerm) || post.user.toLowerCase().includes(searchTerm);
        const matchesCountry = !filterCountry || post.country === filterCountry;
        return matchesSearch && matchesCountry;
    });

    if (orderBy) {
        filteredPosts.sort((a, b) => {
            if (orderBy.includes('likes')) {
                return orderBy === 'likes_asc' ? a.likes - b.likes : b.likes - a.likes;
            } else if (orderBy.includes('comments')) {
                return orderBy === 'comments_asc' ? a.comments - b.comments : b.comments - a.comments;
            }
        });
    }

    displayPosts(filteredPosts);
}

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

function viewPost(id) {
    console.log(`Viewing post ${id}`);
    // Aquí podrías redirigir a una página de detalle de la publicación
}

function likePost(id) {
    console.log(`Liked post ${id}`);
    // Lógica para enviar el 'like' al servidor
}

function commentPost(id) {
    console.log(`Commenting on post ${id}`);
    // Lógica para abrir un modal o sección de comentarios
}

function sharePost(id) {
    console.log(`Sharing post ${id}`);
    // Lógica para compartir en redes sociales, etc.
}

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