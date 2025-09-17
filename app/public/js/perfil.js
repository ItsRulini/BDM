/**
 * Profile Page JavaScript
 * Maneja toda la funcionalidad de la página de perfil de usuario
 */

export default class ProfileManager {
    constructor() {
        this.currentTab = 'approved';
        this.userPosts = [];
        this.countries = [];
        this.categories = [];
        this.mundiales = [];
        this.selectedFiles = [];
        this.selectedCategories = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadUserData();
        this.loadDropdownData();
        this.loadUserPosts();
    }

    initializeElements() {
        // Modal elements
        this.modalOverlay = document.getElementById('modalOverlay');
        this.editOptionsModal = document.getElementById('editOptionsModal');
        this.passwordModal = document.getElementById('passwordModal');
        this.infoModal = document.getElementById('infoModal');
        this.createPostModal = document.getElementById('createPostModal');
        
        // Form elements
        this.passwordForm = document.getElementById('passwordForm');
        this.infoForm = document.getElementById('infoForm');
        this.createPostForm = document.getElementById('createPostForm');
        
        // Display elements
        this.userPostsGrid = document.getElementById('userPostsGrid');
        this.noPosts = document.getElementById('noPosts');
        
        // Counter elements
        this.approvedCount = document.getElementById('approvedCount');
        this.pendingCount = document.getElementById('pendingCount');
        this.rejectedCount = document.getElementById('rejectedCount');
        
        // Character counter
        this.postContent = document.getElementById('postContent');
        this.charCount = document.getElementById('charCount');
        
        // File inputs
        this.fotoPerfilInput = document.getElementById('fotoPerfil');
        this.multimediaInput = document.getElementById('postMultimedia');

        // Tabs y post grid
        this.tabs = document.querySelectorAll('.tab-btn');
    }

    bindEvents() {
        // Modal events
        this.modalOverlay?.addEventListener('click', () => this.closeAllModals());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });

        // Form events
        this.passwordForm?.addEventListener('submit', (e) => this.handlePasswordChange(e));
        this.infoForm?.addEventListener('submit', (e) => this.handleInfoUpdate(e));
        this.createPostForm?.addEventListener('submit', (e) => this.handleCreatePost(e));

        // Password validation
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        newPassword?.addEventListener('input', () => this.validatePasswordStrength());
        confirmPassword?.addEventListener('input', () => this.validatePasswordMatch());

        // Character counter
        this.postContent?.addEventListener('input', () => this.updateCharCounter());

        // File upload events
        this.fotoPerfilInput?.addEventListener('change', (e) => this.handleProfileImageChange(e));
        this.multimediaInput?.addEventListener('change', (e) => this.handleMultimediaChange(e));

        // Tab buttons
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const status = e.target.dataset.status.toLowerCase();
                this.showPosts(status);
            });
        });

        // Global functions
        window.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        window.openEditOptions = this.openEditOptions.bind(this);
        window.openPasswordModal = this.openPasswordModal.bind(this);
        window.openInfoModal = this.openInfoModal.bind(this);
        window.openCreatePostModal = this.openCreatePostModal.bind(this);
        window.closeModal = this.closeModal.bind(this);
        window.showPosts = this.showPosts.bind(this);
        window.logout = this.logout.bind(this);
    }

    // ================================
    // USER DATA MANAGEMENT
    // ================================

    loadUserData() {
        // Simulación de datos del usuario - aquí conectarías con tu backend
        const userData = {
            nombre: "Villa",
            apellidoPaterno: "González",
            apellidoMaterno: "Mendez",
            correo: "villa.vi@example.com",
            genero: "Masculino",
            fechaNacimiento: "1998-05-15",
            nacionalidad: "Mexicana",
            paisNacimiento: "México",
            fotoPerfil: "assets/default-avatar.png"
        };

        this.displayUserInfo(userData);
    }

    displayUserInfo(userData) {
        // Update display elements
        const displayName = document.getElementById('displayName');
        const displayUsername = document.getElementById('displayUsername');
        const birthDate = document.getElementById('birthDate');
        const gender = document.getElementById('gender');
        const birthCountry = document.getElementById('birthCountry');
        const nationality = document.getElementById('nationality');
        const email = document.getElementById('email');
        const profileImage = document.getElementById('profileImage');

        if (displayName) displayName.textContent = `${userData.nombre} ${userData.apellidoPaterno}`;
        if (displayUsername) displayUsername.textContent = `@${userData.nombre}`;
        if (birthDate) birthDate.textContent = this.formatDate(userData.fechaNacimiento);
        if (gender) gender.textContent = userData.genero;
        if (birthCountry) birthCountry.textContent = userData.paisNacimiento;
        if (nationality) nationality.textContent = userData.nacionalidad;
        if (email) email.textContent = userData.correo;
        if (profileImage) profileImage.src = userData.fotoPerfil;
    }

    async loadDropdownData() {
        try {
            // Simulación de carga de datos - aquí conectarías con tu backend
            this.countries = [
                { id: 1, name: 'México' },
                { id: 2, name: 'Argentina' },
                { id: 3, name: 'Brasil' },
                { id: 4, name: 'España' },
                { id: 5, name: 'Francia' },
                { id: 6, name: 'Alemania' },
                { id: 7, name: 'Inglaterra' },
                { id: 8, name: 'Italia' }
            ];

            this.categories = [
                { id: 1, name: 'Análisis' },
                { id: 2, name: 'Historia' },
                { id: 3, name: 'Estadísticas' },
                { id: 4, name: 'Curiosidades' },
                { id: 5, name: 'Predicciones' },
                { id: 6, name: 'Opinión' },
                { id: 7, name: 'Jugadores' },
                { id: 8, name: 'Equipos' }
            ];

            this.mundiales = [
                { id: 1, name: 'Qatar 2022', year: 2022, country: 'Qatar' },
                { id: 2, name: 'Rusia 2018', year: 2018, country: 'Rusia' },
                { id: 3, name: 'Brasil 2014', year: 2014, country: 'Brasil' },
                { id: 4, name: 'Sudáfrica 2010', year: 2010, country: 'Sudáfrica' },
                { id: 5, name: 'Alemania 2006', year: 2006, country: 'Alemania' },
                { id: 6, name: 'Francia 1998', year: 1998, country: 'Francia' },
                { id: 7, name: 'México 1986', year: 1986, country: 'México' }
            ];

            this.populateDropdowns();
        } catch (error) {
            console.error('Error loading dropdown data:', error);
        }
    }

    populateDropdowns() {
        // Populate countries dropdowns
        const nacionalidadSelect = document.getElementById('nacionalidad');
        const paisNacimientoSelect = document.getElementById('paisNacimiento');
        
        [nacionalidadSelect, paisNacimientoSelect].forEach(select => {
            if (select) {
                this.countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.id;
                    option.textContent = country.name;
                    select.appendChild(option);
                });
            }
        });

        // Populate mundiales dropdown
        const mundialSelect = document.getElementById('postMundial');
        if (mundialSelect) {
            this.mundiales.forEach(mundial => {
                const option = document.createElement('option');
                option.value = mundial.id;
                option.textContent = `${mundial.name} (${mundial.year})`;
                mundialSelect.appendChild(option);
            });
        }

        // Populate categories as interactive pills
        const categoriesContainer = document.getElementById('categoriesContainer');
        if (categoriesContainer) {
            this.categories.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.innerHTML = `
                    <input type="checkbox" id="cat_${category.id}" value="${category.id}">
                    <label for="cat_${category.id}" class="category-pill">
                        <span class="category-name">${category.name}</span>
                    </label>
                `;
                
                const checkbox = categoryItem.querySelector('input');
                const pill = categoryItem.querySelector('.category-pill');
                
                // Event listeners para el efecto visual
                checkbox.addEventListener('change', () => {
                    this.updateSelectedCategories();
                    this.updateCategoryCounter();
                });
                
                // Click en la píldora para alternar
                pill.addEventListener('click', (e) => {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                });
                
                categoriesContainer.appendChild(categoryItem);
            });
        }
    }

    // ================================
    // POSTS MANAGEMENT
    // ================================

    async loadUserPosts() {
        try {
            // Simulación de posts del usuario con multimedia - aquí conectarías con tu backend
            this.userPosts = [
                {
                    id: 1,
                    title: "Mi análisis del Mundial de Qatar 2022",
                    content: "El mundial de Qatar fue espectacular, especialmente la final entre Argentina y Francia. Messi finalmente consiguió su tan ansiado mundial y demostró por qué es considerado el GOAT por muchos. La final fue épica con penales incluidos.",
                    status: "approved",
                    fechaCreacion: "2024-12-15",
                    mundial: "Qatar 2022",
                    categorias: ["Análisis", "Opinión"],
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
                    content: "México ha sido sede de dos mundiales increíbles en 1970 y 1986. En 1970 fue el primer mundial transmitido a color y en 1986 vimos la mano de Dios de Maradona. Ambos eventos marcaron la historia del fútbol mundial.",
                    status: "pending",
                    fechaCreacion: "2024-12-14",
                    mundial: "México 1986",
                    categorias: ["Historia"],
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
                    content: "Con la expansión a 48 equipos, el próximo mundial será muy diferente. Estados Unidos, México y Canadá serán sedes conjuntas por primera vez en la historia. ¿Estará preparado el mundo para este cambio?",
                    status: "rejected",
                    fechaCreacion: "2024-12-13",
                    mundial: "Estados Unidos 2026",
                    categorias: ["Predicciones"],
                    multimedia: [
                        {
                            type: 'image',
                            src: 'assets/posts/mundial-2026.jpg',
                            alt: 'Logo Mundial 2026'
                        }
                    ]
                }
            ];

            this.updatePostsCounts();
            this.showPosts(this.currentTab);
        } catch (error) {
            console.error('Error loading user posts:', error);
        }
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

    renderPosts(posts) {
        if (!this.userPostsGrid) return;

        if (posts.length === 0) {
            this.userPostsGrid.style.display = 'none';
            this.noPosts.style.display = 'block';
            return;
        }

        this.userPostsGrid.style.display = 'grid';
        this.noPosts.style.display = 'none';

        this.userPostsGrid.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
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
        const isClickable = post.status === 'approved';

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
                `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" onclick="event.stopPropagation(); profileManager.goToSlide('${carouselId}', ${index})"></button>`
            ).join('') : '';

            const navigation = multimedia.length > 1 ? `
                <button class="carousel-nav prev" onclick="event.stopPropagation(); profileManager.prevSlide('${carouselId}')" aria-label="Anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next" onclick="event.stopPropagation(); profileManager.nextSlide('${carouselId}')" aria-label="Siguiente">
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
            <div class="post-card fade-in ${isClickable ? 'clickable' : ''}" ${isClickable ? `onclick="profileManager.openPostStats(${post.id})"` : ''}>
                <div class="post-header">
                    <h4>${post.title}</h4>
                    <div class="post-author-info">
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
                </div>
                
                <div class="post-status ${config.class}">
                    <i class="${config.icon}"></i> ${config.text}
                </div>
                
                ${isClickable ? '<div class="click-hint"><i class="fas fa-chart-line"></i> Click para ver estadísticas</div>' : ''}
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

    // ================================
    // MODAL MANAGEMENT
    // ================================

    openEditOptions() {
        this.showModal('editOptionsModal');
    }

    openPasswordModal() {
        this.closeModal('editOptionsModal');
        this.showModal('passwordModal');
        this.resetPasswordForm();
    }

    openInfoModal() {
        this.closeModal('editOptionsModal');
        this.showModal('infoModal');
        this.populateInfoForm();
    }

    openCreatePostModal() {
        this.showModal('createPostModal');
        this.resetCreatePostForm();
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && this.modalOverlay) {
            this.modalOverlay.classList.add('active');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.classList.remove('active');
        }
        
        document.body.style.overflow = 'auto';
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        
        if (this.modalOverlay) {
            this.modalOverlay.classList.remove('active');
        }
        
        document.body.style.overflow = 'auto';
    }

    // ================================
    // FORM HANDLERS
    // ================================

    resetPasswordForm() {
        if (this.passwordForm) {
            this.passwordForm.reset();
            const passwordStrength = document.getElementById('passwordStrength');
            const passwordMatch = document.getElementById('passwordMatch');
            if (passwordStrength) passwordStrength.textContent = '';
            if (passwordMatch) passwordMatch.textContent = '';
        }
    }

    populateInfoForm() {
        // Simular datos actuales del usuario
        const currentData = {
            nombre: "Villa",
            apellidoPaterno: "González", 
            apellidoMaterno: "Mendez",
            correo: "villa.vi@example.com",
            genero: "Masculino",
            fechaNacimiento: "1998-05-15",
            nacionalidad: 1,
            paisNacimiento: 1
        };

        Object.keys(currentData).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                field.value = currentData[key];
            }
        });
    }

    resetCreatePostForm() {
        if (this.createPostForm) {
            this.createPostForm.reset();
            this.selectedFiles = [];
            this.selectedCategories = [];
            this.updateCharCounter();
            this.clearMultimediaPreview();
            this.clearCategorySelections();
            this.updateCategoryCounter();
            this.updateMultimediaCounter();
        }
    }

    handlePasswordChange(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 8) {
            this.showError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        // Aquí enviarías la nueva contraseña al backend
        this.simulateRequest(() => {
            this.showSuccess('Contraseña actualizada exitosamente');
            this.closeModal('passwordModal');
        });
    }

    handleInfoUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(this.infoForm);
        const userData = {};
        
        for (let [key, value] of formData.entries()) {
            if (key !== 'fotoPerfil' || value.size > 0) {
                userData[key] = value;
            }
        }

        // Aquí enviarías los datos al backend
        this.simulateRequest(() => {
            this.showSuccess('Información actualizada exitosamente');
            this.closeModal('infoModal');
            // Actualizar la visualización con los nuevos datos
            this.loadUserData();
        });
    }

    handleCreatePost(e) {
        e.preventDefault();
        
        const content = document.getElementById('postContent').value;
        const mundialId = document.getElementById('postMundial').value;
        
        if (!content.trim()) {
            this.showError('El contenido de la publicación es obligatorio');
            return;
        }

        if (!mundialId) {
            this.showError('Debes seleccionar un mundial');
            return;
        }

        if (this.selectedCategories.length === 0) {
            this.showError('Debes seleccionar al menos una categoría');
            return;
        }

        const postData = {
            contenido: content,
            idMundial: mundialId,
            categorias: this.selectedCategories,
            multimedia: this.selectedFiles
        };

        // Aquí enviarías la publicación al backend
        this.simulateRequest(() => {
            this.showSuccess('Publicación enviada para revisión');
            this.closeModal('createPostModal');
            // Agregar el nuevo post a la lista (con estado pendiente)
            const newPost = {
                id: Date.now(),
                title: content.substring(0, 50) + '...',
                content: content,
                status: 'pending',
                fechaCreacion: new Date().toISOString().split('T')[0],
                mundial: this.mundiales.find(m => m.id == mundialId)?.name || 'Unknown',
                categorias: this.selectedCategories.map(id => 
                    this.categories.find(c => c.id == id)?.name || 'Unknown'
                ),
                multimedia: [] // Los archivos se procesarían en el backend
            };
            
            this.userPosts.unshift(newPost);
            this.updatePostsCounts();
            
            if (this.currentTab === 'pending') {
                this.showPosts('pending');
            }
        });
    }

    // ================================
    // FILE HANDLING
    // ================================

    handleProfileImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showError('Solo se permiten archivos de imagen');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            this.showError('La imagen no puede superar los 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('imagePreview');
            if (preview) {
                preview.innerHTML = `
                    <div class="preview-item">
                        <img src="${e.target.result}" alt="Vista previa">
                        <button type="button" class="preview-remove" onclick="this.parentElement.parentElement.innerHTML=''">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }
        };
        reader.readAsDataURL(file);
    }

    handleMultimediaChange(e) {
        const newFiles = Array.from(e.target.files);
        let validFiles = [];

        newFiles.forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                this.showError(`El archivo ${file.name} supera los 10MB permitidos`);
                return;
            }

            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                this.showError(`El archivo ${file.name} no es un formato válido`);
                return;
            }

            // Verificar que el archivo no esté ya agregado (por nombre y tamaño)
            const isDuplicate = this.selectedFiles.some(existingFile => 
                existingFile.name === file.name && existingFile.size === file.size
            );

            if (!isDuplicate) {
                validFiles.push(file);
            }
        });

        // Agregar archivos válidos a la lista existente (acumular)
        this.selectedFiles = [...this.selectedFiles, ...validFiles];

        // Limpiar el input para permitir seleccionar los mismos archivos nuevamente si es necesario
        e.target.value = '';

        this.displayMultimediaPreview();
        this.updateMultimediaCounter();
    }

    displayMultimediaPreview() {
        const preview = document.getElementById('multimediaPreview');
        if (!preview) return;

        preview.innerHTML = '';

        this.selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item fade-in';

                const mediaElement = file.type.startsWith('image/') 
                    ? `<img src="${e.target.result}" alt="Vista previa" title="${file.name}">` 
                    : `<video src="${e.target.result}" controls title="${file.name}"></video>`;

                previewItem.innerHTML = `
                    ${mediaElement}
                    <button type="button" class="preview-remove" onclick="profileManager.removeFile(${index})" title="Eliminar archivo">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="file-info">
                        <span class="file-name">${this.truncateText(file.name, 15)}</span>
                        <span class="file-size">${this.formatFileSize(file.size)}</span>
                    </div>
                `;

                preview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.displayMultimediaPreview();
        this.updateMultimediaCounter();
    }

    clearMultimediaPreview() {
        const preview = document.getElementById('multimediaPreview');
        if (preview) {
            preview.innerHTML = '';
        }
        this.updateMultimediaCounter();
    }

    updateMultimediaCounter() {
        const counter = document.getElementById('multimediaCounter');
        const fileCount = document.getElementById('fileCount');
        
        if (counter && fileCount) {
            if (this.selectedFiles.length > 0) {
                counter.style.display = 'flex';
                fileCount.textContent = this.selectedFiles.length;
            } else {
                counter.style.display = 'none';
            }
        }
    }

    updateSelectedCategories() {
        this.selectedCategories = [];
        document.querySelectorAll('#categoriesContainer input[type="checkbox"]:checked')
            .forEach(checkbox => {
                this.selectedCategories.push(parseInt(checkbox.value));
            });
    }

    updateCategoryCounter() {
        const categoryCount = document.getElementById('categoryCount');
        if (categoryCount) {
            categoryCount.textContent = this.selectedCategories.length;
        }
    }

    clearCategorySelections() {
        document.querySelectorAll('#categoriesContainer input[type="checkbox"]')
            .forEach(checkbox => {
                checkbox.checked = false;
            });
        this.selectedCategories = [];
        this.updateCategoryCounter();
    }

    // ================================
    // VALIDATION
    // ================================

    // validatePasswordStrength() {
    //     const password = document.getElementById('newPassword').value;
    //     const strengthIndicator = document.getElementById('passwordStrength');
        
    //     if (!strengthIndicator) return;

    //     let strength = 'weak';
    //     let message = 'Muy débil';
        
    //     if (password.length >= 8) {
    //         strength = 'medium';
    //         message = 'Media';
            
    //         if (password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) {
    //             strength = 'strong';
    //             message = 'Fuerte';
    //         }
    //     }

    //     strengthIndicator.className = `password-strength ${strength}`;
    //     strengthIndicator.innerHTML = `<i class="fas fa-shield-alt"></i> ${message}`;
    // }

    validatePasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const matchIndicator = document.getElementById('passwordMatch');
        
        if (!matchIndicator || !confirmPassword) return;

        const isMatch = newPassword === confirmPassword;
        matchIndicator.className = `password-match ${isMatch ? 'match' : 'no-match'}`;
        matchIndicator.innerHTML = isMatch 
            ? '<i class="fas fa-check"></i> Las contraseñas coinciden'
            : '<i class="fas fa-times"></i> Las contraseñas no coinciden';
    }

    updateCharCounter() {
        const content = this.postContent?.value || '';
        const counter = this.charCount;
        
        if (counter) {
            counter.textContent = content.length;
            
            const counterElement = counter.parentElement;
            counterElement.classList.remove('warning', 'danger');
            
            if (content.length > 4500) {
                counterElement.classList.add('danger');
            } else if (content.length > 4000) {
                counterElement.classList.add('warning');
            }
        }
    }

    // ================================
    // UTILITY FUNCTIONS
    // ================================

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileMenu && hamburger) {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }
    }

    logout() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            // Aquí redirigirias al logout del backend
            window.location.href = 'index.php?controller=auth&action=logout';
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

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ================================
    // POST STATISTICS
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

    async loadPostStatistics(post) {
        // Simular datos de estadísticas - aquí conectarías con tu backend
        const mockStats = {
            views: Math.floor(Math.random() * 1000) + 50,
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
                    user: 'Ana García',
                    avatar: 'assets/avatars/user1.jpg',
                    comment: '¡Excelente análisis! Me encantó tu perspectiva sobre este mundial.',
                    date: '2024-12-10'
                },
                {
                    user: 'Luis Martínez', 
                    avatar: 'assets/avatars/user2.jpg',
                    comment: 'Totalmente de acuerdo contigo. Ese mundial fue histórico.',
                    date: '2024-12-09'
                },
                {
                    user: 'Sofia López',
                    avatar: 'assets/avatars/user3.jpg', 
                    comment: 'Muy interesante tu punto de vista. ¿Podrías profundizar más?',
                    date: '2024-12-08'
                }
            ]
        };

        this.displayPostStatistics(post, mockStats);
    }

    displayPostStatistics(post, stats) {
        // Actualizar información del post
        document.getElementById('statsPostTitle').textContent = post.title;
        document.getElementById('statsPostContent').textContent = post.content;
        document.getElementById('statsPostDate').textContent = `Publicado el ${this.formatDate(post.fechaCreacion)}`;
        document.getElementById('statsPostMundial').textContent = post.mundial;

        // Generar carrusel de multimedia para el modal de estadísticas
        const statsMultimediaContainer = document.getElementById('statsPostMultimedia');
        if (statsMultimediaContainer && post.multimedia && post.multimedia.length > 0) {
            const carouselId = `stats-carousel-${post.id}`;
            
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
                `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" onclick="profileManager.goToSlide('${carouselId}', ${index})"></button>`
            ).join('') : '';

            const navigation = post.multimedia.length > 1 ? `
                <button class="carousel-nav prev" onclick="profileManager.prevSlide('${carouselId}')" aria-label="Anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next" onclick="profileManager.nextSlide('${carouselId}')" aria-label="Siguiente">
                    <i class="fas fa-chevron-right"></i>
                </button>
            ` : '';

            statsMultimediaContainer.innerHTML = `
                <div class="multimedia-carousel" id="${carouselId}">
                    <div class="carousel-container">
                        ${slides}
                    </div>
                    ${navigation}
                    ${indicators ? `<div class="carousel-indicators">${indicators}</div>` : ''}
                </div>
            `;
        } else if (statsMultimediaContainer) {
            // Limpiar el contenedor si no hay multimedia
            statsMultimediaContainer.innerHTML = '';
        }

        // Actualizar números de estadísticas
        document.getElementById('statsViews').textContent = stats.views.toLocaleString();
        document.getElementById('statsLikes').textContent = stats.likes.toLocaleString();
        document.getElementById('statsComments').textContent = stats.comments.toLocaleString();

        // Mostrar usuarios que dieron like
        this.displayLikesList(stats.likedBy);
        
        // Mostrar comentarios recientes
        this.displayCommentsList(stats.recentComments);
        
        // Asegurar que el tab de likes esté activo por defecto
        this.showInteractionTab('likes');
    }

    displayLikesList(likedBy) {
        const likesList = document.getElementById('likesList');
        if (!likesList) return;

        if (likedBy.length === 0) {
            likesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <h4>Sin likes aún</h4>
                    <p>Sé el primero en dar like a esta publicación</p>
                </div>
            `;
            return;
        }

        likesList.innerHTML = likedBy.map(user => `
            <div class="user-item">
                <img src="${user.avatar}" alt="${user.name}" onerror="this.src='assets/default-avatar.png'">
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-date">Le gustó el ${this.formatDate(user.date)}</div>
                </div>
            </div>
        `).join('');
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
            <div class="comment-item">
                <div class="comment-header">
                    <img src="${comment.avatar}" alt="${comment.user}" onerror="this.src='assets/default-avatar.png'">
                    <span class="comment-user">${comment.user}</span>
                    <span class="comment-date">${this.formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.comment}</div>
            </div>
        `).join('');
    }

    showInteractionTab(tabName) {
        // Remover clase active de todos los tabs
        document.querySelectorAll('.section-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.interaction-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Activar el tab seleccionado
        document.querySelector(`.section-tabs .tab-btn[onclick*="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    simulateRequest(callback, delay = 1500) {
        // Simula una petición al servidor
        setTimeout(callback, delay);
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Crear notificación temporal
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

        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remove después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        // Click para cerrar
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

// Funciones utilitarias globales
function editProfile() {
    if (window.profileManager) {
        window.profileManager.openEditOptions();
    }
}

// Funciones globales para los tabs de estadísticas
window.showInteractionTab = function(tabName) {
    if (window.profileManager) {
        window.profileManager.showInteractionTab(tabName);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
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