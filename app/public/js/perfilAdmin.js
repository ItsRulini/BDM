/**
 * Admin Profile JavaScript
 * Extiende la funcionalidad del perfil de usuario para administradores
 */

import ProfileManager from "./perfil.js";

class AdminProfile extends ProfileManager {
    constructor() {
        super();
        this.currentStatus = 'pending'; // Estado inicial para admin (pendientes por defecto)
        this.currentPostForModeration = null;
        this.initializeAdminFeatures();
    }

    initializeAdminFeatures() {
        // Cargar datos específicos del admin
        this.loadUserPosts(); // Esto cargará los posts Y luego actualizará los stats
        
        // Exponer funciones globales específicas del admin
        window.approvePost = this.approvePost.bind(this);
        window.rejectPost = this.rejectPost.bind(this);
        window.moderatePost = this.moderatePost.bind(this);
        window.deleteComment = this.deleteComment.bind(this);
        window.confirmDeleteComment = this.confirmDeleteComment.bind(this);
        window.cancelDeleteComment = this.cancelDeleteComment.bind(this);
    }

    // loadUserData() {} // Hereda el loadUserData del padre (perfil.js)

    async loadUserPosts() {
        try {
            // ⭐ AÑADIDA LLAMADA A API
            const response = await fetch('index.php?controller=api&action=getTodasPublicaciones');
            if (!response.ok) {
                throw new Error('Error al cargar las publicaciones');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Normalizar estatus a los valores que usa la UI: 'pending'|'approved'|'rejected'
                const statusMap = {
                    'Aprobado': 'approved',
                    'Aprobada': 'approved',
                    'Aprobadas': 'approved',
                    'Pendiente': 'pending',
                    'Pendientes': 'pending',
                    'Rechazado': 'rejected',
                    'Rechazada': 'rejected',
                    'Rechazadas': 'rejected'
                };

                this.userPosts = data.data.map(p => {
                    const raw = p.estatus || p.status || p.EstatusAprobacion || '';
                    const mapped = statusMap[raw] || (raw.toString ? raw.toString().toLowerCase() : raw);
                    return Object.assign({}, p, { estatus: mapped });
                });
                console.log('[admin] userPosts cargadas:', this.userPosts.length, this.userPosts.slice(0,5));
            } else {
                console.error('Error fetching all posts:', data.message);
                this.userPosts = [];
            }

            this.updatePostsCounts();
            this.showPosts(this.currentStatus); // Muestra 'pending' por defecto
            this.updateAdminStats(); // Actualiza contadores del dashboard de admin
        } catch (error) {
            console.error('Error loading posts for moderation:', error);
            this.userPosts = [];
            this.updatePostsCounts();
            this.showPosts(this.currentStatus);
        }
    }

    loadAdminStats() {
        // Esta función ahora solo actualiza los stats basados en this.userPosts
        const stats = {
            pending: this.userPosts?.filter(p => p.estatus === 'pending').length || 0,
            // Podrías necesitar otra llamada a la API para stats más complejos
            approvedToday: 0, 
            rejectedToday: 0
        };

        this.displayAdminStats(stats);
    }

    displayAdminStats(stats) {
        const pendingStats = document.getElementById('pendingStats');
        const approvedTodayStats = document.getElementById('approvedTodayStats');
        const rejectedTodayStats = document.getElementById('rejectedTodayStats');

        if (pendingStats) pendingStats.textContent = stats.pending;
        if (approvedTodayStats) approvedTodayStats.textContent = stats.approvedToday;
        if (rejectedTodayStats) rejectedTodayStats.textContent = stats.rejectedToday;
    }

    updateAdminStats() {
        const pendingCount = this.userPosts.filter(p => p.estatus === 'pending').length;
        const pendingStats = document.getElementById('pendingStats');
        if (pendingStats) pendingStats.textContent = pendingCount;
    }

    showPosts(status) {
        this.currentTab = status;
        
        // Update tab buttons
        this.tabs.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = Array.from(this.tabs)
            .find(btn => btn.dataset.status === status);
        if (activeBtn) activeBtn.classList.add('active');

        // Filter and display posts
        const filteredPosts = this.userPosts.filter(post => {
            return post.estatus === status;
        });

        this.renderPosts(filteredPosts);
    }

    createPostHTML(post) {
        const statusConfig = {
            approved: { icon: 'fas fa-check-circle', text: 'Aprobado', class: 'approved' },
            pending: { icon: 'fas fa-clock', text: 'Pendiente', class: 'pending' },
            rejected: { icon: 'fas fa-times-circle', text: 'Rechazado', class: 'rejected' }
        };

        const config = statusConfig[post.estatus];
        const formattedDate = this.formatDate(post.fechaCreacion);
        const categories = Array.isArray(post.categorias) ? post.categorias.join(', ') : '';
        
        // Determinar si es clickeable y qué acción tomar
        const isClickable = post.estatus === 'approved' || post.estatus === 'pending';
        const clickAction = post.estatus === 'pending' ? 
            `onclick="adminProfile.moderatePost(${post.id})"` : 
            `onclick="adminProfile.openPostStats(${post.id})"`;

        // Crear carrusel de multimedia
        const createMultimediaCarousel = (multimedia) => {
            if (!multimedia || multimedia.length === 0) return '';
            
            const carouselId = `carousel-${post.id}`;
            
            const slides = multimedia.map((item, index) => {
                // API envía 'type' (MIME) y 'src' (URL Base64)
                if (item.type.startsWith('image/')) {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${item.src}" alt="Multimedia de publicación" onerror="this.parentElement.style.display='none'">
                        </div>
                    `;
                } else if (item.type.startsWith('video/')) {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <video controls poster="" preload="metadata">
                                <source src="${item.src}" type="${item.type}">
                                Tu navegador no soporta el elemento video.
                            </video>
                        </div>
                    `;
                }
                return '';
            }).join('');

            const indicators = multimedia.length > 1 ? multimedia.map((_, index) => 
                `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" onclick="event.stopPropagation(); adminProfile.goToSlide('${carouselId}', ${index})"></button>`
            ).join('') : '';

            const navigation = multimedia.length > 1 ? `
                <button class="carousel-nav prev" onclick="event.stopPropagation(); adminProfile.prevSlide('${carouselId}')" aria-label="Anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next" onclick="event.stopPropagation(); adminProfile.nextSlide('${carouselId}')" aria-label="Siguiente">
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

        // Crear botones de moderación para posts pendientes
        const moderationButtons = post.estatus === 'pending' ? `
            <div class="moderation-buttons">
                <button class="btn-moderate approve" onclick="event.stopPropagation(); adminProfile.quickApprove(${post.id})">
                    <i class="fas fa-check"></i> Aprobar
                </button>
                <button class="btn-moderate reject" onclick="event.stopPropagation(); adminProfile.quickReject(${post.id})">
                    <i class="fas fa-times"></i> Rechazar
                </button>
            </div>
        ` : '';

        // Clase adicional para posts pendientes
        const additionalClass = post.estatus === 'pending' ? 'pending-moderation' : '';
        const priorityClass = post.prioridad ? `priority-${post.prioridad}` : '';

        return `
            <div class="post-card fade-in ${isClickable ? 'clickable' : ''} ${additionalClass} ${priorityClass}" ${isClickable ? clickAction : ''}>
                <div class="post-header">
                    <h4>${this.truncateText(post.contenido, 50)}</h4>
                    <div class="post-author-info">
                        <span><i class="fas fa-user"></i> ${post.autorNombre}</span>
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    </div>
                </div>
                
                <div class="post-content">
                    <p>${this.truncateText(post.contenido, 150)}</p>
                    ${createMultimediaCarousel(post.multimedia)}
                </div>
                
                <div class="post-meta">
                    <small><strong>Mundial:</strong> ${post.sedes + ' ' + post.mundialAño}</small>
                    <small><strong>Categorías:</strong> ${categories}</small>
                    ${post.estatus === 'rejected' && post.razonRechazo ? `<small><strong>Razón:</strong> ${post.razonRechazo}</small>` : ''}
                </div>
                
                <div class="post-status ${config.class}">
                    <i class="${config.icon}"></i> ${config.text}
                </div>
                
                ${moderationButtons}
                ${isClickable && post.estatus === 'approved' ? '<div class="click-hint"><i class="fas fa-chart-line"></i> Click para ver estadísticas</div>' : ''}
                ${post.estatus === 'pending' ? '<div class="click-hint"><i class="fas fa-gavel"></i> Click para moderar</div>' : ''}
            </div>
        `;
    }

    // ================================
    // CAROUSEL FUNCTIONALITY
    // ================================

    nextSlide(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        const activeSlide = carousel.querySelector('.carousel-slide.active');
        const activeIndicator = carousel.querySelector('.carousel-indicator.active');
        
        if (!activeSlide) return;

        let currentIndex = parseInt(activeSlide.dataset.index);
        let nextIndex = (currentIndex + 1) % slides.length;

        // Remove active class from current elements
        activeSlide.classList.remove('active');
        if (activeIndicator) activeIndicator.classList.remove('active');

        // Add active class to next elements
        slides[nextIndex].classList.add('active');
        if (indicators[nextIndex]) indicators[nextIndex].classList.add('active');
    }

    prevSlide(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        const activeSlide = carousel.querySelector('.carousel-slide.active');
        const activeIndicator = carousel.querySelector('.carousel-indicator.active');
        
        if (!activeSlide) return;

        let currentIndex = parseInt(activeSlide.dataset.index);
        let prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;

        // Remove active class from current elements
        activeSlide.classList.remove('active');
        if (activeIndicator) activeIndicator.classList.remove('active');

        // Add active class to previous elements
        slides[prevIndex].classList.add('active');
        if (indicators[prevIndex]) indicators[prevIndex].classList.add('active');
    }

    goToSlide(carouselId, slideIndex) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        // Remove active class from all elements
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to target elements
        if (slides[slideIndex]) slides[slideIndex].classList.add('active');
        if (indicators[slideIndex]) indicators[slideIndex].classList.add('active');
    }

    // ================================
    // MODERACIÓN DE POSTS
    // ================================
    openPostStats(postId) {
        const post = this.userPosts.find(p => p.id === postId);
        if (!post || post.estatus !== 'approved') {
            this.showError('Solo se pueden ver estadísticas de publicaciones aprobadas');
            return;
        }

        this.loadPostStatistics(post); // Esta función usa Mocks, la dejamos así por ahora
        this.showModal('postStatsModal');
    }

    moderatePost(postId) {
        const post = this.userPosts.find(p => p.id === postId);
        if (!post) return;

        this.currentPostForModeration = post;
        this.showModerationModal(post);
    }

    showModerationModal(post) {
        // Llenar datos del modal
        document.getElementById('moderationPostTitle').textContent = this.truncateText(post.contenido, 50);
        document.getElementById('moderationPostContent').textContent = post.contenido;
        document.getElementById('moderationPostAuthor').textContent = `Por ${post.autorNombre}`;
        document.getElementById('moderationPostDate').textContent = this.formatDate(post.fechaCreacion);

        // Generar carrusel de multimedia para el modal de moderación
        const moderationPostContainer = document.querySelector('#postActionModal .post-preview');
        
        // Buscar si ya existe un contenedor de multimedia y eliminarlo
        const existingMultimedia = moderationPostContainer.querySelector('.post-multimedia-moderation');
        if (existingMultimedia) {
            existingMultimedia.remove();
        }

        // Crear carrusel de multimedia si existe
        if (post.multimedia && post.multimedia.length > 0) {
            const carouselId = `moderation-carousel-${post.id}`;
            
            const slides = post.multimedia.map((item, index) => {
                // API envía 'type' (MIME) y 'src' (URL Base64)
                if (item.type.startsWith('image/')) {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${item.src}" alt="Multimedia de publicación" onerror="this.parentElement.style.display='none'">
                        </div>
                    `;
                } else if (item.type.startsWith('video/')) {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <video controls poster="" preload="metadata">
                                <source src="${item.src}" type="${item.type}">
                                Tu navegador no soporta el elemento video.
                            </video>
                        </div>
                    `;
                }
                return '';
            }).join('');

            const indicators = post.multimedia.length > 1 ? post.multimedia.map((_, index) => 
                `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" onclick="adminProfile.goToSlide('${carouselId}', ${index})"></button>`
            ).join('') : '';

            const navigation = post.multimedia.length > 1 ? `
                <button class="carousel-nav prev" onclick="adminProfile.prevSlide('${carouselId}')" aria-label="Anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next" onclick="adminProfile.nextSlide('${carouselId}')" aria-label="Siguiente">
                    <i class="fas fa-chevron-right"></i>
                </button>
            ` : '';

            const multimediaHTML = `
                <div class="post-multimedia-moderation">
                    <div class="multimedia-carousel" id="${carouselId}">
                        <div class="carousel-container">
                            ${slides}
                        </div>
                        ${navigation}
                        ${indicators ? `<div class="carousel-indicators">${indicators}</div>` : ''}
                    </div>
                </div>
            `;

            // Insertar el carrusel después del contenido del post
            const postContent = moderationPostContainer.querySelector('p');
            if (postContent) {
                postContent.insertAdjacentHTML('afterend', multimediaHTML);
            }
        }

        this.showModal('postActionModal');
    }

    quickApprove(postId) {
        this.currentPostForModeration = this.userPosts.find(p => p.id === postId);
        this.approvePost();
    }

    quickReject(postId) {
        this.currentPostForModeration = this.userPosts.find(p => p.id === postId);
        this.rejectPost();
    }

    async approvePost() {
        if (!this.currentPostForModeration) return;

        const postId = this.currentPostForModeration.id;
        const postTitle = this.truncateText(this.currentPostForModeration.contenido, 20);

        try {
            const response = await fetch('index.php?controller=api&action=aprobarPublicacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPublicacion: postId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                const postIndex = this.userPosts.findIndex(p => p.id === postId);
                if (postIndex !== -1) {
                    this.userPosts[postIndex].estatus = 'approved';
                }
                
                this.showAdminNotification(`Publicación "${postTitle}..." aprobada`, 'success');
                this.closeModal('postActionModal');
                this.updatePostsCounts();
                this.updateAdminStats();
                this.showPosts(this.currentTab); // Re-renderizar vista actual
            } else {
                this.showAdminNotification(`Error al aprobar: ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('Error approving post:', error);
            this.showAdminNotification('Error de conexión al aprobar', 'error');
        } finally {
            this.currentPostForModeration = null;
        }
    }

    async rejectPost() {
        if (!this.currentPostForModeration) return;

        const postId = this.currentPostForModeration.id;
        const postTitle = this.truncateText(this.currentPostForModeration.contenido, 20);

        try {
            const response = await fetch('index.php?controller=api&action=rechazarPublicacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPublicacion: postId })
            });
            
            const data = await response.json();

            if (data.success) {
                const postIndex = this.userPosts.findIndex(p => p.id === postId);
                if (postIndex !== -1) {
                    this.userPosts[postIndex].estatus = 'rejected';
                    this.userPosts[postIndex].razonRechazo = 'Rechazado por el administrador';
                }

                this.showAdminNotification(`Publicación "${postTitle}..." rechazada`, 'warning');
                this.closeModal('postActionModal');
                this.updatePostsCounts();
                this.updateAdminStats();
                this.showPosts(this.currentTab); // Re-renderizar vista actual
            } else {
                this.showAdminNotification(`Error al rechazar: ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('Error rejecting post:', error);
            this.showAdminNotification('Error de conexión al rechazar', 'error');
        } finally {
            this.currentPostForModeration = null;
        }
    }

    // ================================
    // ESTADÍSTICAS CON MODERACIÓN DE COMENTARIOS
    // ================================

    async loadPostStatistics(post) {
        try {
            // Obtener estadísticas reales del servidor
            const response = await fetch(`index.php?controller=api&action=getPostStats&id=${post.id}`);
            if (!response.ok) throw new Error('Error al cargar estadísticas');

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Error');

            const stats = data.data || {};

            // Obtener comentarios reales
            const commentsResponse = await fetch(`index.php?controller=api&action=getComments&id=${post.id}&limit=50`);
            if (!commentsResponse.ok) throw new Error('Error al cargar comentarios');

            const commentsData = await commentsResponse.json();
            const comments = commentsData.data || [];

            // Preparar estructura de estadísticas
            const realStats = {
                views: stats.views || 0,
                likes: stats.likes || 0,
                comments: stats.comments || 0,
                likedBy: (stats.likedBy && Array.isArray(stats.likedBy)) ? stats.likedBy : [],
                recentComments: comments
            };

            this.displayPostStatistics(post, realStats);
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            // Fallback a mock si hay error
            this.loadPostStatisticsWithMock(post);
        }
    }

    loadPostStatisticsWithMock(post) {
        const mockStats = {
            views: post.views || 0,
            likes: post.likes || 0,
            comments: post.comments || 0,
            likedBy: [],
            recentComments: []
        };
        this.displayPostStatistics(post, mockStats);
    }

    displayCommentsList(comments) {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        if (comments.length === 0) {
            commentsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comment-slash"></i>
                    <h4>Sin comentarios aún</h4>
                    <p>Sé el primero en comentar esta publicación</p>
                </div>
            `;
            return;
        }

        commentsList.innerHTML = comments.map(comment => `
            <div class="comment-item admin-view" id="comment-${comment.id}">
                <div class="comment-header">
                    <img src="${comment.user.fotoPerfil || 'assets/default-avatar.png'}" alt="${comment.user.name}" onerror="this.src='assets/default-avatar.png'">
                    <span class="comment-user">${comment.user.name}</span>
                    <span class="comment-date">${this.formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button class="btn-delete-comment" onclick="adminProfile.deleteComment(${comment.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
                <div class="delete-confirmation" id="delete-confirmation-${comment.id}">
                    <p>¿Estás seguro que deseas eliminar este comentario?</p>
                    <div class="delete-confirmation-buttons">
                        <button class="btn-confirm-delete" onclick="adminProfile.confirmDeleteComment(${comment.id})">
                            Eliminar
                        </button>
                        <button class="btn-cancel-delete" onclick="adminProfile.cancelDeleteComment(${comment.id})">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ================================
    // MODERACIÓN DE COMENTARIOS
    // ================================

    deleteComment(commentId) {
        const confirmation = document.getElementById(`delete-confirmation-${commentId}`);
        if (confirmation) {
            confirmation.classList.add('active');
        }
    }

    async confirmDeleteComment(commentId) {
        try {
            const response = await fetch('index.php?controller=api&action=deleteComentario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idComentario: commentId })
            });

            const data = await response.json();

            if (data.success) {
                const commentElement = document.getElementById(`comment-${commentId}`);
                if (commentElement) {
                    commentElement.style.opacity = '0';
                    commentElement.style.transform = 'translateX(-100%)';
                    
                    setTimeout(() => {
                        commentElement.remove();
                        
                        // Actualizar contador de comentarios
                        const commentsCount = document.getElementById('statsComments');
                        if (commentsCount) {
                            const currentCount = parseInt(commentsCount.textContent);
                            commentsCount.textContent = Math.max(0, currentCount - 1);
                        }
                        
                        this.showAdminNotification('Comentario eliminado exitosamente', 'success');
                    }, 300);
                }
            } else {
                this.showAdminNotification(data.message || 'Error al eliminar comentario', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            this.showAdminNotification('Error al eliminar comentario', 'error');
        }
    }

    cancelDeleteComment(commentId) {
        const confirmation = document.getElementById(`delete-confirmation-${commentId}`);
        if (confirmation) {
            confirmation.classList.remove('active');
        }
    }

    // ================================
    // NOTIFICACIONES ADMIN
    // ================================

    showAdminNotification(message, type = 'info') {
        const iconMap = {
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle', 
            error: 'fas fa-times-circle',
            info: 'fas fa-info-circle'
        };

        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-header">
                <i class="${iconMap[type]} ${type}"></i>
                <span>Moderación</span>
            </div>
            <div class="notification-body">${message}</div>
        `;

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-remove después de 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        // Click para cerrar
        notification.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // ================================
    // OVERRIDE DE MÉTODOS PADRE PARA ADMIN
    // ================================

    openCreatePostModal() {
        // Los admins no crean posts desde su perfil
        this.showAdminNotification('Los administradores gestionan posts desde el panel de administración', 'info');
    }

    updatePostsCounts() {
        const counts = {
            approved: this.userPosts.filter(p => p.estatus === 'approved').length,
            pending: this.userPosts.filter(p => p.estatus === 'pending').length,
            rejected: this.userPosts.filter(p => p.estatus === 'rejected').length
        };

        if (this.approvedCount) this.approvedCount.textContent = counts.approved;
        if (this.pendingCount) this.pendingCount.textContent = counts.pending;
        if (this.rejectedCount) this.rejectedCount.textContent = counts.rejected;
    }
}

// Funciones utilitarias globales específicas del admin
function editProfile() {
    if (window.adminProfile) {
        window.adminProfile.openEditOptions();
    }
}

// Funciones globales para los tabs de estadísticas
window.showInteractionTab = function(tabName) {
    if (window.adminProfile) {
        window.adminProfile.showInteractionTab(tabName);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.adminProfile = new AdminProfile();
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

export default AdminProfile;