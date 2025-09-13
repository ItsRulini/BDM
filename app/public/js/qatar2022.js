// Datos de ejemplo específicos del Mundial Qatar 2022
const qatar2022Posts = [
    {
        id: 1, user: "AlbicelesteFan", handle: "@argcampeon", avatar: "assets/default-avatar.png", time: "1h",
        content: "¡POR FIN! 36 años después, somos campeones del mundo. Gracias eternas a Messi y a todo el equipo. ¡Qué final de infarto!",
        image: "https://e00-marca.uecdn.es/assets/multimedia/imagenes/2022/12/18/1671388 marca_18_12_22_arg_fra_partido_final_mundial_qatar_2022_12_crop1671391583279.jpg",
        comments: 1204, retweets: 890, likes: 5400
    },
    {
        id: 2, user: "AnalistaTáctico", handle: "@futbolpro", avatar: "assets/default-avatar.png", time: "3h",
        content: "La actuación de Marruecos en este mundial pasará a la historia. Demostraron que con orden táctico y corazón se puede competir contra cualquiera. ¡Increíble semifinal!",
        image: null,
        comments: 256, retweets: 180, likes: 980
    },
    {
        id: 3, user: "GolesMemorables", handle: "@golazos", avatar: "assets/default-avatar.png", time: "5h",
        content: "El gol de chilena de Richarlison contra Serbia. Sin duda, el mejor gol de todo el torneo. Pura magia brasileña. 🇧🇷✨",
        image: "https://e00-marca.uecdn.es/assets/multimedia/imagenes/2022/11/24/16693214479986.jpg",
        comments: 450, retweets: 320, likes: 2100
    }
];

// Función para crear la tarjeta de una publicación (sin cambios)
function createPostCard(post) {
    return `
        <article class="post">
            <div class="post-avatar">
                <img src="${post.avatar}" alt="Avatar" class="user-avatar-small">
            </div>
            <div class="post-content">
                <div class="post-header">
                    <span class="user-name">${post.user}</span>
                    <span class="user-handle">${post.handle}</span>
                    <span class="post-time">· ${post.time}</span>
                </div>
                <div class="post-body">
                    <p>${post.content}</p>
                </div>
                ${post.image ? `<div class="post-media"><img src="${post.image}" alt="Imagen de la publicación"></div>` : ''}
                <footer class="post-footer">
                    <button class="action-btn"><i class="fas fa-comment"></i> <span>${post.comments}</span></button>
                    <button class="action-btn"><i class="fas fa-retweet"></i> <span>${post.retweets}</span></button>
                    <button class="action-btn"><i class="fas fa-heart"></i> <span>${post.likes}</span></button>
                    <button class="action-btn"><i class="fas fa-upload"></i></button>
                </footer>
            </div>
        </article>
    `;
}

// Función para mostrar las publicaciones en el feed
function displayPosts(posts) {
    // Apuntamos al nuevo ID del contenedor de esta página
    const feedContainer = document.getElementById('posts-feed-qatar2022');
    if (feedContainer) {
        feedContainer.innerHTML = posts.map(post => createPostCard(post)).join('');
    }
}

// Se ejecuta cuando la página ha cargado
document.addEventListener('DOMContentLoaded', function() {
    // Usamos la nueva variable de datos
    displayPosts(qatar2022Posts);
});