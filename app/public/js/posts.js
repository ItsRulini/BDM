document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. ESTRUCTURA DE DATOS MEJORADA ---

    const allWorldCups = [
        { id: 1, name: "Qatar 2022" },
        { id: 2, name: "Rusia 2018" },
        { id: 3, name: "Brasil 2014" },
    ];

    // Ahora cada post pertenece a un mundial (worldCupId) y tiene categorías
    const allPosts = [
        // Posts de Qatar 2022
        { id: 1, worldCupId: 1, user: "AlbicelesteFan", handle: "@argcampeon", avatar: "assets/default-avatar.png", timestamp: new Date('2025-09-15T19:00:00Z'), content: "¡36 años después, campeones del mundo!", image: "...", comments: 1204, likes: 5400, categories: ["Figuras del Torneo"] },
        { id: 2, worldCupId: 1, user: "AnalistaTáctico", handle: "@futbolpro", avatar: "assets/default-avatar.png", timestamp: new Date('2025-09-15T17:00:00Z'), content: "La actuación de Marruecos pasará a la historia.", image: null, comments: 256, likes: 980, categories: ["Partidos Memorables"] },
        { id: 3, worldCupId: 1, user: "GolesMemorables", handle: "@golazos", avatar: "assets/default-avatar.png", timestamp: new Date('2025-09-15T15:00:00Z'), content: "El gol de chilena de Richarlison fue pura magia.", image: "...", comments: 450, likes: 2100, categories: ["Goles Históricos", "Anécdotas y Curiosidades"] },
        { id: 4, worldCupId: 1, user: "VAR Central", handle: "@var_central", avatar: "assets/default-avatar.png", timestamp: new Date('2025-09-15T14:00:00Z'), content: "El penal en la final sigue generando debate.", image: null, comments: 3012, likes: 850, categories: ["Jugadas Polémicas"] },
        { id: 5, worldCupId: 1, user: "FanDelFutbol", handle: "@fan123", avatar: "assets/default-avatar.png", timestamp: new Date('2025-09-15T12:00:00Z'), content: "Este fue el sexto post sobre Qatar.", image: null, comments: 10, likes: 25, categories: [] },

        // Posts de Rusia 2018
        { id: 6, worldCupId: 2, user: "Les Bleus", handle: "@franciafan", avatar: "assets/default-avatar.png", timestamp: new Date('2025-09-14T10:00:00Z'), content: "Mbappé con 19 años dominó el mundial de Rusia. Nació una estrella.", image: "...", comments: 880, likes: 4200, categories: ["Figuras del Torneo"] },
        { id: 7, worldCupId: 2, user: "HistoriaPura", handle: "@historiafutbol", avatar: "assets/default-avatar.png", timestamp: new Date('2025-09-13T11:00:00Z'), content: "El 4-3 de Francia vs Argentina en octavos fue el mejor partido.", image: null, comments: 1500, likes: 3100, categories: ["Partidos Memorables"] },
    ];

    // --- 2. FUNCIONES PARA RENDERIZAR (DIBUJAR) EL CONTENIDO ---

    // Dibuja UNA tarjeta de post. Ahora también incluye las categorías.
    function createPostCard(post) {
        const categoriesHTML = post.categories.map(cat => `<span class="post-category">${cat}</span>`).join('');
        return `
            <article class="post">
                <div class="post-avatar"><img src="${post.avatar}" alt="Avatar" class="user-avatar-small"></div>
                <div class="post-content">
                    <div class="post-header">
                        <span class="user-name">${post.user}</span>
                        <span class="user-handle">${post.handle}</span>
                    </div>
                    <div class="post-body">
                        <p>${post.content}</p>
                        <div class="post-categories">${categoriesHTML}</div>
                    </div>
                    ${post.image ? `<div class="post-media"><img src="${post.image}" alt="Imagen"></div>` : ''}
                    <footer class="post-footer">
                        <button class="action-btn"><i class="fas fa-comment"></i> <span>${post.comments}</span></button>
                        <button class="action-btn"><i class="fas fa-heart"></i> <span>${post.likes}</span></button>
                        <button class="action-btn"><i class="fas fa-upload"></i></button>
                    </footer>
                </div>
            </article>`;
    }

    // Dibuja TODO el feed, organizado por mundial
    function renderFeed(postsToDisplay, sortType = 'recent') {
        const feedContainer = document.getElementById('posts-feed');
        if (!feedContainer) return;

        feedContainer.innerHTML = ''; // Limpiamos el feed antes de redibujar

        allWorldCups.forEach(worldCup => {
            let postsForWorldCup = postsToDisplay.filter(p => p.worldCupId === worldCup.id);

            // Ordenamos los posts según el criterio seleccionado
            switch (sortType) {
                case 'most-likes':
                    postsForWorldCup.sort((a, b) => b.likes - a.likes);
                    break;
                case 'least-likes':
                    postsForWorldCup.sort((a, b) => a.likes - b.likes);
                    break;
                case 'most-comments':
                    postsForWorldCup.sort((a, b) => b.comments - a.comments);
                    break;
                case 'least-comments':
                    postsForWorldCup.sort((a, b) => a.comments - b.comments);
                    break;
                case 'recent':
                default:
                    postsForWorldCup.sort((a, b) => b.timestamp - a.timestamp);
                    break;
            }

            // Solo mostramos las 5 publicaciones más relevantes según el filtro
            const top5Posts = postsForWorldCup.slice(0, 5);

            if (top5Posts.length > 0) {
                const worldCupSection = document.createElement('section');
                worldCupSection.className = 'world-cup-section';
                
                const postsHTML = top5Posts.map(post => createPostCard(post)).join('');

                worldCupSection.innerHTML = `
                    <h2 class="world-cup-title">${worldCup.name}</h2>
                    <div class="posts-container">${postsHTML}</div>
                `;
                feedContainer.appendChild(worldCupSection);
            }
        });
    }

    // --- 3. LÓGICA DE BÚSQUEDA Y ORDENAMIENTO ---

    function handleSearchAndSort() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const sortType = document.getElementById('sort-select').value;

        const filteredPosts = allPosts.filter(post => 
            post.content.toLowerCase().includes(searchTerm) ||
            post.user.toLowerCase().includes(searchTerm) ||
            post.handle.toLowerCase().includes(searchTerm)
        );
        
        renderFeed(filteredPosts, sortType);
    }

    // --- 4. INICIALIZACIÓN Y EVENTOS ---

    // Conectamos las funciones a los elementos del HTML
    document.getElementById('search-input').addEventListener('input', handleSearchAndSort);
    document.getElementById('sort-select').addEventListener('change', handleSearchAndSort);

    // Dibuja el feed por primera vez al cargar la página
    renderFeed(allPosts, 'recent');
});