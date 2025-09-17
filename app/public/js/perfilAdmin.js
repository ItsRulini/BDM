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
        this.loadAdminStats();
        this.loadUserPosts();
        
        // Exponer funciones globales específicas del admin
        window.approvePost = this.approvePost.bind(this);
        window.rejectPost = this.rejectPost.bind(this);
        window.moderatePost = this.moderatePost.bind(this);
        window.deleteComment = this.deleteComment.bind(this);
        window.confirmDeleteComment = this.confirmDeleteComment.bind(this);
        window.cancelDeleteComment = this.cancelDeleteComment.bind(this);
    }

    loadUserData() {
        // Datos específicos del administrador
        const adminData = {
            nombre: "Admin",
            apellidoPaterno: "FootGG",
            apellidoMaterno: "",
            correo: "admin@footgg.com",
            genero: "Masculino",
            fechaNacimiento: "1990-01-01",
            nacionalidad: "Mexicana",
            paisNacimiento: "México",
            fotoPerfil: "assets/default-avatar.png"
        };

        this.displayUserInfo(adminData);
    }

    async loadUserPosts() {
        try {
            // Simulación de posts para moderación - aquí conectarías con tu backend
            this.userPosts = [
                {
                    id: 1,
                    title: "Mi análisis del Mundial de Qatar 2022",
                    content: "El mundial de Qatar fue espectacular, especialmente la final entre Argentina y Francia. Messi finalmente consiguió su tan ansiado mundial y demostró por qué es considerado el GOAT por muchos. La final fue épica...",
                    status: "pending",
                    fechaCreacion: "2024-12-15",
                    mundial: "Qatar 2022",
                    categorias: ["Análisis", "Opinión"],
                    autor: "Villa González",
                    autorId: 123,
                    multimedia: [
                        {
                            type: 'image',
                            src: 'assets/posts/qatar-final.jpg',
                            alt: 'Final de Qatar 2022'
                        },
                        {
                            type: 'image',
                            src: 'assets/posts/messi-trofeo.jpg',
                            alt: 'Messi con el trofeo'
                        },
                        {
                            type: 'video',
                            src: 'assets/posts/highlights-final.mp4',
                            poster: 'assets/posts/video-poster.jpg'
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Historia de los mundiales mexicanos",
                    content: "México ha sido sede de dos mundiales increíbles en 1970 y 1986. En 1970 fue el primer mundial transmitido a color y en 1986 vimos la mano de Dios de Maradona...",
                    status: "pending",
                    fechaCreacion: "2024-12-14",
                    mundial: "México 1986",
                    categorias: ["Historia"],
                    autor: "Ana García",
                    autorId: 124,
                    multimedia: [
                        {
                            type: 'image',
                            src: 'assets/posts/mexico-70.jpg',
                            alt: 'Mundial México 1970'
                        },
                        {
                            type: 'image',
                            src: 'assets/posts/maradona-86.jpg',
                            alt: 'Maradona 1986'
                        }
                    ]
                },
                {
                    id: 3,
                    title: "Predicciones para el Mundial 2026",
                    content: "Con la expansión a 48 equipos, el próximo mundial será muy diferente. Estados Unidos, México y Canadá serán sedes conjuntas...",
                    status: "pending",
                    fechaCreacion: "2024-12-13",
                    mundial: "Estados Unidos 2026",
                    categorias: ["Predicciones"],
                    autor: "Luis Martínez",
                    autorId: 125,
                    multimedia: [
                        {
                            type: 'image',
                            src: 'assets/posts/mundial-2026.jpg',
                            alt: 'Logo Mundial 2026'
                        }
                    ]
                },
                {
                    id: 4,
                    title: "Los mejores goles de Brasil 2014",
                    content: "El mundial de Brasil nos dejó goles espectaculares. Desde el golazo de James Rodríguez hasta el increíble tanto de Van Persie...",
                    status: "approved",
                    fechaCreacion: "2024-12-12",
                    mundial: "Brasil 2014",
                    categorias: ["Historia", "Estadísticas"],
                    autor: "Sofia López",
                    autorId: 126,
                    views: 1234,
                    likes: 89,
                    comments: 23,
                    multimedia: [
                        {
                            type: 'video',
                            src: 'assets/posts/goles-brasil-2014.mp4',
                            poster: 'assets/posts/brasil-2014-poster.jpg'
                        },
                        {
                            type: 'image',
                            src: 'assets/posts/james-gol.jpg',
                            alt: 'Gol de James Rodríguez'
                        },
                        {
                            type: 'image',
                            src: 'assets/posts/van-persie.jpg',
                            alt: 'Gol de Van Persie'
                        }
                    ]
                },
                {
                    id: 5,
                    title: "El peor mundial de la historia",
                    content: "En mi opinión, el mundial de Rusia 2018 fue aburrido y sin emociones reales...",
                    status: "rejected",
                    fechaCreacion: "2024-12-11",
                    mundial: "Rusia 2018",
                    categorias: ["Opinión"],
                    autor: "Miguel Torres",
                    autorId: 127,
                    razonRechazo: "Contenido ofensivo hacia el evento",
                    multimedia: [
                        {
                            type: 'image',
                            src: 'assets/posts/rusia-2018.jpg',
                            alt: 'Mundial Rusia 2018'
                        },
                        {
                            type: 'image',
                            src: 'assets/posts/rusia-2018.jpg',
                            alt: 'Mundial Rusia 2018'
                        },
                        {
                            type: 'image',
                            src: 'assets/posts/rusia-2018.jpg',
                            alt: 'Mundial Rusia 2018'
                        }
                    ]
                }
            ];

            this.updatePostsCounts();
            this.showPosts(this.currentStatus);
            this.updateAdminStats();
        } catch (error) {
            console.error('Error loading posts for moderation:', error);
        }
    }

    loadAdminStats() {
        // Simular estadísticas del admin
        const stats = {
            pending: this.userPosts?.filter(p => p.status === 'pending').length || 0,
            approvedToday: 12,
            rejectedToday: 3
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
        const pendingCount = this.userPosts.filter(p => p.status === 'pending').length;
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
            return post.status === status;
        });

        this.renderPosts(filteredPosts);
    }

    createPostHTML(post) {
        const statusConfig = {
            approved: { icon: 'fas fa-check-circle', text: 'Aprobado', class: 'approved' },
            pending: { icon: 'fas fa-clock', text: 'Pendiente', class: 'pending' },
            rejected: { icon: 'fas fa-times-circle', text: 'Rechazado', class: 'rejected' }
        };

        const config = statusConfig[post.status];
        const formattedDate = this.formatDate(post.fechaCreacion);
        const categories = Array.isArray(post.categorias) ? post.categorias.join(', ') : post.categorias;
        
        // Determinar si es clickeable y qué acción tomar
        const isClickable = post.status === 'approved' || post.status === 'pending';
        const clickAction = post.status === 'pending' ? 
            `onclick="adminProfile.moderatePost(${post.id})"` : 
            `onclick="adminProfile.openPostStats(${post.id})"`;

        // Crear carrusel de multimedia
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
        const moderationButtons = post.status === 'pending' ? `
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
        const additionalClass = post.status === 'pending' ? 'pending-moderation' : '';
        const priorityClass = post.prioridad ? `priority-${post.prioridad}` : '';

        return `
            <div class="post-card fade-in ${isClickable ? 'clickable' : ''} ${additionalClass} ${priorityClass}" ${isClickable ? clickAction : ''}>
                <div class="post-header">
                    <h4>${post.title}</h4>
                    <div class="post-author-info">
                        <span><i class="fas fa-user"></i> ${post.autor}</span>
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    </div>
                </div>
                
                <div class="post-content">
                    <p>${this.truncateText(post.content, 150)}</p>
                    ${createMultimediaCarousel(post.multimedia)}
                </div>
                
                <div class="post-meta">
                    <small><strong>Mundial:</strong> ${post.mundial}</small>
                    <small><strong>Categorías:</strong> ${categories}</small>
                    ${post.status === 'rejected' && post.razonRechazo ? `<small><strong>Razón:</strong> ${post.razonRechazo}</small>` : ''}
                </div>
                
                <div class="post-status ${config.class}">
                    <i class="${config.icon}"></i> ${config.text}
                </div>
                
                ${moderationButtons}
                ${isClickable && post.status === 'approved' ? '<div class="click-hint"><i class="fas fa-chart-line"></i> Click para ver estadísticas</div>' : ''}
                ${post.status === 'pending' ? '<div class="click-hint"><i class="fas fa-gavel"></i> Click para moderar</div>' : ''}
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
        if (!post || post.status !== 'approved') {
            this.showError('Solo se pueden ver estadísticas de publicaciones aprobadas');
            return;
        }

        this.loadPostStatistics(post);
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
        document.getElementById('moderationPostTitle').textContent = post.title;
        document.getElementById('moderationPostContent').textContent = post.content;
        document.getElementById('moderationPostAuthor').textContent = `Por ${post.autor}`;
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

    approvePost() {
        if (!this.currentPostForModeration) return;

        // Simular aprobación - aquí conectarías con tu backend
        this.simulateRequest(() => {
            const postIndex = this.userPosts.findIndex(p => p.id === this.currentPostForModeration.id);
            if (postIndex !== -1) {
                this.userPosts[postIndex].status = 'approved';
                this.userPosts[postIndex].fechaAprobacion = new Date().toISOString().split('T')[0];
                
                // Agregar estadísticas mock
                this.userPosts[postIndex].views = Math.floor(Math.random() * 1000) + 50;
                this.userPosts[postIndex].likes = Math.floor(Math.random() * 200) + 10;
                this.userPosts[postIndex].comments = Math.floor(Math.random() * 50) + 5;
            }

            this.showAdminNotification(`Publicación "${this.currentPostForModeration.title}" aprobada exitosamente`, 'success');
            this.closeModal('postActionModal');
            this.updatePostsCounts();
            this.updateAdminStats();
            
            if (this.currentTab === 'pending') {
                this.showPosts('pending');
            }
            
            this.currentPostForModeration = null;
        });
    }

    rejectPost() {
        if (!this.currentPostForModeration) return;

        // Simular rechazo - aquí conectarías con tu backend
        this.simulateRequest(() => {
            const postIndex = this.userPosts.findIndex(p => p.id === this.currentPostForModeration.id);
            if (postIndex !== -1) {
                this.userPosts[postIndex].status = 'rejected';
                this.userPosts[postIndex].fechaRechazo = new Date().toISOString().split('T')[0];
                this.userPosts[postIndex].razonRechazo = 'Rechazado por el administrador';
            }

            this.showAdminNotification(`Publicación "${this.currentPostForModeration.title}" rechazada`, 'warning');
            this.closeModal('postActionModal');
            this.updatePostsCounts();
            this.updateAdminStats();
            
            if (this.currentTab === 'pending') {
                this.showPosts('pending');
            }
            
            this.currentPostForModeration = null;
        });
    }

    // ================================
    // ESTADÍSTICAS CON MODERACIÓN DE COMENTARIOS
    // ================================

    async loadPostStatistics(post) {
        // Simular datos de estadísticas - aquí conectarías con tu backend
        const mockStats = {
            views: post.views || Math.floor(Math.random() * 1000) + 50,
            likes: post.likes || Math.floor(Math.random() * 200) + 10,
            comments: post.comments || Math.floor(Math.random() * 50) + 5,
            likedBy: [
                { name: 'Ana García', avatar: 'assets/avatars/user1.jpg', date: '2024-12-10' },
                { name: 'Luis Martínez', avatar: 'assets/avatars/user2.jpg', date: '2024-12-09' },
                { name: 'Sofia López', avatar: 'assets/avatars/user3.jpg', date: '2024-12-08' },
                { name: 'Miguel Torres', avatar: 'assets/avatars/user4.jpg', date: '2024-12-07' }
            ],
            recentComments: [
                {
                    id: 1,
                    user: 'Ana García',
                    avatar: 'assets/avatars/user1.jpg',
                    comment: '¡Excelente análisis! Me encantó tu perspectiva sobre este mundial.',
                    date: '2024-12-10'
                },
                {
                    id: 2,
                    user: 'Luis Martínez', 
                    avatar: 'assets/avatars/user2.jpg',
                    comment: 'Totalmente de acuerdo contigo. Ese mundial fue histórico.',
                    date: '2024-12-09'
                },
                {
                    id: 3,
                    user: 'Sofia López',
                    avatar: 'assets/avatars/user3.jpg', 
                    comment: 'Muy interesante tu punto de vista. ¿Podrías profundizar más?',
                    date: '2024-12-08'
                },
                {
                    id: 4,
                    user: 'Usuario Problemático',
                    avatar: 'assets/avatars/user5.jpg',
                    comment: 'Este comentario es inapropiado y debería ser eliminado por el admin.',
                    date: '2024-12-07'
                }
            ]
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
                    <img src="${comment.avatar}" alt="${comment.user}" onerror="this.src='assets/default-avatar.png'">
                    <span class="comment-user">${comment.user}</span>
                    <span class="comment-date">${this.formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.comment}</div>
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

    confirmDeleteComment(commentId) {
        // Simular eliminación de comentario - aquí conectarías con tu backend
        this.simulateRequest(() => {
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
        }, 500);
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
            approved: this.userPosts.filter(p => p.status === 'approved').length,
            pending: this.userPosts.filter(p => p.status === 'pending').length,
            rejected: this.userPosts.filter(p => p.status === 'rejected').length
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