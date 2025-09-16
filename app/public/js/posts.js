/**
 * Posts Page JavaScript
 * Maneja la funcionalidad de la página de publicaciones
 */

class PostsManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.isLoading = false;
        this.currentPostId = null;
        this.postComments = [];
        
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

        // Elementos del modal de comentarios
        this.commentsModal = document.getElementById('commentsModal');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.newCommentText = document.getElementById('newCommentText');
        this.commentCharCount = document.getElementById('commentCharCount');
        this.commentsList = document.getElementById('commentsList');
        this.noComments = document.getElementById('noComments');
        this.loadingComments = document.getElementById('loadingComments');
    }

    bindEvents() {
        // Eventos de búsqueda y filtros
        this.searchInput?.addEventListener('input', this.debounce(() => this.filterAndSearch(), 300));
        this.filterCountry?.addEventListener('change', () => this.filterAndSearch());
        this.filterCategory?.addEventListener('change', () => this.filterAndSearch());
        this.orderBy?.addEventListener('change', () => this.filterAndSearch());
        
        // Eventos del modal de comentarios
        this.modalOverlay?.addEventListener('click', () => this.closeCommentsModal());
        this.newCommentText?.addEventListener('input', () => this.updateCommentCounter());
        
        // Eventos globales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeCommentsModal();
        });

        // Funciones globales
        window.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        window.closeCommentsModal = this.closeCommentsModal.bind(this);
        window.clearComment = this.clearComment.bind(this);
        window.submitComment = this.submitComment.bind(this);
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
                mundial: mundiales[3],
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
                mundial: mundiales[2],
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
                mundial: mundiales[1],
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
        this.postsContainer.innerHTML = this.filteredPosts.map(post => this.createPostHTML(post)).join('');
        
        this.bindPostInteractions();
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

    // ================================
    // COMMENTS FUNCTIONALITY
    // ================================

    async openCommentsModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.currentPostId = postId;
        this.showCommentsModal();
        this.populatePostSummary(post);
        await this.loadPostComments(postId);
    }

    showCommentsModal() {
        if (this.commentsModal && this.modalOverlay) {
            this.modalOverlay.classList.add('active');
            this.commentsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.clearComment();
        }
    }

    closeCommentsModal() {
        if (this.commentsModal && this.modalOverlay) {
            this.commentsModal.classList.remove('active');
            this.modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.currentPostId = null;
            this.postComments = [];
        }
    }

    populatePostSummary(post) {
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
            // Simular carga de comentarios desde el backend
            const mockComments = this.generateMockComments(postId);
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            this.postComments = mockComments;
            this.renderComments();
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
            this.showError('Error al cargar los comentarios');
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
            <div class="comment-item fade-in">
                <img src="${comment.user.avatar}" alt="${comment.user.name}" class="comment-avatar" 
                     onerror="this.src='assets/default-avatar.png'">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-user">${comment.user.name}</span>
                        <span class="comment-date">${this.formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <p class="comment-text">${comment.comment}</p>
                </div>
            </div>
        `;
    }

    updateCommentsCount() {
        const commentsCount = document.getElementById('commentsCount');
        if (commentsCount) {
            commentsCount.textContent = this.postComments.length;
        }
    }

    updateCommentCounter() {
        if (!this.newCommentText || !this.commentCharCount) return;

        const text = this.newCommentText.value;
        const count = text.length;
        const maxLength = 500;

        this.commentCharCount.textContent = count;

        const counter = this.commentCharCount.parentElement;
        counter.classList.remove('warning', 'danger');

        if (count > maxLength * 0.9) {
            counter.classList.add('danger');
        } else if (count > maxLength * 0.8) {
            counter.classList.add('warning');
        }

        // Habilitar/deshabilitar botón de envío
        const submitBtn = document.getElementById('submitCommentBtn');
        if (submitBtn) {
            submitBtn.disabled = count === 0 || count > maxLength;
        }
    }

    clearComment() {
        if (this.newCommentText) {
            this.newCommentText.value = '';
            this.updateCommentCounter();
        }
    }

    async submitComment() {
        if (!this.newCommentText || !this.currentPostId) return;

        const commentText = this.newCommentText.value.trim();
        if (!commentText) {
            this.showError('Por favor escribe un comentario');
            return;
        }

        if (commentText.length > 500) {
            this.showError('El comentario no puede superar los 500 caracteres');
            return;
        }

        const submitBtn = document.getElementById('submitCommentBtn');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Deshabilitar botón y mostrar carga
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            // Simular envío al backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Crear nuevo comentario
            const newComment = {
                id: this.postComments.length + 1,
                user: { name: 'Tú', avatar: 'assets/default-avatar.png' },
                comment: commentText,
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString()
            };

            // Agregar al principio de la lista
            this.postComments.unshift(newComment);

            // Actualizar contador en el post original
            const post = this.posts.find(p => p.id === this.currentPostId);
            if (post) {
                post.comments++;
                // Actualizar el contador en la interfaz del post
                const postCard = document.querySelector(`[data-post-id="${this.currentPostId}"]`);
                if (postCard) {
                    const commentCount = postCard.querySelector('.comment-btn .interaction-count');
                    if (commentCount) {
                        commentCount.textContent = post.comments;
                    }
                }
            }

            // Actualizar la vista
            this.renderComments();
            this.updateCommentsCount();
            this.clearComment();

            this.showSuccess('Comentario agregado exitosamente');

        } catch (error) {
            console.error('Error al enviar comentario:', error);
            this.showError('Error al enviar el comentario');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    // ================================
    // CAROUSEL FUNCTIONALITY
    // ================================

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

    // ================================
    // POST INTERACTIONS
    // ================================

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

        // Enviar al backend
        this.sendLikeToServer(postId, post.liked);
    }

    handleComment(event) {
        const button = event.currentTarget;
        const postId = parseInt(button.dataset.postId);
        
        // Abrir modal de comentarios
        this.openCommentsModal(postId);
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
        }
    }

    // ================================
    // UTILITY FUNCTIONS
    // ================================

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