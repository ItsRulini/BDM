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
        this.currentUser = null;
        this.initialMundialFilter = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadCurrentUser();
        // Leer parámetro 'mundial' si viene en la URL (ej. ?mundial=123)
        try {
            const params = new URLSearchParams(window.location.search);
            const m = params.get('mundial');
            if (m) this.initialMundialFilter = parseInt(m, 10);
        } catch (e) {
            this.initialMundialFilter = null;
        }
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

        // Elementos de select (filtros)
        this.filtroMundial = document.getElementById('filterCountry');
        this.filtroCategoria = document.getElementById('filterCategory');
        this.loadDropdownOptions();
    }

    mundialNameFormat(stringToFormat) {
        // Si el nombre contiene comas, reemplazar la última coma por " y " (manteniendo el resto igual)
        const rawName = (typeof stringToFormat === 'string') ? stringToFormat.trim() : '';
        if (rawName.includes(',')) {
            const parts = rawName.split(',').map(s => s.trim()).filter(Boolean);
            if (parts.length > 1) {
                stringToFormat = parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1];
            } else {
                stringToFormat = rawName;
            }
        } else {
            stringToFormat = rawName;
        }

        return stringToFormat;
    }

    async fillOutFilterOptions(selectElementId, optionsArray, placeholder) {
        const selectElement = selectElementId
        if (!selectElement) return;

        // Convertir cualquier valor simple (string, número) a { value, label }
        const normalized = optionsArray.map(opt => ({
            value: opt,
            label: opt
        }));

        selectElement.innerHTML = `<option value="">${placeholder}</option>` +
            normalized.map(option => `<option value="${option.value}">${option.label}</option>`).join('');
    }

    async loadDropdownOptions() {
        try {
            const response = await fetch('index.php?controller=api&action=getMundialesFiltros');
            const data = await response.json();

            if (data.success) {
                const filtros = data.data;
                await this.fillOutFilterOptions(this.filtroMundial, filtros.sedes, 'Filtrar por país sede');
            } else {
                console.error('Error en los datos recibidos para filtros:', data.message);
                return;
            }

        } catch (error) {
            console.error('Error al cargar opciones de filtro:', error);
        }
        
    }

    async loadCurrentUser() {
        try {
            const response = await fetch('index.php?controller=api&action=getCurrentUser');
            const data = await response.json();
            if (data.success && data.data && data.data.usuario) {
                this.currentUser = data.data.usuario;
                this.updateCommentFormAvatar();
            }
        } catch (error) {
            console.error('Error al cargar usuario actual:', error);
        }
    }

    updateCommentFormAvatar() {
        if (!this.currentUser) return;
        const avatar = this.currentUser.fotoPerfil || 'assets/default-avatar.png';
        const avatarImg = document.querySelector('.comment-avatar');
        if (avatarImg) {
            avatarImg.src = avatar;
            avatarImg.onerror = () => { avatarImg.src = 'assets/default-avatar.png'; };
        }
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
            // AÑADIDA LLAMADA A API (nueva endpoint)
            const response = await fetch('index.php?controller=api&action=getPublicacionesAprobadas');
            if (!response.ok) {
                throw new Error('Error al cargar las publicaciones');
            }
            
            const data = await response.json();

            if (data.success) {
                this.posts = data.data.map(post => ({
                    ...post,
                    liked: post.userHasLiked || false, // Inicializar liked según servidor
                    likes: post.likes || 0,
                    comments: post.comments || 0
                }));
                // Si se abrió la página desde una vista de Mundial, filtrar por ese Id
                if (this.initialMundialFilter) {
                    this.posts = this.posts.filter(p => Number(p.idMundial) === this.initialMundialFilter);
                }
            } else {
                console.error('Error fetching approved posts:', data.message);
                this.posts = [];
            }
            
            this.filteredPosts = [...this.posts];
            this.renderPosts();
            this.updatePostsCounter();
            
        } catch (error) {
            console.error('Error al cargar posts:', error);
            this.showError('Error al cargar las publicaciones');
            this.posts = [];
            this.filteredPosts = [];
            this.renderPosts();
        } finally {
            this.showLoading(false);
        }
    }

    // generateMockPosts() { ... } // ELIMINADO

    filterAndSearch() {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        const mundialFilter = this.filterCountry?.value || ''; // Filtro por país/sede
        const categoryFilter = this.filterCategory?.value || '';
        const orderValue = this.orderBy?.value || '';

        this.filteredPosts = this.posts.filter(post => {
            // MODIFICADO: para usar datos de la API
            const matchesSearch = searchTerm === '' || 
                post.contenido.toLowerCase().includes(searchTerm) ||
                post.autorNombre.toLowerCase().includes(searchTerm) ||
                (Array.isArray(post.categorias) && post.categorias.some(cat => cat.toLowerCase().includes(searchTerm))) ||
                post.mundialAño.toLowerCase().includes(searchTerm);

            // Asumimos que el filtro de país busca en el nombre del mundial (Ej. "Qatar 2022")
            const matchesMundial = mundialFilter === '' || post.mundialAño.toLowerCase().includes(mundialFilter.toLowerCase());
            const matchesCategory = categoryFilter === '' || (Array.isArray(post.categorias) && post.categorias.some(cat => cat.toLowerCase() === categoryFilter.toLowerCase()));

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
                this.filteredPosts.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
                break;
            case 'date_asc':
                this.filteredPosts.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
                break;
            default:
                this.filteredPosts.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
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
    const formatCategories = (categorias) => {
        if (!Array.isArray(categorias) || categorias.length === 0) return '<span>General</span>';
        
        return categorias.map(cat => {
            const formatted = cat.charAt(0).toUpperCase() + cat.slice(1);
            return `<span>${formatted}</span>`;
        }).join('');
    };

    const createMultimediaCarousel = (multimedia) => {
        if (!multimedia || multimedia.length === 0) return '';
        
        const carouselId = `carousel-${post.id}`;
        
        const slides = multimedia.map((item, index) => {
            if (item.type.startsWith('image/')) {
                return `
                    <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <img src="${item.src}" alt="Multimedia de publicación" onerror="this.parentElement.style.display='none'">
                    </div>
                `;
            } else if (item.type.startsWith('video/')) {
                return `
                    <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <video controls preload="metadata" playsinline>
                            <source src="${item.src}" type="${item.type}">
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

    const sedes = this.mundialNameFormat(post.sedes);

    return `
        <article class="post-card" data-post-id="${post.id}">
            <div class="post-mundial">
                <span>${sedes + ' ' + post.mundialAño}</span>
            </div>
            
            <div class="post-category">
                ${formatCategories(post.categorias)}
            </div>
            
            <div class="post-header">
                <h2 class="post-title">${this.truncateText(post.contenido, 70)}</h2>
                <div class="post-meta">
                    <div class="post-author">
                        <img src="assets/default-avatar.png" alt="${post.autorNombre}" class="profile-pic" 
                             onerror="this.src='assets/default-avatar.png'">
                        <span>por ${post.autorNombre}</span>
                    </div>
                    <div class="post-date">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${this.formatDate(post.fechaCreacion)}</span>
                    </div>
                </div>
            </div>

            <div class="post-content">
                <p class="post-text">${post.contenido}</p>
                ${createMultimediaCarousel(post.multimedia)}
            </div>

            <div class="post-interactions">
                <div class="interaction-buttons">
                    <button class="like-btn ${post.liked ? 'liked' : ''}" 
                            data-post-id="${post.id}" 
                            aria-label="Dar like a esta publicación">
                        <i class="fas fa-heart"></i>
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
        // Registrar vista en el servidor (no bloquear errores)
        try {
            fetch('index.php?controller=api&action=addView', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPublicacion: postId })
            }).catch(e => console.warn('No se pudo registrar la vista:', e));
        } catch (e) {
            console.warn('Error enviando vista:', e);
        }

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

        if (title) title.textContent = this.truncateText(post.contenido, 70); // MODIFICADO
        if (author) author.textContent = `Por ${post.autorNombre}`; // MODIFICADO
        if (date) date.textContent = this.formatDate(post.fechaCreacion);
    }

    async loadPostComments(postId) {
        if (this.loadingComments) {
            this.loadingComments.style.display = 'flex';
        }
        
        try {
            // Cargar comentarios reales desde el backend
            const resp = await fetch(`index.php?controller=api&action=getComments&id=${postId}`);
            if (!resp.ok) throw new Error('Error al obtener comentarios');
            const data = await resp.json();
            if (!data.success) throw new Error(data.message || 'Respuesta inválida');

            // API devuelve array de comentarios en data.data
            this.postComments = Array.isArray(data.data) ? data.data : [];
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
            "Gran post! Me trae muchos recuerdos de ese mundial."
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
        this.updateCommentsCount();

        if (this.postComments.length === 0) {
            this.commentsList.style.display = 'none';
            if (this.noComments) this.noComments.style.display = 'block';
            return;
        }

        this.commentsList.style.display = 'block';
        if (this.noComments) this.noComments.style.display = 'none';

        this.commentsList.innerHTML = this.postComments.map(comment => this.createCommentHTML(comment)).join('');
    }

    createCommentHTML(comment) {
        const avatar = (comment.user && (comment.user.fotoPerfil || comment.user.avatar)) || 'assets/default-avatar.png';
        const userName = (comment.user && (comment.user.name || comment.user.UsuarioNombre)) || 'Usuario';
        const text = comment.text || comment.comment || '';
        const dateStr = comment.date || comment.FechaComentario || new Date().toISOString();

        return `
            <div class="comment-item fade-in">
                <img src="${avatar}" alt="${userName}" class="comment-avatar" onerror="this.src='assets/default-avatar.png'">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-user">${userName}</span>
                        <span class="comment-date">${this.formatTimeAgo(dateStr)}</span>
                    </div>
                    <p class="comment-text">${text}</p>
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

        if (count > maxLength) {
            counter.classList.add('danger');
        } else if (count > maxLength * 0.9) {
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

            const response = await fetch('index.php?controller=api&action=createComentario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPublicacion: this.currentPostId, comentario: commentText })
            });

            if (!response.ok) throw new Error('Error al enviar comentario');
            const respData = await response.json();
            if (!respData.success) throw new Error(respData.message || 'No se pudo crear el comentario');

            // API returns the created comment object
            const newComment = respData.data;

            // Agregar al principio de la lista
            this.postComments.unshift(newComment);

            // Actualizar contador en el post original
            const post = this.posts.find(p => p.id === this.currentPostId);
            if (post) {
                post.comments = (post.comments || 0) + 1;
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
        nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
        prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => { e.stopPropagation(); showSlide(index); });
        });

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

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
        }, { passive: true });
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
        event.stopPropagation();
        const button = event.currentTarget;
        const postId = parseInt(button.closest('.post-card').dataset.postId);
        const post = this.posts.find(p => p.id === postId);
        
        if (!post) return;
        // Optimistic UI: toggle immediately then confirm with backend
        const previousLiked = !!post.liked;
        const previousLikes = post.likes || 0;

        // Optimistically toggle
        post.liked = !previousLiked;
        post.likes = previousLiked ? Math.max(0, previousLikes - 1) : (previousLikes + 1);
        button.classList.toggle('liked', post.liked);
        const countSpan = button.querySelector('.interaction-count');
        if (countSpan) countSpan.textContent = post.likes;

        // Add animation effect
        button.style.transform = 'scale(1.1)';
        setTimeout(() => { button.style.transform = 'scale(1)'; }, 150);

        // Enviar al backend para confirmar
        (async () => {
            try {
                const resp = await fetch('index.php?controller=api&action=toggleLike', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idPublicacion: postId })
                });
                if (!resp.ok) throw new Error('Error en servidor');
                const data = await resp.json();
                if (!data.success) throw new Error(data.message || 'Error al procesar like');

                // Server returns the authoritative state
                post.liked = !!data.data.liked;
                post.likes = data.data.likes || 0;
                button.classList.toggle('liked', post.liked);
                if (countSpan) countSpan.textContent = post.likes;
            } catch (err) {
                console.error('Error al toggle like:', err);
                // Revert optimistic update
                post.liked = previousLiked;
                post.likes = previousLikes;
                button.classList.toggle('liked', post.liked);
                if (countSpan) countSpan.textContent = post.likes;
                this.showError('No se pudo actualizar el like');
            }
        })();
    }

    handleComment(event) {
        event.stopPropagation();
        const button = event.currentTarget;
        const postId = parseInt(button.closest('.post-card').dataset.postId);
        
        // Abrir modal de comentarios
        this.openCommentsModal(postId);
    }

    async sendLikeToServer(postId, liked) {
        // Simulación - en un caso real, harías un fetch
        console.log(`Like ${liked ? 'agregado' : 'removido'} para post ${postId} (simulado)`);
        
        // try {
        //     const response = await fetch(`index.php?controller=api&action=likePost`, {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ postId, liked })
        //     });
        //     if (!response.ok) {
        //         throw new Error('Error al procesar like');
        //     }
        //     const data = await response.json();
        //     console.log('Respuesta del servidor (like):', data);
        // } catch (error) {
        //     console.error('Error al enviar like:', error);
        //     // Revertir el like en la UI si falla
        // }
    }

    // ================================
    // UTILITY FUNCTIONS
    // ================================
    
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
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

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatTimeAgo(dateString) {
        if (!dateString) return 'hace un momento';
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