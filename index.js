// Sample data for posts
const featuredPosts = [
    {
        id: 1,
        user: "Diego_Futbol",
        avatar: "DF",
        time: "hace 2 horas",
        title: "¡Increíble jugada de Messi en el Mundial!",
        content: "No puedo creer lo que acabo de ver. Esa jugada de Messi en el minuto 89 fue simplemente mágica. Argentina sigue demostrando por qué son los campeones del mundo.",
        likes: 245,
        comments: 89,
        shares: 34,
        featured: true
    },
    {
        id: 2,
        user: "Mundial2022Fan",
        avatar: "MF",
        time: "hace 4 horas",
        title: "Análisis táctico: Francia vs Argentina",
        content: "Después de ver el partido 3 veces, creo que la clave estuvo en el cambio de sistema de Scaloni en el segundo tiempo. La presión alta funcionó perfectamente.",
        likes: 189,
        comments: 67,
        shares: 23,
        featured: true
    },
    {
        id: 3,
        user: "FutbolExperto",
        avatar: "FE",
        time: "hace 6 horas",
        title: "Los mejores goles del Mundial Qatar 2022",
        content: "He compilado los 20 mejores goles del mundial. Desde el golazo de Richarlison hasta el tiro libre perfecto de Messi. ¿Cuál fue tu favorito?",
        likes: 156,
        comments: 78,
        shares: 45,
        featured: true
    }
];
const recentPosts = [
    {
        id: 4,
        user: "Lionel_Messi_Fan",
        avatar: "LM",
        time: "hace 30 minutos",
        title: "Messi es el GOAT, change my mind",
        content: "Después de ganar el Mundial, ya no hay discusión posible. Leo demostró que es el mejor de todos los tiempos.",
        likes: 67,
        comments: 23,
        shares: 8
    },
    {
        id: 5,
        user: "ArgentinaAlbiceleste",
        avatar: "AA",
        time: "hace 1 hora",
        title: "La celebración más emotiva del Mundial",
        content: "Ver a Messi llorando de felicidad con la copa en sus manos fue el momento más emotivo del fútbol. 36 años esperando este momento.",
        likes: 134,
        comments: 41,
        shares: 19
    },
    {
        id: 6,
        user: "TacticaFutbol",
        avatar: "TF",
        time: "hace 2 horas",
        title: "¿Cómo cambió el fútbol en Qatar 2022?",
        content: "Este Mundial nos mostró nuevas tendencias tácticas. Los equipos asiáticos sorprendieron con su juego directo y efectivo.",
        likes: 89,
        comments: 34,
        shares: 12
    },
    {
        id: 7,
        user: "MundialStats",
        avatar: "MS",
        time: "hace 3 horas",
        title: "Estadísticas sorprendentes del Mundial",
        content: "Datos que quizás no sabías: Se marcaron 172 goles en total, Messi corrió 65.8 km en toda la competición, y Emiliano Martínez hizo 11 atajadas clave.",
        likes: 78,
        comments: 28,
        shares: 15
    },
    {
        id: 8,
        user: "FutbolFemenino",
        avatar: "FF",
        time: "hace 4 horas",
        title: "El futuro del fútbol femenino post-Mundial",
        content: "Con la atención mundial en el fútbol, es el momento perfecto para impulsar más el fútbol femenino. ¿Qué opinan?",
        likes: 92,
        comments: 37,
        shares: 22
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
function loadPosts() {
    const featuredContainer = document.getElementById('featuredPosts');
    const recentContainer = document.getElementById('recentPosts');
    featuredContainer.innerHTML = featuredPosts.map(post => createPostCard(post)).join('');
    recentContainer.innerHTML = recentPosts.map(post => createPostCard(post)).join('');
}
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}
function viewPost(id) {
    console.log(`Viewing post ${id}`);
    // Here you would navigate to the post detail view
}
function likePost(id) {
    console.log(`Liked post ${id}`);
    // Here you would handle the like functionality
}
function commentPost(id) {
    console.log(`Commenting on post ${id}`);
    // Here you would open the comment section
}
function sharePost(id) {
    console.log(`Sharing post ${id}`);
    // Here you would handle the share functionality
}
// Search functionality
document.querySelector('.search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    console.log(`Searching for: ${searchTerm}`);
    // Here you would implement the search functionality
});
// Load posts when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
});
// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});