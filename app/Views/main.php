<?php include_once '../Utils/Auth.php'; ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FootGG - Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/index.css">

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
            <li><a href="index.php?controller=home&action=index" class="active">Inicio</a></li>
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
        <div class="hamburger" onclick="toggleMobileMenu()">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
        <ul>
            <li><a href="index.php?controller=home&action=index" class="active">Inicio</a></li>
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
            <input type="text" class="search-input" placeholder="Buscar por año, sede o nombre del mundial...">
        </div>
        <div class="search-filters">
            <select id="filterCountry">
                <option value="">Filtrar por país sede</option>
            </select>
            <select id="filterYear">
                <option value="">Filtrar por año</option>
            </select>
        </div>
    </section>

    <main class="main-content">
        <section class="world-cups-section">
            <h2 class="section-title">
                <i class="fas fa-globe-americas"></i> Mundiales
            </h2>

            <div class="carousel-wrapper">
                <div class="swiper worldCupSwiper">
                    <div class="swiper-wrapper" id="worldCupsWrapper"></div>
                </div>
                <div class="swiper-navigation">
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                </div>
            </div>
        </section>

        <!-- BALÓN DE ORO -->
        <section class="golden-ball-section">
            <h2 class="section-title">
                <i class="fas fa-medal" style="color: gold;"></i> Balón de Oro del Mundial
            </h2>
            <div class="winners-grid" id="golden-ball-grid"></div>
        </section>

        <!-- BOTÍN DE ORO -->
        <section class="golden-boot-section">
            <h2 class="section-title">
                <i class="fas fa-shoe-prints" style="color: gold;"></i> Botín de Oro del Mundial
            </h2>
            <div class="winners-grid" id="golden-boot-grid"></div>
        </section>

        <!-- GUANTE DE ORO -->
        <section class="golden-glove-section">
            <h2 class="section-title">
                <i class="fas fa-hands" style="color: gold;"></i> Guante de Oro del Mundial
            </h2>
            <div class="winners-grid" id="golden-glove-grid"></div>
        </section>
        
    </main>

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
                <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 FootGG. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    
    <script src="js/tools.js"></script>
    <script src="js/index.js"></script>
</body>
</html>