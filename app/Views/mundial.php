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
        <h1 id="mundial-name">Copa Mundial de la FIFA Qatar 2022</h1>

        <section class="mundial-content">
            <!-- DESCRIPCIÓN -->
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

            <!-- GALERÍA -->
            <div class="mundial-card gallery-card">
                <div class="card-header">
                    <h2><i class="fas fa-images"></i> Galería del Mundial</h2>
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

            <!-- MASCOTA -->
            <div class="mundial-card mascot-card">
                <div class="card-header">
                    <h2><i class="fas fa-paw"></i> Mascota Oficial</h2>
                </div>
                <div class="card-body">
                    <div class="mascot-container">
                        <div class="mascot-image">
                            <img src="https://cloudfront-us-east-1.images.arcpublishing.com/infobae/PFHWSGD2NRGVJL4YXQKGFDVZXM.jpg" alt="La'eeb">
                        </div>
                        <div class="mascot-info">
                            <h3>La'eeb</h3>
                            <p>La mascota oficial del Mundial de Qatar 2022 fue La'eeb, cuyo nombre significa "jugador súper habilidoso" en árabe. Su diseño está inspirado en el kufiyya, el tocado tradicional árabe, representando la cultura del país anfitrión.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- POSICIONES FINALES -->
            <div class="mundial-card positions-card">
                <div class="card-header">
                    <h2><i class="fas fa-trophy"></i> Posiciones Finales</h2>
                </div>
                <div class="card-body">
                    <div class="positions-grid">
                        <div class="position-item champion">
                            <div class="position-medal">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="position-info">
                                <span class="position-label">Campeón</span>
                                <h3>Argentina</h3>
                            </div>
                        </div>

                        <div class="position-item runner-up">
                            <div class="position-medal">
                                <i class="fas fa-medal"></i>
                            </div>
                            <div class="position-info">
                                <span class="position-label">Subcampeón</span>
                                <h3>Francia</h3>
                            </div>
                        </div>

                        <div class="position-item third-place">
                            <div class="position-medal">
                                <i class="fas fa-medal"></i>
                            </div>
                            <div class="position-info">
                                <span class="position-label">Tercer Puesto</span>
                                <h3>Croacia</h3>
                            </div>
                        </div>

                        <div class="position-item fourth-place">
                            <div class="position-medal">
                                <i class="fas fa-award"></i>
                            </div>
                            <div class="position-info">
                                <span class="position-label">Cuarto Puesto</span>
                                <h3>Marruecos</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RESULTADO DE LA FINAL -->
            <div class="mundial-card final-card">
                <div class="card-header">
                    <h2><i class="fas fa-futbol"></i> Resultado de la Final</h2>
                </div>
                <div class="card-body">
                    <div class="final-result">
                        <div class="final-teams">
                            <div class="team-info">
                                <h3>Argentina</h3>
                            </div>
                            <div class="score-container">
                                <div class="score-box">
                                    <span class="score">3</span>
                                    <span class="score-separator">-</span>
                                    <span class="score">3</span>
                                </div>
                                <span class="score-label">Tiempo Reglamentario</span>
                            </div>
                            <div class="team-info">
                                <h3>Francia</h3>
                            </div>
                        </div>

                        <div class="final-details">
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>Tiempo Extra: 3-3</span>
                            </div>
                            <div class="detail-item highlight">
                                <i class="fas fa-circle-dot"></i>
                                <span>Definido por Penales</span>
                            </div>
                            <div class="detail-item final-score">
                                <i class="fas fa-trophy"></i>
                                <span class="winner">Argentina 4-2 (Penales)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PREMIOS INDIVIDUALES -->
            <div class="mundial-card awards-card">
                <div class="card-header">
                    <h2><i class="fas fa-star"></i> Premios Individuales</h2>
                </div>
                <div class="card-body">
                    <div class="awards-grid-container">
                        <!-- Balones -->
                        <div class="award-category">
                            <h3><i class="fas fa-futbol"></i> Mejor Jugador</h3>
                            <div class="players-row">
                                <div class="player-award gold">
                                    <div class="player-photo">
                                        <img src="https://cdn.resfu.com/media/img_news/lionel-messi-de-argentina-celebra-tras-anotar-el-primer-gol-de-su-equipo-desde-el-punto-de-penalti-durante-el-partido-de-la-final--afp.jpg?size=1000x&lossy=1" alt="Lionel Messi">
                                    </div>
                                    <div class="player-info">
                                        <span class="award-name">Balón de Oro</span>
                                        <h4>Lionel Messi</h4>
                                        <p>Argentina</p>
                                    </div>
                                </div>

                                <div class="player-award silver">
                                    <div class="player-photo">
                                        <img src="https://e.rpp-noticias.io/xlarge/2022/12/18/551755_1428181.jpg" alt="Kylian Mbappé">
                                    </div>
                                    <div class="player-info">
                                        <span class="award-name">Balón de Plata</span>
                                        <h4>Kylian Mbappé</h4>
                                        <p>Francia</p>
                                    </div>
                                </div>

                                <div class="player-award bronze">
                                    <div class="player-photo">
                                        <img src="https://tmssl.akamaized.net/images/foto/galerie/luka-modric-kroatien-2022-1670507916-97683.jpg?lm=1670507928" alt="Luka Modrić">
                                    </div>
                                    <div class="player-info">
                                        <span class="award-name">Balón de Bronce</span>
                                        <h4>Luka Modrić</h4>
                                        <p>Croacia</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Botines -->
                        <div class="award-category">
                            <h3><i class="fas fa-shoe-prints"></i> Máximo Goleador</h3>
                            <div class="players-row">
                                <div class="player-award gold">
                                    <div class="player-photo">
                                        <img src="https://e.rpp-noticias.io/xlarge/2022/12/18/551755_1428181.jpg" alt="Kylian Mbappé">
                                    </div>
                                    <div class="player-info">
                                        <span class="award-name">Botín de Oro</span>
                                        <h4>Kylian Mbappé</h4>
                                        <p>Francia - 8 goles</p>
                                    </div>
                                </div>

                                <div class="player-award silver">
                                    <div class="player-photo">
                                        <img src="https://cdn.resfu.com/media/img_news/lionel-messi-de-argentina-celebra-tras-anotar-el-primer-gol-de-su-equipo-desde-el-punto-de-penalti-durante-el-partido-de-la-final--afp.jpg?size=1000x&lossy=1" alt="Lionel Messi">
                                    </div>
                                    <div class="player-info">
                                        <span class="award-name">Botín de Plata</span>
                                        <h4>Lionel Messi</h4>
                                        <p>Argentina - 7 goles</p>
                                    </div>
                                </div>

                                <div class="player-award bronze">
                                    <div class="player-photo">
                                        <img src="https://phantom-marca.unidadeditorial.es/c9b8c29e0dc94f5bcc87ea17ca9faec8/resize/828/f/jpg/assets/multimedia/imagenes/2022/12/03/16701535775119.jpg" alt="Olivier Giroud">
                                    </div>
                                    <div class="player-info">
                                        <span class="award-name">Botín de Bronce</span>
                                        <h4>Olivier Giroud</h4>
                                        <p>Francia - 4 goles</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Guante de Oro -->
                        <div class="award-category single">
                            <h3><i class="fas fa-hands"></i> Mejor Portero</h3>
                            <div class="players-row single-award">
                                <div class="player-award gold large">
                                    <div class="player-photo">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxzEVWEUP5gAslIuzj_iXhGEe8CxW2vxQOgg&s" alt="Emiliano Martínez">
                                    </div>
                                    <div class="player-info">
                                        <span class="award-name">Guante de Oro</span>
                                        <h4>Emiliano Martínez</h4>
                                        <p>Argentina</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- ENLACE A POSTS -->
            <div class="posts-link-section">
                <h3>¿Quieres saber qué opina la comunidad?</h3>
                <p>Explora las publicaciones, análisis y debates sobre este increíble torneo.</p>
                <a id="btnVerPosts" href="index.php?controller=home&action=posts<?php echo isset($_GET['id']) ? '&mundial=' . (int)$_GET['id'] : ''; ?>" class="btn-ver-posts">
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