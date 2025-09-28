<?php include_once '../Utils/Auth.php'; ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FootGG - Mundial</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/mundial.css">
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

    <main class="main-content">
        <!-- <section class="mundial-header">
            <div class="header-overlay">
                
            </div>
        </section> -->
        <h1 id="mundial-name">Copa Mundial de la FIFA Qatar 2022</h1>

        <section class="mundial-content">

            <div class="mundial-card description-card">
                <div class="card-header">
                    <h2><i class="fas fa-file-alt"></i> Descripción del Torneo</h2>
                </div>
                <div class="card-body">
                    <p>
                        La Copa Mundial de la FIFA Qatar 2022 fue la XXII edición de la Copa Mundial de Fútbol masculino organizada por la FIFA. Se desarrolló del 20 de noviembre al 18 de diciembre en Qatar, que consiguió los derechos de organización el 2 de diciembre de 2010.
                    </p>
                    <p>
                        El torneo es recordado por ser el primero en realizarse en el Medio Oriente y por su épica final entre Argentina y Francia, donde Lionel Messi se coronó campeón del mundo en un partido que terminó 3-3 y se definió en la tanda de penales.
                    </p>
                </div>
            </div>

            <div class="mundial-card gallery-card">
                 <div class="card-header">
                    <h2><i class="fas fa-images"></i> Galería del mundial</h2>
                </div>
                <div class="card-body">
                    <div class="swiper media-swiper">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide"><img src="https://library.olympics.com/Default/GetDocument/R_MF_A_171449" alt="Momento 1"></div>
                            <div class="swiper-slide"><img src="https://media.tycsports.com/files/2022/12/18/519690/messi-copa-del-mundo_1440x810_wmk.webp" alt="Momento 2"></div>
                            <div class="swiper-slide"><img src="https://www.infobae.com/new-resizer/O9y8-5bA-bD_Wa-Y-g-jA8dM_zM=/992x661/filters:format(webp):quality(85)/cloudfront-us-east-1.images.arcpublishing.com/infobae/P56C6RXLAJFENNFET2G23A2MFA.jpg" alt="Momento 3"></div>
                        </div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                    </div>
                </div>
            </div>
            
            <div class="posts-link-section">
                <h3>¿Quieres saber qué opina la comunidad?</h3>
                <p>Explora las publicaciones, análisis y debates sobre este increíble torneo.</p>
                <a href="index.php?controller=home&action=posts" class="btn-ver-posts">
                    Ver Publicaciones Relacionadas <i class="fas fa-arrow-right"></i>
                </a>
            </div>
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
                <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 FootGG. Todos los derechos reservados.</p>
        </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script src="js/tools.js"></script>
    <script src="js/mundial.js"></script>
</body>
</html>