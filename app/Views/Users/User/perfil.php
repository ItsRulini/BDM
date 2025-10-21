<?php include_once '../Utils/Auth.php'; ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FootGG - Mi Perfil</title>

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/perfil.css">
    <link rel="icon" type="image/png" href="assets/isotipo.png">
</head>
<body>

    <nav class="navbar">
        <div class="logo">
            <a href="index.php?controller=home&action=index">
                <img src="assets/isologo white.png" alt="FootGG Logo" class="logo-image">
            </a>
        </div>
        <ul class="nav-menu">
            <li><a href="index.php?controller=home&action=index">Inicio</a></li>
            <li><a href="index.php?controller=home&action=posts">Posts</a></li>

            <?php if (Auth::check()): ?>
                <li><a href="index.php?controller=user&action=perfil" class="active">Perfil</a></li>
                <li><a href="index.php?controller=api&action=logout">Cerrar Sesión</a></li>
            <?php else: ?> <!-- Si no está autenticado, mostrar opciones de registro e inicio de sesión -->
                <li><a href="index.php?controller=home&action=registro">Regístrate</a></li>
                <li><a href="index.php?controller=home&action=login">Ingresar</a></li>
            <?php endif; ?>
        </ul>
        <div class="hamburger" onclick="toggleMobileMenu()">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </nav>
    
    <div class="mobile-menu" id="mobileMenu">
        <ul>
            <li><a href="index.php?controller=home&action=index">Inicio</a></li>
            <li><a href="index.php?controller=home&action=posts">Posts</a></li>

            <?php if (Auth::check()): ?>
                <li><a href="index.php?controller=user&action=perfil" class="active">Perfil</a></li>
                <li><a href="index.php?controller=api&action=logout">Cerrar Sesión</a></li>
            <?php else: ?> <!-- Si no está autenticado, mostrar opciones de registro e inicio de sesión -->
                <li><a href="index.php?controller=home&action=registro">Regístrate</a></li>
                <li><a href="index.php?controller=home&action=login">Ingresar</a></li>
            <?php endif; ?>
        </ul>
    </div>

    <main class="main-content">
        <section class="profile-main-header">
            <h1><i class="fas fa-user-circle"></i> Mi Perfil</h1>
            <p>Aquí puedes ver tu información, tus publicaciones y tu actividad en FootGG.</p>
        </section>

        <div class="profile-grid">
            <aside class="profile-sidebar">
                <div class="profile-card">
                    <div class="profile-avatar">
                        <img id="profileImage" src="assets/default-avatar.png" alt="Avatar de Usuario">
                        <div class="avatar-overlay">
                            <i class="fas fa-camera"></i>
                        </div>
                    </div>
                    <div class="profile-name">
                        <h2 id="displayName">Villa González</h2>
                        <p id="displayUsername">@Villa</p>
                    </div>
                    <button class="edit-profile-btn" onclick="openEditOptions()">
                        <i class="fas fa-edit"></i> Editar Perfil
                    </button>
                </div>

                <div class="info-card">
                    <h3><i class="fas fa-id-card"></i> Información Personal</h3>
                    <ul id="userInfoList">
                        <li>
                            <i class="fas fa-calendar-alt"></i>
                            <strong>Fecha de Nacimiento:</strong>
                            <span id="birthDate">15/05/1998</span>
                        </li>
                        <li>
                            <i class="fas fa-venus-mars"></i>
                            <strong>Género:</strong>
                            <span id="gender">Masculino</span>
                        </li>
                        <li>
                            <i class="fas fa-flag"></i>
                            <strong>País de Nacimiento:</strong>
                            <span id="birthCountry">México</span>
                        </li>
                        <li>
                            <i class="fas fa-globe"></i>
                            <strong>Nacionalidad:</strong>
                            <span id="nationality">Mexicana</span>
                        </li>
                        <li>
                            <i class="fas fa-envelope"></i>
                            <strong>Correo:</strong>
                            <span id="email">villa.vi@example.com</span>
                        </li>
                    </ul>
                </div>
            </aside>

            <section class="posts-section">
                <div class="posts-header">
                    <h2><i class="fas fa-file-alt"></i> Mis Publicaciones</h2>
                    <button class="add-post-btn" onclick="openCreatePostModal()" title="Crear nueva publicación">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div class="post-tabs">
                    <button class="tab-btn active" data-status="approved">
                        Aprobadas <span class="tab-count" id="approvedCount">0</span>
                    </button>
                    <button class="tab-btn" data-status="pending">
                        Pendientes <span class="tab-count" id="pendingCount">0</span>
                    </button>
                    <button class="tab-btn" data-status="rejected">
                        Rechazadas <span class="tab-count" id="rejectedCount">0</span>
                    </button>
                </div>

                <div class="posts-grid" id="userPostsGrid">
                    <!-- Los posts se cargarán dinámicamente -->
                </div>

                <div class="no-posts" id="noPosts" style="display: none;">
                    <i class="fas fa-file-text"></i>
                    <h3>No hay publicaciones</h3>
                    <p>¡Crea tu primera publicación sobre los mundiales!</p>
                </div>
            </section>
        </div>
    </main>

    <!-- Modal para opciones de edición -->
    <div id="editOptionsModal" class="modal">
        <div class="modal-content small">
            <div class="modal-header">
                <h2><i class="fas fa-edit"></i> Opciones de Edición</h2>
                <button class="close-btn" onclick="closeModal('editOptionsModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="edit-options">
                    <button class="option-btn" onclick="openPasswordModal()">
                        <i class="fas fa-lock"></i>
                        <span>Cambiar Contraseña</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <button class="option-btn" onclick="openInfoModal()">
                        <i class="fas fa-user-edit"></i>
                        <span>Editar Información</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para cambiar contraseña -->
    <div id="passwordModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2><i class="fas fa-lock"></i> Cambiar Contraseña</h2>
            <button class="close-btn" onclick="closeModal('passwordModal')">&times;</button>
        </div>
        <form id="passwordForm" class="modal-body">
            <!-- CAMPO NUEVO: Contraseña Actual -->
            <div class="form-group">
                <label for="currentPassword">
                    <i class="fas fa-key"></i> Contraseña Actual
                </label>
                <input type="password" id="currentPassword" name="currentPassword" required 
                       placeholder="Ingresa tu contraseña actual">
                <small class="form-hint">Por seguridad, necesitamos verificar tu contraseña actual</small>
            </div>

            <div class="form-group">
                <label for="newPassword">
                    <i class="fas fa-lock"></i> Nueva Contraseña
                </label>
                <input type="password" id="newPassword" name="newPassword" required minlength="8"
                       placeholder="Mínimo 8 caracteres">
                <div class="password-strength" id="passwordStrength" style="display: none;"></div>
            </div>

            <div class="form-group">
                <label for="confirmPassword">
                    <i class="fas fa-check-circle"></i> Confirmar Nueva Contraseña
                </label>
                <input type="password" id="confirmPassword" name="confirmPassword" required
                       placeholder="Repite la nueva contraseña">
                <div class="password-match" id="passwordMatch" style="display: none;"></div>
            </div>

            <!-- Requisitos de la contraseña -->
            <div class="password-requirements">
                <p><strong><i class="fas fa-info-circle"></i> Requisitos de la contraseña:</strong></p>
                <ul>
                    <li><i class="fas fa-check-circle"></i> Mínimo 8 caracteres</li>
                    <li><i class="fas fa-check-circle"></i> Al menos una letra mayúscula (A-Z)</li>
                    <li><i class="fas fa-check-circle"></i> Al menos una letra minúscula (a-z)</li>
                    <li><i class="fas fa-check-circle"></i> Al menos un número (0-9)</li>
                    <li><i class="fas fa-check-circle"></i> Al menos un caracter especial (@$!%*?&)</li>
                </ul>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn-secondary" onclick="closeModal('passwordModal')">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button type="submit" class="btn-primary">
                    <i class="fas fa-save"></i> Cambiar Contraseña
                </button>
            </div>
        </form>
    </div>
</div>

    <!-- Modal para editar información -->
    <div id="infoModal" class="modal">
        <div class="modal-content large">
            <div class="modal-header">
                <h2><i class="fas fa-user-edit"></i> Editar Información Personal</h2>
                <button class="close-btn" onclick="closeModal('infoModal')">&times;</button>
            </div>
            <form id="infoForm" class="modal-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="nombre">
                            <i class="fas fa-user"></i> Nombre
                        </label>
                        <input type="text" id="nombre" name="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="apellidoPaterno">
                            <i class="fas fa-user"></i> Apellido Paterno
                        </label>
                        <input type="text" id="apellidoPaterno" name="apellidoPaterno" required>
                    </div>
                    <div class="form-group">
                        <label for="apellidoMaterno">
                            <i class="fas fa-user"></i> Apellido Materno
                        </label>
                        <input type="text" id="apellidoMaterno" name="apellidoMaterno">
                    </div>
                    <div class="form-group">
                        <label for="correo">
                            <i class="fas fa-envelope"></i> Correo Electrónico
                        </label>
                        <input type="email" id="correo" name="correo" required>
                    </div>
                    <div class="form-group">
                        <label for="genero">
                            <i class="fas fa-venus-mars"></i> Género
                        </label>
                        <select id="genero" name="genero" required>
                            <option value="">Selecciona tu género</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="fechaNacimiento">
                            <i class="fas fa-calendar-alt"></i> Fecha de Nacimiento
                        </label>
                        <input type="date" id="fechaNacimiento" name="fechaNacimiento" required>
                    </div>
                    <div class="form-group">
                        <label for="nacionalidad">
                            <i class="fas fa-globe"></i> Nacionalidad
                        </label>
                        <select id="nacionalidad" name="nacionalidad" required>
                            <option value="">Selecciona tu nacionalidad</option>
                            <!-- Las opciones se cargarán dinámicamente -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="paisNacimiento">
                            <i class="fas fa-flag"></i> País de Nacimiento
                        </label>
                        <select id="paisNacimiento" name="paisNacimiento" required>
                            <option value="">Selecciona tu país de nacimiento</option>
                            <!-- Las opciones se cargarán dinámicamente -->
                        </select>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label for="fotoPerfil">
                        <i class="fas fa-camera"></i> Foto de Perfil
                    </label>
                    <div class="file-upload-area">
                        <input type="file" id="fotoPerfil" name="fotoPerfil" accept="image/*">
                        <div class="upload-placeholder">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Haz clic para seleccionar una imagen o arrastra aquí</p>
                            <span>PNG, JPG hasta 5MB</span>
                        </div>
                        <div class="image-preview" id="imagePreview"></div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('infoModal')">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para crear publicación -->
    <div id="createPostModal" class="modal">
        <div class="modal-content large">
            <div class="modal-header">
                <h2><i class="fas fa-plus-circle"></i> Crear Nueva Publicación</h2>
                <button class="close-btn" onclick="closeModal('createPostModal')">&times;</button>
            </div>
            <form id="createPostForm" class="modal-body">
                <div class="form-group full-width">
                    <label for="postContent">
                        <i class="fas fa-edit"></i> Contenido de la Publicación
                    </label>
                    <textarea id="postContent" name="contenido" placeholder="Comparte tu opinión sobre los mundiales..." required rows="6"></textarea>
                    <div class="char-counter">
                        <span id="charCount">0</span>/5000 caracteres
                    </div>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="postMundial">
                            <i class="fas fa-trophy"></i> Mundial (Obligatorio)
                        </label>
                        <select id="postMundial" name="idMundial" required>
                            <option value="">Selecciona un mundial</option>
                            <!-- Las opciones se cargarán dinámicamente -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="postCategorias">
                            <i class="fas fa-tags"></i> Categorías (Mínimo 1)
                        </label>
                        <div class="categories-container" id="categoriesContainer">
                            <!-- Las categorías se cargarán dinámicamente como pills -->
                        </div>
                        <div class="selected-count" id="selectedCount">
                            <i class="fas fa-check-circle"></i> 
                            <span id="categoryCount">0</span> categorías seleccionadas
                        </div>
                    </div>
                </div>

                <div class="form-group full-width">
                    <label for="postMultimedia">
                        <i class="fas fa-photo-video"></i> Multimedia (Opcional)
                    </label>
                    <div class="multimedia-upload">
                        <input type="file" id="postMultimedia" name="multimedia[]" accept="image/*,video/*" multiple>
                        <div class="upload-area" onclick="document.getElementById('postMultimedia').click()">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Selecciona más imágenes o videos</p>
                            <span>PNG, JPG, MP4, MOV hasta 10MB cada uno</span>
                        </div>
                        <div class="multimedia-preview" id="multimediaPreview"></div>
                        <div class="multimedia-counter" id="multimediaCounter" style="display: none;">
                            <i class="fas fa-photo-video"></i>
                            <span id="fileCount">0</span> archivos seleccionados
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('createPostModal')">Cancelar</button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-paper-plane"></i> Publicar
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal para ver estadísticas de publicación -->
    <div id="postStatsModal" class="modal">
        <div class="modal-content large">
            <div class="modal-header">
                <h2><i class="fas fa-chart-line"></i> Estadísticas de Publicación</h2>
                <button class="close-btn" onclick="closeModal('postStatsModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="post-stats-content">
                    <div class="post-preview">
                        <h3 id="statsPostTitle">Título de la publicación</h3>
                        <p id="statsPostContent">Contenido de la publicación...</p>
                        
                        <!-- Carrusel de multimedia en el modal de estadísticas -->
                        <div class="post-multimedia-stats" id="statsPostMultimedia">
                            <!-- El carrusel se generará dinámicamente aquí -->
                        </div>
                        
                        <div class="post-meta-stats">
                            <span id="statsPostDate">Fecha de publicación</span>
                            <span id="statsPostMundial">Mundial</span>
                        </div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card views">
                            <div class="stat-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-number" id="statsViews">0</span>
                                <span class="stat-label">Visualizaciones</span>
                            </div>
                        </div>
                        
                        <div class="stat-card likes">
                            <div class="stat-icon">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-number" id="statsLikes">0</span>
                                <span class="stat-label">Me Gusta</span>
                            </div>
                        </div>
                        
                        <div class="stat-card comments">
                            <div class="stat-icon">
                                <i class="fas fa-comment"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-number" id="statsComments">0</span>
                                <span class="stat-label">Comentarios</span>
                            </div>
                        </div>
                    </div>

                    <div class="interactions-section">
                        <div class="section-tabs">
                            <button class="tab-btn active" onclick="showInteractionTab('likes')">
                                <i class="fas fa-heart"></i> Usuarios que dieron Like
                            </button>
                            <button class="tab-btn" onclick="showInteractionTab('comments')">
                                <i class="fas fa-comment"></i> Comentarios Recientes
                            </button>
                        </div>
                        
                        <div class="interactions-content">
                            <div id="likesTab" class="interaction-tab active">
                                <div class="users-list" id="likesList">
                                    <!-- Lista de usuarios que dieron like -->
                                </div>
                            </div>
                            
                            <div id="commentsTab" class="interaction-tab">
                                <div class="comments-list" id="commentsList">
                                    <!-- Lista de comentarios -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Overlay para modales -->
    <div id="modalOverlay" class="modal-overlay"></div>

    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-logo">
                <img src="assets/isologo white.png" alt="FootGG Logo">
                <p>Tu fuente #1 para todo sobre la Copa del Mundo.</p>
            </div>
            <div class="footer-links">
                <h4>Navegación</h4>
                <ul>
                    <li><a href="index.php?controller=home&action=index" class="active">Inicio</a></li>
                    <li><a href="index.php?controller=home&action=posts">Posts</a></li>

                    <?php if (Auth::check()): ?>
                        <li><a href="index.php?controller=user&action=perfil">Perfil</a></li>
                        <li><a href="index.php?controller=api&action=logout">Cerrar Sesión</a></li>
                    <?php else: ?> <!-- Si no está autenticado, mostrar opciones de registro e inicio de sesión -->
                        <li><a href="index.php?controller=home&action=registro">Regístrate</a></li>
                        <li><a href="index.php?controller=home&action=login">Ingresar</a></li>
                    <?php endif; ?>
                </ul>
            </div>
            <div class="footer-social">
                <h4>Síguenos</h4>
                <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 FootGG. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script type="module" src="js/perfil.js"></script>
</body>
</html>