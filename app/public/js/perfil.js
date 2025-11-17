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

        this.userInfo = null;
        
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
        this.postStatsModal = document.getElementById('postStatsModal'); // Añadido
        
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
                // Obtener el status desde el dataset, asegurándose de que sea el botón
                const status = e.target.closest('.tab-btn')?.dataset.status?.toLowerCase();
                if(status) {
                    this.showPosts(status);
                }
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
        //window.logout = this.logout.bind(this);
    }

    // ================================
    // USER DATA MANAGEMENT
    // ================================

    loadUserData() {
        fetch('index.php?controller=api&action=getCurrentUser')
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener los datos del usuario');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    this.userInfo = data.data;
                    this.displayUserInfo(this.userInfo);
                } else {
                    throw new Error(data.message || 'Error en formato de datos');
                }
            })
            .catch(error => {
                console.error('Error cargando datos del usuario:', error);
                const userData = {
                    usuario: {
                        nombre: "Error",
                        apellidoPaterno: "Cargando",
                        apellidoMaterno: "",
                        correo: "error@cargando.com",
                        genero: "N/A",
                        fechaNacimiento: null,
                        fotoPerfil: "assets/default-avatar.png"
                    },
                    paisNacimiento: "N/A",
                    nacionalidad: "N/A"
                };
                this.displayUserInfo(userData);
            });
    }

    displayUserInfo(userData) {
        const usuario = userData.usuario;
        // Update display elements
        const displayName = document.getElementById('displayName');
        const displayUsername = document.getElementById('displayUsername');
        const birthDate = document.getElementById('birthDate');
        const gender = document.getElementById('gender');
        const birthCountry = document.getElementById('birthCountry');
        const nationality = document.getElementById('nationality');
        const email = document.getElementById('email');
        const profileImage = document.getElementById('profileImage');

        if (displayName) displayName.textContent = `${usuario.nombre} ${usuario.apellidoPaterno}`;
        if (displayUsername) displayUsername.textContent = `${usuario.correo}`;
        if (birthDate) {
            if (usuario.fechaNacimiento && usuario.fechaNacimiento !== '0000-00-00') {
                birthDate.textContent = this.formatDate(usuario.fechaNacimiento);
            } else {
                birthDate.textContent = "No especificado";
            }
        }
        if (gender) gender.textContent = usuario.genero || 'No especificado';
        if (birthCountry) birthCountry.textContent = userData.paisNacimiento || 'No especificado';
        if (nationality) nationality.textContent = userData.nacionalidad || 'No especificado';
        if (email) email.textContent = usuario.correo;
        if (profileImage) profileImage.src = usuario.fotoPerfil ?? 'assets/default-avatar.png';
    }

    async loadDropdownData() {
        try {
            // Obtener países
            const response = await fetch('index.php?controller=api&action=getPaises');
            const data = await response.json();
            this.countries = (data.success && Array.isArray(data.data))
                ? data.data.map(pais => ({ id: pais.id, name: pais.nombre }))
                : [];

            // Obtener categorías
            const catResponse = await fetch('index.php?controller=api&action=getCategorias');
            const catData = await catResponse.json();
            this.categories = (catData.success && Array.isArray(catData.data))
                ? catData.data.map(cat => ({ id: cat.id, name: cat.nombre }))
                : [];

            // Obtener mundiales
            const mundialesResponse = await fetch('index.php?controller=api&action=getMundiales');
            const mundialesData = await mundialesResponse.json();
        
            if (mundialesData.success && Array.isArray(mundialesData.data)) {
                this.mundiales = mundialesData.data.map(mundial => ({
                    id: mundial.id,
                    name: mundial.name,
                    year: mundial.year
                }));
            } else {
                this.mundiales = [];
            }

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
                select.innerHTML = '<option value="">Selecciona...</option>'; // Reset
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
            mundialSelect.innerHTML = '<option value="">Selecciona un mundial...</option>'; // Reset
            this.mundiales.forEach(mundial => {
                const option = document.createElement('option');
                option.value = mundial.id;
                option.textContent = `${mundial.name}`;
                mundialSelect.appendChild(option);
            });
        }

        // Populate categories as interactive pills
        const categoriesContainer = document.getElementById('categoriesContainer');
        if (categoriesContainer) {
            categoriesContainer.innerHTML = ''; // Reset
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
                
                checkbox.addEventListener('change', () => {
                    this.updateSelectedCategories();
                    this.updateCategoryCounter();
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
            // AÑADIDA LLAMADA A API
            const response = await fetch('index.php?controller=api&action=getPublicacionesUsuario');
            if (!response.ok) {
                throw new Error('Error al cargar las publicaciones del usuario');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Normalizar el campo `estatus` para que coincida con los valores usados en las pestañas
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
                    const raw = p.estatus || p.status || '';
                    const mapped = statusMap[raw] || raw.toString().toLowerCase();
                    return Object.assign({}, p, { estatus: mapped });
                });
                console.log('[perfil] userPosts cargadas:', this.userPosts.length, this.userPosts.slice(0,3));
            } else {
                console.error('Error fetching user posts:', data.message);
                this.userPosts = [];
            }

            this.updatePostsCounts();
            this.showPosts(this.currentTab);
        } catch (error) {
            console.error('Error loading user posts:', error);
            this.userPosts = []; // Asegurar que sea un array en caso de error
            this.updatePostsCounts();
            this.showPosts(this.currentTab);
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
            return post.estatus === status; // MODIFICADO: de post.status a post.estatus
        });

        this.renderPosts(filteredPosts);
    }

    renderPosts(posts) {
        if (!this.userPostsGrid) return;

        if (posts.length === 0) {
            this.userPostsGrid.style.display = 'none';
            if (this.noPosts) this.noPosts.style.display = 'block';
            return;
        }

        if (this.noPosts) this.noPosts.style.display = 'none';
        this.userPostsGrid.style.display = 'grid';
        this.userPostsGrid.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
    }

    createPostHTML(post) {
        const statusConfig = {
            approved: { icon: 'fas fa-check-circle', text: 'Aprobado', class: 'approved' },
            pending: { icon: 'fas fa-clock', text: 'Pendiente', class: 'pending' },
            rejected: { icon: 'fas fa-times-circle', text: 'Rechazado', class: 'rejected' }
        };

        const config = statusConfig[post.estatus] || statusConfig.pending;
        const formattedDate = this.formatDate(post.fechaCreacion);
        const categories = Array.isArray(post.categorias) ? post.categorias.join(', ') : '';
        const isClickable = post.estatus === 'approved';

        // Crear carrusel de multimedia
        const createMultimediaCarousel = (multimedia) => {
            if (!multimedia || multimedia.length === 0) return '';
            
            const carouselId = `carousel-${post.id}`;
            
            const slides = multimedia.map((item, index) => {
                // MODIFICADO: La API envía 'type' (MIME) y 'src' (URL Base64)
                if (item.type.startsWith('image/')) {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${item.src}" alt="Multimedia de publicación" onerror="this.parentElement.style.display='none'">
                        </div>
                    `;
                } else if (item.type.startsWith('video/')) {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <video controls preload="metadata">
                                <source src="${item.src}" type="${item.type}">
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
                    <h4>${this.truncateText(post.contenido, 50)}</h4>
                    <div class="post-author-info">
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    </div>
                </div>
                
                <div class="post-content">
                    <p>${this.truncateText(post.contenido, 150)}</p>
                    ${createMultimediaCarousel(post.multimedia)}
                </div>
                
                <div class="post-meta">
                    <small><strong>Mundial:</strong> ${post.mundialAño}</small>
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

        activeSlide.classList.remove('active');
        if (activeIndicator) activeIndicator.classList.remove('active');

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

        activeSlide.classList.remove('active');
        if (activeIndicator) activeIndicator.classList.remove('active');

        slides[prevIndex].classList.add('active');
        if (indicators[prevIndex]) indicators[prevIndex].classList.add('active');
    }

    goToSlide(carouselId, slideIndex) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        if (slides[slideIndex]) slides[slideIndex].classList.add('active');
        if (indicators[slideIndex]) indicators[slideIndex].classList.add('active');
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
        
        // Solo cerrar overlay si no hay otros modales activos
        const activeModals = document.querySelectorAll('.modal.active');
        if (activeModals.length === 0) {
            if (this.modalOverlay) {
                this.modalOverlay.classList.remove('active');
            }
            document.body.style.overflow = 'auto';
        }
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
            if (passwordStrength) passwordStrength.style.display = 'none';
            if (passwordMatch) passwordMatch.style.display = 'none';
        }
    }

    populateInfoForm() {
        if (!this.userInfo) {
            console.error("No hay información de usuario para llenar el formulario.");
            return;
        }

        const usuario = this.userInfo.usuario;

        document.getElementById('nombre').value = usuario.nombre || '';
        document.getElementById('apellidoPaterno').value = usuario.apellidoPaterno || '';
        document.getElementById('apellidoMaterno').value = usuario.apellidoMaterno || '';
        document.getElementById('correo').value = usuario.correo || '';
        document.getElementById('genero').value = usuario.genero || '';

        const fechaValida = (usuario.fechaNacimiento && usuario.fechaNacimiento !== '0000-00-00') ? usuario.fechaNacimiento : '';
        document.getElementById('fechaNacimiento').value = fechaValida;

        document.getElementById('paisNacimiento').value = usuario.paisNacimiento || '';
        document.getElementById('nacionalidad').value = usuario.nacionalidad || '';

        this.configurarSelectorCorreo(usuario.correo);

        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('fotoPerfil').value = '';

        // Validación en tiempo real para nombres
        const nombreEdit = document.getElementById('nombre');
        const apellidoPaternoEdit = document.getElementById('apellidoPaterno');
        const apellidoMaternoEdit = document.getElementById('apellidoMaterno');

        [nombreEdit, apellidoPaternoEdit, apellidoMaternoEdit].forEach(input => {
            if (input) {
                // Limpiar listeners antiguos
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);
                // Añadir nuevos listeners
                newInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]/g, '');
                });
            }
        });
    }

    configurarSelectorCorreo(correoActual) {
        const correoContainer = document.getElementById('correoContainer');
        if (!correoContainer) return;

        // Separar el correo actual en partes
        const [parteLocal, dominio] = correoActual.split('@');

        // Si ya está configurado, solo actualizar valores
        const inputUsuario = document.getElementById('correoUsuario');
        const selectDominio = document.getElementById('correoDominio');
        
        if (inputUsuario && selectDominio) {
            inputUsuario.value = parteLocal || '';
            selectDominio.value = dominio || 'gmail.com';
            return;
        }

        // Crear estructura HTML si no existe
        correoContainer.innerHTML = `
            <label for="correoUsuario">
                <i class="fas fa-envelope"></i> Correo Electrónico
            </label>
            <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                <input type="text" id="correoUsuario" placeholder="usuario" required style="flex: 1;">
                <span style="font-weight: bold; color: #00ff88; font-size: 1.2rem; flex-shrink: 0;">@</span>
                <select id="correoDominio" required style="flex: 1;">
                    <option value="gmail.com">gmail.com</option>
                    <option value="outlook.com">outlook.com</option>
                    <option value="hotmail.com">hotmail.com</option>
                </select>
            </div>
        `;
        
        // Asignar valores
        document.getElementById('correoUsuario').value = parteLocal || '';
        document.getElementById('correoDominio').value = dominio || 'gmail.com';

        // Validación en tiempo real del correo
        document.getElementById('correoUsuario').addEventListener('input', (e) => {
            let valor = e.target.value;
            if (valor.startsWith('.')) valor = valor.substring(1);
            valor = valor.replace(/\.{2,}/g, '.');
            valor = valor.replace(/[^a-zA-Z0-9._-]/g, '');
            e.target.value = valor;
        });

        document.getElementById('correoUsuario').addEventListener('blur', (e) => {
            const valor = e.target.value;
            if (valor && !this.validarParteLocalCorreo(valor)) {
                this.showError('El correo debe:\n• Iniciar con letra o número\n• No contener puntos consecutivos');
                e.target.focus();
            }
        });
    }

    validarParteLocalCorreo(parteLocal) {
        if (!parteLocal || parteLocal.trim() === '') return false;
        if (!/^[a-zA-Z0-9]/.test(parteLocal)) return false;
        if (/\.{2,}/.test(parteLocal)) return false;
        if (!/^[a-zA-Z0-9._-]+$/.test(parteLocal)) return false;
        return true;
    }

    obtenerCorreoCompleto() {
        const parteLocal = document.getElementById('correoUsuario')?.value;
        const dominio = document.getElementById('correoDominio')?.value;
        if (!parteLocal || !dominio) return null;
        if (!this.validarParteLocalCorreo(parteLocal)) return null;
        return `${parteLocal}@${dominio}`;
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
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showError('Todos los campos son obligatorios');
            return;
        }
        if (newPassword !== confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return;
        }

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(newPassword)) {
            this.showError('Contraseña insegura. Requiere: 8+ caracteres, mayúscula, minúscula, número y símbolo (@$!%*?&)');
            return;
        }

        fetch('index.php?controller=api&action=updatePassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showSuccess('Contraseña actualizada exitosamente');
                this.closeModal('passwordModal');
                this.resetPasswordForm();
            } else {
                this.showError(data.message || 'Error al actualizar la contraseña');
            }
        })
        .catch(error => {
            console.error('Error al cambiar contraseña:', error);
            this.showError('Error de conexión al cambiar la contraseña');
        });
    }

    async handleInfoUpdate(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellidoPaterno = document.getElementById('apellidoPaterno').value;
        const apellidoMaterno = document.getElementById('apellidoMaterno').value;

        if (!this.validarNombre(nombre, 'Nombre')) return;
        if (!this.validarNombre(apellidoPaterno, 'Apellido Paterno')) return;
        if (apellidoMaterno && !this.validarNombre(apellidoMaterno, 'Apellido Materno', true)) return; // true = opcional

        const correoCompleto = this.obtenerCorreoCompleto();
        if (!correoCompleto) {
            this.showError("Por favor, ingresa un correo válido.");
            return;
        }

        const fotoPerfilInput = document.getElementById('fotoPerfil');
        const file = fotoPerfilInput.files[0];
        let fotoPerfilBase64 = null;

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                this.showError("La imagen no puede superar los 5MB");
                return;
            }
            // Solo necesitamos la parte Base64, sin el prefijo "data:image/..."
            fotoPerfilBase64 = (await this.toBase64(file)).split(',')[1];
        }

        const userData = {
            nombre: nombre,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            correo: correoCompleto,
            genero: document.getElementById('genero').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value || null,
            nacionalidad: document.getElementById('nacionalidad').value,
            paisNacimiento: document.getElementById('paisNacimiento').value,
            fotoPerfil: fotoPerfilBase64 // Enviar solo Base64 o null
        };

        try {
            const response = await fetch('index.php?controller=api&action=updateUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        
            const data = await response.json();

            if (data.success) {
                this.showSuccess('¡Perfil actualizado con éxito!');
                this.closeModal('infoModal');
                this.loadUserData(); // Recargar datos
            } else {
                this.showError(data.message || 'Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            this.showError('Error de conexión al guardar los cambios');
        }
    }

    validarNombre(nombre, campo, opcional = false) {
        if (opcional && (!nombre || nombre.trim() === '')) return true;

        if (!opcional && (!nombre || nombre.trim() === '')) {
            this.showError(`El campo ${campo} es obligatorio.`);
            return false;
        }

        const regex = /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/;
        if (!regex.test(nombre)) {
            this.showError(`El campo ${campo} solo puede contener letras y espacios.`);
            return false;
        }

        return true;
    }

    async handleCreatePost(e) {
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

        const multimediaBase64 = [];
        for (const file of this.selectedFiles) {
            try {
                // Quitar el prefijo "data:..."
                const base64String = (await this.toBase64(file)).split(',')[1];
                multimediaBase64.push(base64String);
            } catch (error) {
                console.error('Error convirtiendo archivo:', error);
                this.showError(`Error al procesar el archivo ${file.name}`);
                return;
            }
        }

        const postData = {
            contenido: content,
            idMundial: parseInt(mundialId),
            categorias: this.selectedCategories,
            multimedia: multimediaBase64
        };

        const submitBtn = this.createPostForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            const response = await fetch('index.php?controller=api&action=crearPublicacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });

            const data = await response.json();

            if (data.success) {
                this.showSuccess('Publicación enviada para revisión');
                this.closeModal('createPostModal');
                this.resetCreatePostForm();
                await this.loadUserPosts(); // Recargar publicaciones
                this.showPosts('pending'); // Cambiar a pestaña de pendientes
            } else {
                this.showError(data.message || 'Error al crear la publicación');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Error de conexión al crear la publicación');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar a Revisión';
        }
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
                        <button type="button" class="preview-remove" onclick="document.getElementById('imagePreview').innerHTML=''; document.getElementById('fotoPerfil').value='';">
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
            if (file.size > 50 * 1024 * 1024) { // 50MB
                this.showError(`El archivo ${file.name} supera los 50MB`);
                return;
            }
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                this.showError(`El archivo ${file.name} no es un formato válido`);
                return;
            }
            const isDuplicate = this.selectedFiles.some(existingFile => 
                existingFile.name === file.name && existingFile.size === file.size
            );
            if (!isDuplicate) {
                validFiles.push(file);
            }
        });

        this.selectedFiles = [...this.selectedFiles, ...validFiles];
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
                    : `<video src="${e.target.result}" muted title="${file.name}"></video>`; // muted para videos

                previewItem.innerHTML = `
                    ${mediaElement}
                    <button type="button" class="preview-remove" data-index="${index}" title="Eliminar archivo">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="file-info">
                        <span class="file-name">${this.truncateText(file.name, 15)}</span>
                        <span class="file-size">${this.formatFileSize(file.size)}</span>
                    </div>
                `;
                
                preview.appendChild(previewItem);

                // Añadir evento al botón de eliminar
                previewItem.querySelector('.preview-remove').addEventListener('click', (event) => {
                    const idxToRemove = parseInt(event.currentTarget.dataset.index);
                    this.removeFile(idxToRemove);
                });
            };
            reader.readAsDataURL(file);
        });
    }

    removeFile(indexToRemove) {
        this.selectedFiles = this.selectedFiles.filter((_, index) => index !== indexToRemove);
        this.displayMultimediaPreview(); // Re-renderizar la vista previa
        this.updateMultimediaCounter();
    }

    clearMultimediaPreview() {
        const preview = document.getElementById('multimediaPreview');
        if (preview) preview.innerHTML = '';
        this.updateMultimediaCounter();
    }

    updateMultimediaCounter() {
        const counter = document.getElementById('multimediaCounter');
        const fileCount = document.getElementById('fileCount');
        
        if (counter && fileCount) {
            const count = this.selectedFiles.length;
            if (count > 0) {
                counter.style.display = 'flex';
                fileCount.textContent = count;
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

    validatePasswordStrength() {
        const password = document.getElementById('newPassword').value;
        const strengthIndicator = document.getElementById('passwordStrength');
        if (!strengthIndicator) return;

        let strength = 'weak';
        let message = 'Muy débil';
        let color = '#ff4757';
        
        if (password.length === 0) {
            strengthIndicator.style.display = 'none';
            return;
        }

        strengthIndicator.style.display = 'block';
        
        if (password.length >= 8) {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (regex.test(password)) {
                strength = 'strong';
                message = 'Fuerte';
                color = '#00ff88';
            } else if (password.length >= 10 && (password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/\d/))) {
                strength = 'medium';
                message = 'Media (falta símbolo)';
                color = '#ffa502';
            } else {
                strength = 'weak';
                message = 'Débil';
                color = '#ff4757';
            }
        }

        strengthIndicator.className = `password-strength ${strength}`;
        strengthIndicator.style.color = color;
        strengthIndicator.innerHTML = `<i class="fas fa-shield-alt"></i> ${message}`;
    }

    validatePasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const matchIndicator = document.getElementById('passwordMatch');
        
        if (!matchIndicator) return;
        if (confirmPassword.length === 0) {
            matchIndicator.style.display = 'none';
            return;
        }

        const isMatch = newPassword === confirmPassword;
        matchIndicator.style.display = 'block';
        matchIndicator.className = `password-match ${isMatch ? 'match' : 'no-match'}`;
        matchIndicator.style.color = isMatch ? '#00ff88' : '#ff4757';
        matchIndicator.innerHTML = isMatch 
            ? '<i class="fas fa-check"></i> Las contraseñas coinciden'
            : '<i class="fas fa-times"></i> Las contraseñas no coinciden';
    }

    updateCharCounter() {
        const content = this.postContent?.value || '';
        const counter = this.charCount;
        const maxLength = 5000;
        
        if (counter) {
            counter.textContent = content.length;
            const counterElement = counter.parentElement;
            counterElement.classList.remove('warning', 'danger');
            
            if (content.length > maxLength) {
                counterElement.classList.add('danger');
            } else if (content.length > maxLength * 0.9) {
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

    formatDate(dateString) {
        if (!dateString) return "Sin fecha";
        // Handle MySQL DATETIME like 'YYYY-MM-DD HH:MM:SS' or ISO strings
        // Treat '0000-00-00' and '0000-00-00 00:00:00' as no date
        const trimmed = ('' + dateString).trim();
        if (trimmed === '' || trimmed.startsWith('0000-00-00')) return 'Sin fecha';

        // If contains space (datetime) or 'T' (ISO), take the date part first
        let candidate = trimmed;
        if (candidate.indexOf(' ') >= 0) candidate = candidate.split(' ')[0];
        if (candidate.indexOf('T') >= 0) candidate = candidate.split('T')[0];

        // If still like YYYY-MM-DD, parse components
        const parts = candidate.split('-');
        if (parts.length === 3) {
            const [y, m, d] = parts.map(Number);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                const date = new Date(y, m - 1, d);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            }
        }

        // Fallback: try Date constructor on the original string
        const parsed = new Date(trimmed);
        if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        return "Fecha inválida";
    }

    truncateText(text, maxLength) {
        if (!text) return '';
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
        if (!post || post.estatus !== 'approved') {
            this.showError('Solo se pueden ver estadísticas de publicaciones aprobadas');
            return;
        }
        this.loadPostStatistics(post);
        this.showModal('postStatsModal');
    }

    async loadPostStatistics(post) {
        try {
            const resp = await fetch(`index.php?controller=api&action=getPostStats&id=${post.id}`);
            if (!resp.ok) throw new Error('Error al obtener estadísticas');
            const data = await resp.json();
            if (!data.success) throw new Error(data.message || 'Respuesta inválida');

            const d = data.data;

            // Mapear likedBy y recentComments al formato que esperan las funciones de render
            const likedBy = (d.likedBy || []).map(u => ({
                name: u.name || 'Usuario',
                avatar: u.fotoPerfil || 'assets/default-avatar.png',
                date: u.date || null
            }));

            const recentComments = (d.recentComments || []).map(c => ({
                user: c.user.name || c.userName || 'Usuario',
                avatar: c.user.fotoPerfil || 'assets/default-avatar.png',
                comment: c.text || c.Comentario || '',
                date: c.date || c.FechaComentario || null
            }));

            const stats = {
                views: d.views || 0,
                likes: d.likes || 0,
                comments: d.comments || 0,
                likedBy: likedBy,
                recentComments: recentComments
            };

            this.displayPostStatistics(post, stats);
        } catch (error) {
            console.error('Error cargando estadísticas reales:', error);
            // Fallback: mostrar algo mínimo en caso de error
            const fallback = { views: 0, likes: 0, comments: 0, likedBy: [], recentComments: [] };
            this.displayPostStatistics(post, fallback);
        }
    }

    displayPostStatistics(post, stats) {
        document.getElementById('statsPostTitle').textContent = this.truncateText(post.contenido, 50);
        document.getElementById('statsPostContent').textContent = post.contenido;
        document.getElementById('statsPostDate').textContent = `Publicado el ${this.formatDate(post.fechaCreacion)}`;
        document.getElementById('statsPostMundial').textContent = post.mundialAño;

        const statsMultimediaContainer = document.getElementById('statsPostMultimedia');
        if (statsMultimediaContainer && post.multimedia && post.multimedia.length > 0) {
            const carouselId = `stats-carousel-${post.id}`;
            const slides = post.multimedia.map((item, index) => {
                if (item.type.startsWith('image/')) {
                    return `<div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}"><img src="${item.src}" alt="Multimedia"></div>`;
                } else if (item.type.startsWith('video/')) {
                    return `<div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}"><video controls preload="metadata"><source src="${item.src}" type="${item.type}"></video></div>`;
                }
                return '';
            }).join('');

            const indicators = post.multimedia.length > 1 ? post.multimedia.map((_, index) => 
                `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" onclick="profileManager.goToSlide('${carouselId}', ${index})"></button>`
            ).join('') : '';

            const navigation = post.multimedia.length > 1 ? `
                <button class="carousel-nav prev" onclick="profileManager.prevSlide('${carouselId}')"><i class="fas fa-chevron-left"></i></button>
                <button class="carousel-nav next" onclick="profileManager.nextSlide('${carouselId}')"><i class="fas fa-chevron-right"></i></button>
            ` : '';

            statsMultimediaContainer.innerHTML = `
                <div class="multimedia-carousel" id="${carouselId}">
                    <div class="carousel-container">${slides}</div>
                    ${navigation}
                    ${indicators ? `<div class="carousel-indicators">${indicators}</div>` : ''}
                </div>
            `;
        } else if (statsMultimediaContainer) {
            statsMultimediaContainer.innerHTML = '';
        }

        document.getElementById('statsViews').textContent = stats.views.toLocaleString();
        document.getElementById('statsLikes').textContent = stats.likes.toLocaleString();
        document.getElementById('statsComments').textContent = stats.comments.toLocaleString();

        this.displayLikesList(stats.likedBy);
        this.displayCommentsList(stats.recentComments);
        this.showInteractionTab('likes');
    }

    displayLikesList(likedBy) {
        const likesList = document.getElementById('likesList');
        if (!likesList) return;
        if (likedBy.length === 0) {
            likesList.innerHTML = `<div class="empty-state"><i class="fas fa-heart-broken"></i><h4>Sin likes aún</h4></div>`;
            return;
        }
        likesList.innerHTML = likedBy.map(user => `
            <div class="user-item">
                <img src="${user.fotoPerfil || 'assets/default-avatar.png'}" alt="${user.name}" onerror="this.src='assets/default-avatar.png'">
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
            commentsList.innerHTML = `<div class="empty-state"><i class="fas fa-comment-slash"></i><h4>Sin comentarios aún</h4></div>`;
            return;
        }
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <img src="${comment.user.fotoPerfil || 'assets/default-avatar.png'}" alt="${comment.user.name}" onerror="this.src='assets/default-avatar.png'">
                    <span class="comment-user">${comment.user.name}</span>
                    <span class="comment-date">${this.formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `).join('');
    }

    showInteractionTab(tabName) {
        document.querySelectorAll('.section-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.interaction-tab').forEach(tab => tab.classList.remove('active'));
        
        const tabButton = document.querySelector(`.section-tabs .tab-btn[onclick*="'${tabName}'"]`);
        const tabContent = document.getElementById(`${tabName}Tab`);
        
        if(tabButton) tabButton.classList.add('active');
        if(tabContent) tabContent.classList.add('active');
    }

    simulateRequest(callback, delay = 1500) {
        setTimeout(callback, delay);
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
                <span>${message.replace(/\n/g, '<br>')}</span>
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

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
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
    // Solo inicializa ProfileManager si no estamos en la página de admin
    // Asumimos que la página de admin tiene un body con class="admin-page" o algo así
    // Una forma más simple: si perfilAdmin.js se carga, él se encargará.
    // Aquí solo inicializamos el base.
    if (typeof AdminProfile === 'undefined') {
        window.profileManager = new ProfileManager();
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