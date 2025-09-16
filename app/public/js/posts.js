/**
 * Posts Page JavaScript
 * Maneja la funcionalidad de la página de publicaciones
 */

class PostsManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.isLoading = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadPosts();
    }

    initializeElements() {
        // Elementos del DOM
        this.postsContainer = document.getElementById('postsContainer');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.noResults = document.getElementById('noResults');
        this.postsCounter = document.getElementById('postsCount');
        
        // Filtros y búsqueda
        this.searchInput = document.getElementById('searchInput');
        this.filterCountry = document.getElementById('filterCountry');
        this.filterCategory = document.getElementById('filterCategory');
        this.orderBy = document.getElementById('orderBy');
    }

    bindEvents() {
        // Eventos de búsqueda y filtros
        this.searchInput?.addEventListener('input', this.debounce(() => this.filterAndSearch(), 300));
        this.filterCountry?.addEventListener('change', () => this.filterAndSearch());
        this.filterCategory?.addEventListener('change', () => this.filterAndSearch());
        this.orderBy?.addEventListener('change', () => this.filterAndSearch());
        
        // Botón del menú móvil
        window.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    }

    // Utility function para debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async loadPosts() {
        this.showLoading(true);
        
        try {
            // Simulación de carga de datos - aquí conectarías con tu backend
            const mockPosts = this.generateMockPosts();
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.posts = mockPosts;
            this.filteredPosts = [...this.posts];
            this.renderPosts();
            this.updatePostsCounter();
            
        } catch (error) {
            console.error('Error al cargar posts:', error);
            this.showError('Error al cargar las publicaciones');
        } finally {
            this.showLoading(false);
        }
    }

    generateMockPosts() {
        const categories = ['analisis', 'historia', 'estadisticas', 'curiosidades', 'predicciones'];
        const mundiales = [
            { id: 1, name: 'Brasil 2014', country: 'brasil', year: 2014 },
            { id: 2, name: 'Rusia 2018', country: 'rusia', year: 2018 },
            { id: 3, name: 'Qatar 2022', country: 'qatar', year: 2022 },
            { id: 4, name: 'México 1986', country: 'mexico', year: 1986 },
            { id: 5, name: 'Francia 1998', country: 'francia', year: 1998 },
            { id: 6, name: 'Alemania 2006', country: 'alemania', year: 2006 },
            { id: 7, name: 'Sudáfrica 2010', country: 'sudafrica', year: 2010 }
        ];
        
        const users = [
            { name: 'Carlos Rodríguez', avatar: 'assets/avatars/user1.jpg' },
            { name: 'María González', avatar: 'assets/avatars/user2.jpg' },
            { name: 'Diego Martín', avatar: 'assets/avatars/user3.jpg' },
            { name: 'Ana López', avatar: 'assets/avatars/user4.jpg' },
            { name: 'Roberto Silva', avatar: 'assets/avatars/user5.jpg' }
        ];

        const samplePosts = [
            {
                id: 1,
                title: "El gol más importante en la historia de los mundiales",
                content: "Analizamos los goles que cambiaron el curso de la historia en las Copas del Mundo. Desde el gol de Maradona en 1986 hasta el penal de Messi en 2022.",
                category: "historia",
                mundial: mundiales[3], // México 1986
                user: users[0],
                date: "2024-03-15",
                likes: 234,
                comments: 45,
                multimedia: [
                    { type: 'image', src: 'assets/posts/gol-maradona-1.jpg', alt: 'Gol de Maradona' },
                    { type: 'video', src: 'assets/posts/gol-maradona.mp4', poster: 'assets/posts/gol-maradona-poster.jpg' },
                    { type: 'image', src: 'assets/posts/gol-maradona-2.jpg', alt: 'Celebración' }
                ],
                liked: false
            },
            {
                id: 2,
                title: "Estadísticas sorprendentes del Mundial de Qatar 2022",
                content: "Los números que quizás no conocías del último mundial. Records, datos curiosos y análisis estadístico profundo del torneo más visto de la historia.",
                category: "estadisticas",
                mundial: mundiales[2], // Qatar 2022
                user: users[1],
                date: "2024-03-14",
                likes: 156,
                comments: 28,
                multimedia: [
                    { type: 'image', src: 'assets/posts/estadisticas-qatar-1.jpg', alt: 'Estadísticas Qatar' },
                    { type: 'image', src: 'assets/posts/estadisticas-qatar-2.jpg', alt: 'Gráficos' }
                ],
                liked: true
            },
            {
                id: 3,
                title: "Predicciones para el próximo Mundial 2026",
                content: "¿Qué selecciones tienen más posibilidades? Análisis detallado de las selecciones favoritas para el Mundial que se disputará en Estados Unidos, México y Canadá.",
                category: "predicciones",
                mundial: mundiales[1], // Rusia 2018
                user: users[2],
                date: "2024-03-13",
                likes: 189,
                comments: 67,
                multimedia: [
                    { type: 'video', src: 'assets/posts/predicciones-2026.mp4', poster: 'assets/posts/predicciones-poster.jpg' },
                    { type: 'image', src: 'assets/posts/mundial-2026-1.jpg', alt: 'Logo Mundial 2026' },
                    { type: 'image', src: 'assets/posts/mundial-2026-2.jpg', alt: 'Sedes' }
                ],
                liked: false
            }
        ];

        // Generar más posts para pruebas
        const generatedPosts = [];
        for (let i = 0; i < 15; i++) {
            const basePost = samplePosts[i % samplePosts.length];
            const randomMundial = mundiales[Math.floor(Math.random() * mundiales.length)];
            generatedPosts.push({
                ...basePost,
                id: i + 1,
                title: `${basePost.title} - Post ${i + 1}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                mundial: randomMundial,
                user: users[Math.floor(Math.random() * users.length)],
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                likes: Math.floor(Math.random() * 500) + 10,
                comments: Math.floor(Math.random() * 100) + 1,
                liked: Math.random() > 0.7
            });
        }

        return generatedPosts;
    }

    filterAndSearch() {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        const mundialFilter = this.filterCountry?.value || '';
        const categoryFilter = this.filterCategory?.value || '';
        const orderValue = this.orderBy?.value || '';

        this.filteredPosts = this.posts.filter(post => {
            const matchesSearch = searchTerm === '' || 
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.user.name.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm) ||
                post.mundial.name.toLowerCase().includes(searchTerm);

            const matchesMundial = mundialFilter === '' || post.mundial.country.toLowerCase() === mundialFilter;
            const matchesCategory = categoryFilter === '' || post.category === categoryFilter;

            return matchesSearch && matchesMundial && matchesCategory;
        });

        // Aplicar ordenamiento
        this.sortPosts(orderValue);
        
        this.renderPosts();
        this.updatePostsCounter();
    }

    sortPosts(orderValue) {
        switch (orderValue) {
            case 'likes_desc':
                this.filteredPosts.sort((a, b) => b.likes - a.likes);
                break;
            case 'likes_asc':
                this.filteredPosts.sort((a, b) => a.likes - b.likes);
                break;
            case 'comments_desc':
                this.filteredPosts.sort((a, b) => b.comments - a.comments);
                break;
            case 'comments_asc':
                this.filteredPosts.sort((a, b) => a.comments - b.comments);
                break;
            case 'date_desc':
                this.filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date_asc':
                this.filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            default:
                // Orden por defecto: más recientes primero
                this.filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }

    renderPosts() {
        if (!this.postsContainer) return;

        if (this.filteredPosts.length === 0) {
            this.showNoResults(true);
            this.postsContainer.innerHTML = '';
            return;
        }

        this.showNoResults(false);
        this.postsContainer.innerHTML = this.filteredPosts.map(post => this.createPostHTML(post)).join('');
        
        // Agregar eventos a los botones de interacción
        this.bindPostInteractions();

        // Inicializar carruseles
        this.initializeCarousels();

        // Añadir animación de fade-in
        this.postsContainer.querySelectorAll('.post-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    createPostHTML(post) {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        };

        const formatCategory = (category) => {
            const categoryMap = {
                'analisis': 'Análisis',
                'historia': 'Historia',
                'estadisticas': 'Estadísticas',
                'curiosidades': 'Curiosidades',
                'predicciones': 'Predicciones'
            };
            return categoryMap[category] || category;
        };

        const formatMundial = (mundial) => {
            return `${mundial.name}`;
        };

        const createMultimediaCarousel = (multimedia) => {
            if (!multimedia || multimedia.length === 0) return '';
            
            const carouselId = `carousel-${post.id}`;
            
            const slides = multimedia.map((item, index) => {
                if (item.type === 'image') {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${item.src}" alt="${item.alt}" onerror="this.parentElement.style.display='none'">
                        </div>
                    `;
                } else if (item.type === 'video') {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <video controls poster="${item.poster || ''}" preload="metadata">
                                <source src="${item.src}" type="video/mp4">
                                Tu navegador no soporta el elemento video.
                            </video>
                        </div>
                    `;
                }
                return '';
            }).join('');

            const indicators = multimedia.length > 1 ? multimedia.map((_, index) => 
                `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>`
            ).join('') : '';

            const navigation = multimedia.length > 1 ? `
                <button class="carousel-nav prev" aria-label="Anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next" aria-label="Siguiente">
                    <i class="fas fa-chevron-right"></i>
                </button>
            ` : '';

            return `
                <div class="post-multimedia">
                    <div class="multimedia-carousel" id="${carouselId}">
                        <div class="carousel-container">
                            ${slides}
                        </div>
                        ${navigation}
                        ${indicators ? `<div class="carousel-indicators">${indicators}</div>` : ''}
                    </div>
                </div>
            `;
        };

        return `
            <article class="post-card" data-post-id="${post.id}">
                <div class="post-mundial">
                    <span>${formatMundial(post.mundial)}</span>
                </div>
                
                <div class="post-category">
                    <span>${formatCategory(post.category)}</span>
                </div>
                
                <div class="post-header">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-meta">
                        <div class="post-author">
                            <img src="${post.user.avatar}" alt="${post.user.name}" class="profile-pic" 
                                 onerror="this.src='assets/default-avatar.png'">
                            <span>por ${post.user.name}</span>
                        </div>
                        <div class="post-date">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${formatDate(post.date)}</span>
                        </div>
                    </div>
                </div>

                <div class="post-content">
                    <p class="post-text">${post.content}</p>
                    ${createMultimediaCarousel(post.multimedia)}
                </div>

                <div class="post-interactions">
                    <div class="interaction-buttons">
                        <button class="like-btn ${post.liked ? 'liked' : ''}" 
                                data-post-id="${post.id}" 
                                aria-label="Dar like a esta publicación">
                            <i class="fas fa-thumbs-up"></i>
                            Like
                            <span class="interaction-count">${post.likes}</span>
                        </button>
                        <button class="comment-btn" 
                                data-post-id="${post.id}"
                                aria-label="Ver comentarios">
                            <i class="fas fa-comment"></i>
                            Comentar
                            <span class="interaction-count">${post.comments}</span>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    initializeCarousels() {
        const carousels = this.postsContainer.querySelectorAll('.multimedia-carousel');
        
        carousels.forEach(carousel => {
            this.setupCarousel(carousel);
        });
    }

    setupCarousel(carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        const prevBtn = carousel.querySelector('.carousel-nav.prev');
        const nextBtn = carousel.querySelector('.carousel-nav.next');
        
        if (slides.length <= 1) return;

        let currentSlide = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            currentSlide = index;
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        };

        const prevSlide = () => {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        };

        // Event listeners
        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => showSlide(index));
        });

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
    }

    bindPostInteractions() {
        // Eventos para botones de like
        const likeButtons = this.postsContainer.querySelectorAll('.like-btn');
        likeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleLike(e));
        });

        // Eventos para botones de comentarios
        const commentButtons = this.postsContainer.querySelectorAll('.comment-btn');
        commentButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleComment(e));
        });
    }

    handleLike(event) {
        const button = event.currentTarget;
        const postId = parseInt(button.dataset.postId);
        const post = this.posts.find(p => p.id === postId);
        
        if (!post) return;

        // Toggle like status
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;

        // Update button UI
        button.classList.toggle('liked', post.liked);
        const countSpan = button.querySelector('.interaction-count');
        countSpan.textContent = post.likes;

        // Add animation effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Aquí enviarías la información al backend
        this.sendLikeToServer(postId, post.liked);
    }

    handleComment(event) {
        const button = event.currentTarget;
        const postId = parseInt(button.dataset.postId);
        
        // Aquí implementarías la lógica para mostrar/ocultar comentarios
        // Por ahora solo mostramos una alerta como placeholder
        alert(`Funcionalidad de comentarios para el post ${postId} - En desarrollo`);
        
        // En el futuro, esto podría abrir un modal de comentarios o
        // navegar a una página de detalle del post
    }

    async sendLikeToServer(postId, liked) {
        try {
            // Simulación de petición al servidor
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ liked })
            });
            
            if (!response.ok) {
                throw new Error('Error al procesar like');
            }
            
            console.log(`Like ${liked ? 'agregado' : 'removido'} para post ${postId}`);
        } catch (error) {
            console.error('Error al enviar like:', error);
            // Aquí podrías revertir el cambio en la UI si falla el servidor
        }
    }

    showLoading(show) {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = show ? 'flex' : 'none';
        }
    }

    showNoResults(show) {
        if (this.noResults) {
            this.noResults.style.display = show ? 'block' : 'none';
        }
    }

    updatePostsCounter() {
        if (this.postsCounter) {
            const total = this.filteredPosts.length;
            this.postsCounter.textContent = `Mostrando ${total} publicaciones`;
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileMenu && hamburger) {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }
    }

    showError(message) {
        // Crear elemento de error temporal
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Funciones utilitarias globales
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    const intervals = [
        { label: 'año', seconds: 31536000 },
        { label: 'mes', seconds: 2592000 },
        { label: 'semana', seconds: 604800 },
        { label: 'día', seconds: 86400 },
        { label: 'hora', seconds: 3600 },
        { label: 'minuto', seconds: 60 }
    ];
    
    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`;
        }
    }
    
    return 'hace un momento';
}

function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Funciones para manejar errores de imágenes
function handleImageError(img) {
    img.style.display = 'none';
    const parent = img.closest('.post-multimedia');
    if (parent && parent.children.length === 1) {
        parent.style.display = 'none';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que estamos en la página de posts
    if (document.getElementById('postsContainer')) {
        window.postsManager = new PostsManager();
    }
});

// Manejar clicks fuera del menú móvil para cerrarlo
document.addEventListener('click', (event) => {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    if (mobileMenu && hamburger && 
        mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(event.target) && 
        !hamburger.contains(event.target)) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Lazy loading para imágenes (opcional)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    // Observer para imágenes lazy
    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}   