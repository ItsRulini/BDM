<?php include_once '../Utils/Auth.php'; ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FootGG - Posts</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/posts.css">
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
            <li><a href="index.php?controller=home&action=posts" class="active">Posts</a></li>

            <?php if (Auth::check()): ?>

                <?php if(!Auth::isAdmin()): ?> 
                    <!-- Si no es administrador, mostrar el perfil-->
                    <li><a href="index.php?controller=user&action=perfil">Perfil</a></li>
                <?php endif;?>

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

                <?php if(!Auth::isAdmin()): ?> 
                    <!-- Si no es administrador, mostrar el perfil-->
                    <li><a href="index.php?controller=user&action=perfil">Perfil</a></li>
                <?php endif;?>

                <li><a href="index.php?controller=api&action=logout">Cerrar Sesión</a></li>
            <?php else: ?> <!-- Si no está autenticado, mostrar opciones de registro e inicio de sesión -->
                <li><a href="index.php?controller=home&action=registro">Regístrate</a></li>
                <li><a href="index.php?controller=home&action=login">Ingresar</a></li>
            <?php endif; ?>
        </ul>
    </div>

    <section class="search-container">
        <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="search-input" id="searchInput" placeholder="Buscar por categoría, año, sede, o usuario...">
        </div>
        <div class="search-filters">
            <select id="filterCountry">
                <option value="">Filtrar por Mundial</option>
                <option value="brasil">Brasil 2014</option>
                <option value="argentina">Argentina 1978</option>
                <option value="alemania">Alemania 2006</option>
                <option value="francia">Francia 1998</option>
                <option value="mexico">México 1986</option>
                <option value="rusia">Rusia 2018</option>
                <option value="qatar">Qatar 2022</option>
                <option value="sudafrica">Sudáfrica 2010</option>
            </select>
            <select id="filterCategory">
                <option value="">Filtrar por Categoría</option>
                <option value="analisis">Análisis</option>
                <option value="historia">Historia</option>
                <option value="estadisticas">Estadísticas</option>
                <option value="curiosidades">Curiosidades</option>
                <option value="predicciones">Predicciones</option>
            </select>
            <select id="orderBy">
                <option value="">Ordenar por</option>
                <option value="likes_desc">Likes (Desc.)</option>
                <option value="likes_asc">Likes (Asc.)</option>
                <option value="comments_desc">Comentarios (Desc.)</option>
                <option value="comments_asc">Comentarios (Asc.)</option>
                <option value="date_desc">Más recientes</option>
                <option value="date_asc">Más antiguos</option>
            </select>
        </div>
    </section>

    <main class="main-content">
        <section class="posts-section">
            <div class="posts-header">
                <h2 class="section-title">
                    <i class="fas fa-futbol"></i>
                    Publicaciones de la Comunidad
                </h2>
                <div class="posts-stats">
                    <span id="postsCount" class="posts-counter">Cargando posts...</span>
                </div>
            </div>

            <div class="loading-spinner" id="loadingSpinner">
                <div class="spinner"></div>
                <p>Cargando publicaciones...</p>
            </div>

            <div id="postsContainer" class="posts-container">
                <!-- Las publicaciones se cargarán dinámicamente aquí -->
            </div>

            <div class="no-results" id="noResults" style="display: none;">
                <i class="fas fa-search"></i>
                <h3>No se encontraron publicaciones</h3>
                <p>Intenta ajustar tus filtros de búsqueda</p>
            </div>

            <div class="load-more-container" style="display: none;">
                <button id="loadMoreBtn" class="load-more-btn" style="display: none;">
                    <i class="fas fa-arrow-down"></i>
                    Cargar más publicaciones
                </button>
            </div>
        </section>
    </main>

    <!-- Modal de Comentarios -->
    <div id="commentsModal" class="modal">
        <div class="modal-content large">
            <div class="modal-header">
                <h2><i class="fas fa-comments"></i> Comentarios</h2>
                <button class="close-btn" onclick="closeCommentsModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="comments-section">
                    <!-- Información del post -->
                    <div class="post-summary">
                        <div class="post-summary-content">
                            <h3 id="commentPostTitle">Título del post</h3>
                            <div class="post-summary-meta">
                                <span id="commentPostAuthor">Por Usuario</span>
                                <span id="commentPostDate">Fecha</span>
                            </div>
                        </div>
                    </div>

                    <!-- Formulario para nuevo comentario -->
                    <div class="new-comment-section">
                        <div class="comment-form">
                            <div class="comment-input-group">
                                <img src="assets/default-avatar.png" alt="Tu avatar" class="comment-avatar">
                                <div class="comment-input-container">
                                    <textarea 
                                        id="newCommentText" 
                                        placeholder="Escribe tu comentario aquí..." 
                                        rows="3"
                                        maxlength="500"></textarea>
                                    <div class="comment-counter">
                                        <span id="commentCharCount">0</span>/500
                                    </div>
                                </div>
                            </div>
                            <div class="comment-actions">
                                <button id="cancelCommentBtn" class="btn-cancel" onclick="clearComment()">
                                    Cancelar
                                </button>
                                <button id="submitCommentBtn" class="btn-submit" onclick="submitComment()">
                                    <i class="fas fa-paper-plane"></i>
                                    Comentar
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Lista de comentarios existentes -->
                    <div class="comments-list-section">
                        <div class="comments-header">
                            <h4>
                                <i class="fas fa-comment"></i>
                                <span id="commentsCount">0</span> Comentarios
                            </h4>
                            <div class="comments-sort">
                                <select id="commentsSortBy">
                                    <option value="newest">Más recientes</option>
                                    <option value="oldest">Más antiguos</option>
                                </select>
                            </div>
                        </div>
                        
                        <div id="commentsList" class="comments-list">
                            <!-- Los comentarios se cargarán aquí -->
                        </div>

                        <div id="noComments" class="no-comments" style="display: none;">
                            <i class="fas fa-comment-slash"></i>
                            <h4>Sin comentarios aún</h4>
                            <p>¡Sé el primero en comentar esta publicación!</p>
                        </div>

                        <div id="loadingComments" class="loading-comments" style="display: none;">
                            <div class="small-spinner"></div>
                            <span>Cargando comentarios...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Overlay para modal -->
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
                    <li><a href="index.php?controller=home&action=index">Inicio</a></li>
                    <li><a href="index.php?controller=home&action=posts">Posts</a></li>

                    <?php if (Auth::check()): ?>

                        <?php if(!Auth::isAdmin()): ?> 
                            <!-- Si no es administrador, mostrar el perfil-->
                            <li><a href="index.php?controller=user&action=perfil">Perfil</a></li>
                        <?php endif;?>

                        <li><a href="index.php?controller=api&action=logout">Cerrar Sesión</a></li>
                    <?php else: ?> <!-- Si no está autenticado, mostrar opciones de registro e inicio de sesión -->
                        <li><a href="index.php?controller=home&action=registro">Regístrate</a></li>
                        <li><a href="index.php?controller=home&action=login">Ingresar</a></li>
                    <?php endif; ?>
                </ul>
            </div>
            <div class="footer-social">
                <h4>Síguenos</h4>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 FootGG. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script src="js/posts.js"></script>
</body>
</html>