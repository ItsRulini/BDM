/**
 * Posts Admin Page JavaScript
 * Maneja la funcionalidad de administración de publicaciones
 */

class PostsAdminManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.isLoading = false;
        this.currentPostId = null;
        this.postComments = [];
        this.currentDeleteTarget = null;
        
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

        // Modal de detalles de post
        this.postDetailModal = document.getElementById('postDetailModal');
        
        // Modal de comentarios
        this.commentsModal = document.getElementById('commentsModal');
        this.commentsList = document.getElementById('commentsList');
        this.noComments = document.getElementById('noComments');
        this.loadingComments = document.getElementById('loadingComments');
        
        // Modal de confirmación
        this.confirmDeleteModal = document.getElementById('confirmDeleteModal');
        this.confirmDeleteMessage = document.getElementById('confirmDeleteMessage');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        
        // Overlay
        this.modalOverlay = document.getElementById('modalOverlay');

        // Cargar opciones de filtros
        this.loadDropdownOptions();
    }

    async loadDropdownOptions() {
        try {
            // Cargar mundiales reales
            const mundialesResponse = await fetch('index.php?controller=api&action=getMundiales');
            const mundialesData = await mundialesResponse.json();

            if (mundialesData.success && Array.isArray(mundialesData.data)) {
                const mundiales = mundialesData.data.sort((a, b) => b.year - a.year);
                if (this.filterCountry) {
                    const options = ['<option value="">Todos los mundiales</option>']
                        .concat(mundiales.map(m => `<option value="${m.name}">${m.name}</option>`));
                    this.filterCountry.innerHTML = options.join('');
                }
            }

            // Cargar categorías reales
            const categoriasResponse = await fetch('index.php?controller=api&action=getCategorias');
            const categoriasData = await categoriasResponse.json();

            if (categoriasData.success && Array.isArray(categoriasData.data)) {
                const categorias = categoriasData.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
                if (this.filterCategory) {
                    const options = ['<option value="">Todas las categorías</option>']
                        .concat(categorias.map(c => `<option value="${c.nombre.toLowerCase()}">${c.nombre}</option>`));
                    this.filterCategory.innerHTML = options.join('');
                }
            }

        } catch (error) {
            console.error('Error al cargar opciones de filtro:', error);
        }
    }

    bindEvents() {
        // Eventos de búsqueda y filtros
        this.searchInput?.addEventListener('input', this.debounce(() => this.filterAndSearch(), 300));
        this.filterCountry?.addEventListener('change', () => this.filterAndSearch());
        this.filterCategory?.addEventListener('change', () => this.filterAndSearch());
        this.orderBy?.addEventListener('change', () => this.filterAndSearch());
        
        // Eventos del overlay
        this.modalOverlay?.addEventListener('click', () => this.closeAllModals());
        
        // Eventos globales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });

        // Funciones globales
        window.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        window.openPostDetail = this.openPostDetail.bind(this);
        window.closePostDetailModal = this.closePostDetailModal.bind(this);
        window.closeCommentsModal = this.closeCommentsModal.bind(this);
        window.closeConfirmDeleteModal = this.closeConfirmDeleteModal.bind(this);
        window.logout = this.logout.bind(this);
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
            // Obtener posts reales desde la API
            const response = await fetch('index.php?controller=api&action=getTodasPublicaciones');
            if (!response.ok) throw new Error('Error al cargar las publicaciones');
            
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Error al obtener posts');

            // Filtrar solo posts APROBADOS y mapear datos reales
            this.posts = (data.data || [])
                .filter(post => post.estatus === 'Aprobado' || post.estatus === 'Aprobada' || post.estatus === 'approved')
                .map(post => ({
                    id: post.id,
                    title: post.contenido.substring(0, 50),
                    content: post.contenido,
                    estatus: post.estatus,
                    autorNombre: post.autorNombre,
                    idCreador: post.idCreador,
                    mundialAño: post.mundialAño || 'Sin mundial',
                    sedes: post.sedes || '',
                    categorias: Array.isArray(post.categorias) ? post.categorias : [],
                    mundial: {
                        name: (post.sedes && post.mundialAño) ? `${post.sedes} ${post.mundialAño}` : (post.mundialAño || 'Sin mundial'),
                        year: post.mundialAño ? parseInt(post.mundialAño.split(' ')[0]) : 0
                    },
                    category: Array.isArray(post.categorias) && post.categorias.length > 0 ? post.categorias[0].toLowerCase() : 'general',
                    user: {
                        name: post.autorNombre,
                        avatar: 'assets/default-avatar.png'
                    },
                    date: post.fechaCreacion,
                    multimedia: (post.multimedia || []).map(media => ({
                        id: media.id,
                        src: media.src,
                        type: media.type.startsWith('image/') ? 'image' : 
                              media.type.startsWith('video/') ? 'video' : 'file',
                        alt: 'Media'
                    })),
                    views: post.views || 0,
                    likes: post.likes || 0,
                    comments: post.comments || 0
                }));
            
            this.filteredPosts = [...this.posts];
            this.renderPosts();
            this.updatePostsCounter();
            
        } catch (error) {
            console.error('Error al cargar posts:', error);
            this.showError('Error al cargar las publicaciones: ' + error.message);
            this.posts = [];
            this.filteredPosts = [];
            this.renderPosts();
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
                title: "El gol más importante en la historia de los mundiales",
                content: "Analizamos los goles que cambiaron el curso de la historia en las Copas del Mundo. Desde el gol de Maradona en 1986 hasta el penal de Messi en 2022. Un recorrido por los momentos más decisivos del fútbol mundial que quedaron grabados en la memoria de todos los aficionados.",
                category: "historia",
                multimedia: [
                    { type: 'image', src: 'assets/posts/gol-maradona-1.jpg', alt: 'Gol de Maradona' },
                    { type: 'video', src: 'assets/posts/gol-maradona.mp4', poster: 'assets/posts/gol-maradona-poster.jpg' },
                    { type: 'image', src: 'assets/posts/gol-maradona-2.jpg', alt: 'Celebración' }
                ]
            },
            {
                title: "Estadísticas sorprendentes del Mundial de Qatar 2022",
                content: "Los números que quizás no conocías del último mundial. Records, datos curiosos y análisis estadístico profundo del torneo más visto de la historia. Desde la cantidad de goles hasta las distancias recorridas por los jugadores.",
                category: "estadisticas",
                multimedia: [
                    { type: 'image', src: 'assets/posts/estadisticas-qatar-1.jpg', alt: 'Estadísticas Qatar' },
                    { type: 'image', src: 'assets/posts/estadisticas-qatar-2.jpg', alt: 'Gráficos' }
                ]
            },
            {
                title: "Predicciones para el próximo Mundial 2026",
                content: "¿Qué selecciones tienen más posibilidades? Análisis detallado de las selecciones favoritas para el Mundial que se disputará en Estados Unidos, México y Canadá. Un torneo que promete ser histórico por su formato expandido.",
                category: "predicciones",
                multimedia: [
                    { type: 'video', src: 'assets/posts/predicciones-2026.mp4', poster: 'assets/posts/predicciones-poster.jpg' },
                    { type: 'image', src: 'assets/posts/mundial-2026-1.jpg', alt: 'Logo Mundial 2026' },
                    { type: 'image', src: 'assets/posts/mundial-2026-2.jpg', alt: 'Sedes' }
                ]
            },
            {
                title: "Los arqueros más legendarios de los mundiales",
                content: "Un repaso por los porteros que marcaron época en las Copas del Mundo. Desde Lev Yashin hasta Emiliano Martínez, estos guardametas dejaron su huella imborrable en la historia del fútbol mundial.",
                category: "historia",
                multimedia: [
                    { type: 'image', src: 'assets/posts/arqueros-1.jpg', alt: 'Arqueros legendarios' },
                    { type: 'image', src: 'assets/posts/arqueros-2.jpg', alt: 'Atajadas históricas' }
                ]
            }
        ];

        // Generar posts para pruebas
        const generatedPosts = [];
        for (let i = 0; i < 20; i++) {
            const basePost = samplePosts[i % samplePosts.length];
            const randomMundial = mundiales[Math.floor(Math.random() * mundiales.length)];
            generatedPosts.push({
                ...basePost,
                id: i + 1,
                title: i === 0 ? basePost.title : `${basePost.title} - Análisis ${i + 1}`,
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
            const contenido = (post.content || '').toLowerCase();
            const autor = (post.autorNombre || '').toLowerCase();
            const mundialNombre = (post.sedes && post.mundialAño) ? 
                `${post.sedes} ${post.mundialAño}`.toLowerCase() : 
                (post.mundialAño || '').toLowerCase();
            const categorias = Array.isArray(post.categorias) ? 
                post.categorias.map(c => c.toLowerCase()) : [];

            // Búsqueda por texto en contenido, autor, mundial o categorías
            const matchesSearch = searchTerm === '' ||
                contenido.includes(searchTerm) ||
                autor.includes(searchTerm) ||
                mundialNombre.includes(searchTerm) ||
                categorias.some(cat => cat.includes(searchTerm));

            // Filtro por mundial (comparación exacta con el nombre completo)
            const matchesMundial = mundialFilter === '' || 
                mundialNombre === mundialFilter.toLowerCase() ||
                mundialNombre.includes(mundialFilter.toLowerCase());

            // Filtro por categoría (coincidencia exacta)
            const matchesCategory = categoryFilter === '' || 
                categorias.some(cat => cat === categoryFilter);

            return matchesSearch && matchesMundial && matchesCategory;
        });

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
        this.postsContainer.innerHTML = this.filteredPosts.map(post => this.createPostCardHTML(post)).join('');
        
        // Cargar estadísticas reales para cada post
        this.filteredPosts.forEach(post => {
            this.loadPostStatsForCard(post.id);
        });
        
        // Añadir animación de fade-in
        this.postsContainer.querySelectorAll('.admin-post-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    async loadPostStatsForCard(postId) {
        try {
            const response = await fetch(`index.php?controller=api&action=getPostStats&id=${postId}`);
            if (!response.ok) throw new Error('Error al cargar estadísticas');
            
            const data = await response.json();
            if (data.success) {
                const stats = data.data || {};
                // Actualizar el post en memoria
                const post = this.posts.find(p => p.id === postId);
                if (post) {
                    post.likes = stats.likes || 0;
                    post.comments = stats.comments || 0;
                    
                    // Actualizar en el DOM
                    const card = this.postsContainer.querySelector(`[data-post-id="${postId}"]`);
                    if (card) {
                        const likesSpan = card.querySelector('.post-card-stats .stat:nth-child(1) span');
                        const commentsSpan = card.querySelector('.post-card-stats .stat:nth-child(2) span');
                        if (likesSpan) likesSpan.textContent = stats.likes || 0;
                        if (commentsSpan) commentsSpan.textContent = stats.comments || 0;
                    }
                }
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    }

    createPostCardHTML(post) {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'short', 
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

        const getPreviewMedia = (multimedia) => {
            if (!multimedia || multimedia.length === 0) return '';
            
            const firstMedia = multimedia[0];
            const mediaCount = multimedia.length > 1 ? 
                `<div class="media-count"><i class="fas fa-layer-group"></i> ${multimedia.length}</div>` : '';
            
            if (firstMedia.type === 'image') {
                return `
                    <div class="post-card-preview">
                        <img src="${firstMedia.src}" alt="${firstMedia.alt}" onerror="this.parentElement.style.display='none'">
                        ${mediaCount}
                        <div class="media-indicator"><i class="fas fa-image"></i> Imagen</div>
                    </div>
                `;
            } else if (firstMedia.type === 'video') {
                return `
                    <div class="post-card-preview">
                        <video poster="${firstMedia.poster || ''}" preload="metadata" muted>
                            <source src="${firstMedia.src}" type="video/mp4">
                        </video>
                        ${mediaCount}
                        <div class="media-indicator"><i class="fas fa-play"></i> Video</div>
                    </div>
                `;
            }
            return '';
        };

        return `
            <div class="admin-post-card" data-post-id="${post.id}" onclick="openPostDetail(${post.id})">
                <div class="post-card-header">
                    <div class="post-card-badges">
                        <span class="post-card-mundial">${post.mundial.name}</span>
                        <span class="post-card-category">${formatCategory(post.category)}</span>
                    </div>
                    <h3 class="post-card-title">${post.title}</h3>
                </div>
                
                <div class="post-card-body">
                    <div class="post-card-author">
                        <img src="${post.user.avatar}" alt="${post.user.name}" class="post-card-avatar" 
                             onerror="this.src='assets/default-avatar.png'">
                        <span class="post-card-author-name">${post.user.name}</span>
                    </div>
                    
                    <p class="post-card-text">${post.content}</p>
                    
                    ${getPreviewMedia(post.multimedia)}
                </div>
                
                <div class="post-card-footer">
                    <div class="post-card-stats">
                        <div class="stat">
                            <i class="fas fa-heart"></i>
                            <span>${post.likes}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-comment"></i>
                            <span>${post.comments}</span>
                        </div>
                    </div>
                    <div class="post-card-date">${formatDate(post.date)}</div>
                </div>
            </div>
        `;
    }

    // ================================
    // POST DETAIL MODAL
    // ================================

    openPostDetail(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.currentPostId = postId;
        this.populatePostDetail(post);
        this.loadPostStatsForDetail(postId);  // Cargar estadísticas reales
        this.showModal('postDetailModal');
    }

    async loadPostStatsForDetail(postId) {
        try {
            const response = await fetch(`index.php?controller=api&action=getPostStats&id=${postId}`);
            if (!response.ok) throw new Error('Error al cargar estadísticas');
            
            const data = await response.json();
            if (data.success) {
                const stats = data.data || {};
                document.getElementById('postDetailLikes').textContent = stats.likes || 0;
                document.getElementById('postDetailCommentsCount').textContent = stats.comments || 0;
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    }

    populatePostDetail(post) {
        // Título del modal
        const modalTitle = document.getElementById('modalPostTitle');
        if (modalTitle) {
            modalTitle.innerHTML = `<i class="fas fa-eye"></i> ${post.title}`;
        }

        // Badges
        document.getElementById('postDetailMundial').textContent = post.mundial.name;
        document.getElementById('postDetailCategory').textContent = this.formatCategory(post.category);
        
        // Título y contenido
        document.getElementById('postDetailTitle').textContent = post.title;
        document.getElementById('postDetailText').textContent = post.content;
        
        // Autor
        const avatar = document.getElementById('postDetailAvatar');
        avatar.src = post.user.avatar;
        avatar.alt = post.user.name;
        avatar.onerror = () => avatar.src = 'assets/default-avatar.png';
        
        document.getElementById('postDetailAuthor').textContent = post.user.name;
        document.getElementById('postDetailDate').textContent = this.formatDate(post.date);
        
        // Estadísticas
        document.getElementById('postDetailLikes').textContent = post.likes;
        document.getElementById('postDetailCommentsCount').textContent = post.comments;
        
        // Multimedia
        this.populatePostMultimedia(post.multimedia);
        
        // Eventos de botones
        const viewCommentsBtn = document.getElementById('viewCommentsBtn');
        
        viewCommentsBtn.onclick = () => this.openCommentsModal(post.id);
    }

    populatePostMultimedia(multimedia) {
        const container = document.getElementById('postDetailMultimedia');
        if (!multimedia || multimedia.length === 0) {
            container.innerHTML = '';
            return;
        }

        const carouselId = `detail-carousel-${this.currentPostId}`;
        
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

        container.innerHTML = `
            <div class="multimedia-carousel" id="${carouselId}">
                <div class="carousel-container">
                    ${slides}
                </div>
                ${navigation}
                ${indicators ? `<div class="carousel-indicators">${indicators}</div>` : ''}
            </div>
        `;

        // Inicializar carousel si hay múltiples elementos
        if (multimedia.length > 1) {
            this.initializeDetailCarousel(carouselId);
        }
    }

    initializeDetailCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        const prevBtn = carousel.querySelector('.carousel-nav.prev');
        const nextBtn = carousel.querySelector('.carousel-nav.next');
        
        let currentSlide = 0;
        let autoSlideInterval = null;
        let isTransitioning = false;

        const showSlide = (index, direction = 'next') => {
            if (isTransitioning) return;
            isTransitioning = true;

            // Ocultar slide actual
            const currentSlideElement = slides[currentSlide];
            currentSlideElement.style.transform = direction === 'next' ? 'translateX(-20px)' : 'translateX(20px)';
            currentSlideElement.classList.remove('active');

            // Mostrar nuevo slide
            setTimeout(() => {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                    slide.style.transform = i === index ? 'translateX(0)' : 
                        (i < index ? 'translateX(-20px)' : 'translateX(20px)');
                });
                
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === index);
                });
                
                currentSlide = index;
                isTransitioning = false;
            }, 150);
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next, 'next');
        };

        const prevSlide = () => {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev, 'prev');
        };

        const startAutoSlide = () => {
            if (slides.length <= 1) return;
            autoSlideInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        };

        // Event listeners
        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
            stopAutoSlide();
        });
        
        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
            stopAutoSlide();
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(index);
                stopAutoSlide();
            });
        });

        // Auto-slide y pause en hover
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);

        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    stopAutoSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    stopAutoSlide();
                    break;
            }
        });

        // Touch/swipe support para móviles
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            
            if (Math.abs(touchStartX - touchEndX) > swipeThreshold) {
                if (touchStartX > touchEndX + swipeThreshold) {
                    nextSlide(); // Swipe left - next slide
                } else if (touchStartX < touchEndX - swipeThreshold) {
                    prevSlide(); // Swipe right - previous slide
                }
            }
        });

        // Inicializar auto-slide
        startAutoSlide();

        // Cleanup cuando se cierre el modal
        const cleanup = () => {
            stopAutoSlide();
            carousel.removeEventListener('mouseenter', stopAutoSlide);
            carousel.removeEventListener('mouseleave', startAutoSlide);
        };

        // Almacenar función de cleanup para uso posterior
        carousel._cleanup = cleanup;
    }

    closePostDetailModal() {
        // Limpiar carrusel si existe
        const carousel = document.querySelector('[id^="detail-carousel-"]');
        if (carousel && carousel._cleanup) {
            carousel._cleanup();
        }
        
        this.hideModal('postDetailModal');
        this.currentPostId = null;
    }

    // ================================
    // COMMENTS MODAL
    // ================================

    async openCommentsModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.currentPostId = postId;
        this.hideModal('postDetailModal');
        this.showModal('commentsModal');
        this.populateCommentsPostSummary(post);
        await this.loadPostComments(postId);
    }

    populateCommentsPostSummary(post) {
        const title = document.getElementById('commentPostTitle');
        const author = document.getElementById('commentPostAuthor');
        const date = document.getElementById('commentPostDate');

        if (title) title.textContent = post.title;
        if (author) author.textContent = `Por ${post.user.name}`;
        if (date) date.textContent = this.formatDate(post.date);
    }

    async loadPostComments(postId) {
        if (this.loadingComments) {
            this.loadingComments.style.display = 'flex';
        }
        
        try {
            // Cargar comentarios reales desde la API
            const response = await fetch(`index.php?controller=api&action=getComments&id=${postId}&limit=50`);
            if (!response.ok) throw new Error('Error al cargar comentarios');
            
            const data = await response.json();
            
            if (data.success) {
                this.postComments = (data.data || []).map(comment => ({
                    id: comment.id,
                    user: {
                        name: comment.user.name,
                        avatar: comment.user.fotoPerfil || 'assets/default-avatar.png'
                    },
                    comment: comment.text,
                    date: comment.date,
                    timestamp: comment.date
                }));
            } else {
                this.postComments = [];
            }
            
            this.renderComments();
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
            this.showError('Error al cargar los comentarios');
            this.postComments = [];
            this.renderComments();
        } finally {
            if (this.loadingComments) {
                this.loadingComments.style.display = 'none';
            }
        }
    }

    generateMockComments(postId) {
        const users = [
            { name: 'Ana García', avatar: 'assets/avatars/user1.jpg' },
            { name: 'Luis Martínez', avatar: 'assets/avatars/user2.jpg' },
            { name: 'Sofia López', avatar: 'assets/avatars/user3.jpg' },
            { name: 'Miguel Torres', avatar: 'assets/avatars/user4.jpg' },
            { name: 'Carmen Ruiz', avatar: 'assets/avatars/user5.jpg' }
        ];

        const sampleComments = [
            "¡Excelente análisis! Me encantó tu perspectiva sobre este mundial.",
            "Totalmente de acuerdo contigo. Ese mundial fue histórico por muchas razones.",
            "Muy interesante tu punto de vista. ¿Podrías profundizar más en este tema?",
            "No había pensado en eso antes. Gracias por compartir esta información.",
            "Gran post! Me trae muchos recuerdos de ese mundial.",
            "Interesante teoría, aunque creo que hay otros factores a considerar.",
            "¡Qué nostalgia! Recuerdo ver ese mundial con mi familia.",
            "Datos muy útiles. ¿Tienes alguna fuente para profundizar más?",
            "Me parece una observación muy acertada sobre el fútbol moderno.",
            "Gracias por tomarte el tiempo de escribir esto tan detalladamente."
        ];

        const numComments = Math.floor(Math.random() * 8) + 2; // 2-9 comentarios
        const comments = [];

        for (let i = 0; i < numComments; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
            const randomDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

            comments.push({
                id: i + 1,
                user: randomUser,
                comment: randomComment,
                date: randomDate.toISOString().split('T')[0],
                timestamp: randomDate.toISOString()
            });
        }

        // Ordenar por fecha más reciente primero
        return comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    renderComments() {
        if (!this.commentsList) return;

        // Actualizar contador
        const commentsCount = document.getElementById('commentsCount');
        if (commentsCount) {
            commentsCount.textContent = this.postComments.length;
        }

        if (this.postComments.length === 0) {
            this.commentsList.style.display = 'none';
            this.noComments.style.display = 'block';
            return;
        }

        this.commentsList.style.display = 'block';
        this.noComments.style.display = 'none';

        this.commentsList.innerHTML = this.postComments.map(comment => this.createCommentHTML(comment)).join('');
    }

    createCommentHTML(comment) {
        return `
            <div class="comment-item fade-in" data-comment-id="${comment.id}">
                <img src="${comment.user.avatar}" alt="${comment.user.name}" class="comment-avatar" 
                     onerror="this.src='assets/default-avatar.png'">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-user">${comment.user.name}</span>
                        <span class="comment-date">${this.formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <p class="comment-text">${comment.comment}</p>
                </div>
                <div class="admin-comment-actions">
                    <button class="btn-delete-comment" onclick="postsAdminManager.confirmDeleteComment(${comment.id})" 
                            title="Eliminar comentario">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    closeCommentsModal() {
        this.hideModal('commentsModal');
        this.currentPostId = null;
        this.postComments = [];
    }

    // ================================
    // DELETE FUNCTIONALITY
    // ================================

    // confirmDeletePost(postId) {
    //     const post = this.posts.find(p => p.id === postId);
    //     if (!post) return;

    //     this.currentDeleteTarget = { type: 'post', id: postId, title: post.title };
        
    //     const message = document.getElementById('confirmDeleteMessage');
    //     message.textContent = `¿Estás seguro de que deseas eliminar la publicación "${post.title}"? Esta acción no se puede deshacer.`;
        
    //     this.confirmDeleteBtn.onclick = () => this.executeDeletePost(postId);
    //     this.showModal('confirmDeleteModal');
    // }

    confirmDeleteComment(commentId) {
        const comment = this.postComments.find(c => c.id === commentId);
        if (!comment) return;

        this.currentDeleteTarget = { type: 'comment', id: commentId };
        
        const message = document.getElementById('confirmDeleteMessage');
        message.textContent = `¿Estás seguro de que deseas eliminar el comentario de "${comment.user.name}"? Esta acción no se puede deshacer.`;
        
        this.confirmDeleteBtn.onclick = () => this.executeDeleteComment(commentId);
        this.showModal('confirmDeleteModal');
    }

    // async executeDeletePost(postId) {
    //     this.hideModal('confirmDeleteModal');
        
    //     try {
    //         // Simular llamada a la API
    //         await new Promise(resolve => setTimeout(resolve, 500));
            
    //         // Remover del array
    //         this.posts = this.posts.filter(p => p.id !== postId);
    //         this.filteredPosts = this.filteredPosts.filter(p => p.id !== postId);
            
    //         // Actualizar vista
    //         this.renderPosts();
    //         this.updatePostsCounter();
            
    //         // Cerrar modal de detalles si está abierto
    //         this.hideModal('postDetailModal');
            
    //         this.showSuccess('Publicación eliminada exitosamente');
            
    //     } catch (error) {
    //         console.error('Error al eliminar post:', error);
    //         this.showError('Error al eliminar la publicación');
    //     }
        
    //     this.currentDeleteTarget = null;
    // }

    async executeDeleteComment(commentId) {
        this.hideModal('confirmDeleteModal');
        
        try {
            // Llamar a la API para eliminar el comentario
            const response = await fetch('index.php?controller=api&action=deleteComentario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idComentario: commentId })
            });

            const data = await response.json();

            if (data.success) {
                // Remover del array de comentarios
                this.postComments = this.postComments.filter(c => c.id !== commentId);
                
                // Actualizar contador en el post original
                const post = this.posts.find(p => p.id === this.currentPostId);
                if (post) {
                    post.comments--;
                }
                
                // Re-renderizar comentarios
                this.renderComments();
                
                // Actualizar vista de posts si es necesaria
                this.renderPosts();
                
                this.showSuccess('Comentario eliminado exitosamente');
            } else {
                this.showError(data.message || 'Error al eliminar el comentario');
            }
            
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            this.showError('Error al eliminar el comentario');
        }
        
        this.currentDeleteTarget = null;
    }

    closeConfirmDeleteModal() {
        this.hideModal('confirmDeleteModal');
        this.currentDeleteTarget = null;
    }

    // ================================
    // UTILITY FUNCTIONS
    // ================================

    formatCategory(category) {
        const categoryMap = {
            'analisis': 'Análisis',
            'historia': 'Historia',
            'estadisticas': 'Estadísticas',
            'curiosidades': 'Curiosidades',
            'predicciones': 'Predicciones'
        };
        return categoryMap[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatTimeAgo(dateString) {
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

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && this.modalOverlay) {
            this.modalOverlay.classList.add('active');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && this.modalOverlay) {
            modal.classList.remove('active');
            // Solo ocultar overlay si no hay otros modales activos
            const activeModals = document.querySelectorAll('.modal.active');
            if (activeModals.length === 0) {
                this.modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.remove('active'));
        
        if (this.modalOverlay) {
            this.modalOverlay.classList.remove('active');
        }
        
        document.body.style.overflow = 'auto';
        
        // Limpiar estados
        this.currentPostId = null;
        this.postComments = [];
        this.currentDeleteTarget = null;
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileMenu && hamburger) {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }
    }

    logout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            // Redirigir al login o página principal
            window.location.href = 'index.php?controller=home&action=login';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'rgba(255, 71, 87, 0.95)' : 'rgba(0, 255, 136, 0.95)'};
            color: ${type === 'error' ? '#fff' : '#000'};
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            backdrop-filter: blur(10px);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.postsAdminManager = new PostsAdminManager();
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