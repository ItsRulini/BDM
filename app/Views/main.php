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
                <option value="brasil">Brasil</option>
                <option value="argentina">Argentina</option>
                <option value="alemania">Alemania</option>
                <option value="francia">Francia</option>
                <option value="mexico">México</option>
            </select>
            <select id="filterYear">
                <option value="">Filtrar por año</option>
                <option value="2022">2022</option>
                <option value="2018">2018</option>
                <option value="2014">2014</option>
                <option value="2010">2010</option>
                <option value="2006">2006</option>
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

        <section class="rankings-section">
            <div class="rankings-container">
                <div class="ranking-column">
                    <div class="ranking-header">
                        <h2>Clasificación Mundial</h2>
                        <span>Última actualización: 10 sep 2025</span>
                    </div>
                    <div class="ranking-table">
                        <div class="table-header">
                            <span class="col-rank">Clasif.</span>
                            <span class="col-team">Equipo</span>
                            <span class="col-points">Total de pun.</span>
                            <span class="col-change">+/- puntos</span>
                        </div>
                        <div class="table-body" id="fifaRankingBody"></div>
                    </div>
                    <a href="#" class="btn-view-full">CLASIFICACIÓN MASCULINA <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="ranking-column">
                    <div class="swiper qualifiersSwiper">
                        <div class="swiper-slide">
                            <div class="ranking-header header-with-selector">
                                <div>
                                    <h2>Eliminatorias Europa (UEFA)</h2>
                                    <span>Fase de Grupos</span>
                                </div>
                                <select id="uefa-group-selector" class="group-selector"></select>
                            </div>
                            <div class="ranking-table uefa-table"> 
                                <div class="table-header">
                                    <span class="col-pos"></span>
                                    <span class="col-team-uefa">Club</span>
                                    <span class="col-pj">PJ</span>
                                    <span class="col-g">G</span>
                                    <span class="col-e">E</span>
                                    <span class="col-p">P</span>
                                    <span class="col-gf">GF</span>
                                    <span class="col-gc">GC</span>
                                    <span class="col-dg">DG</span>
                                    <span class="col-pts">Pts</span>
                                </div>
                                <div class="table-body" id="uefaQualifiersBody"></div>
                            </div>
                        </div>

                        <div class="swiper-slide">
                            <div class="ranking-header">
                                <h2>Eliminatorias Sudamérica (CONMEBOL)</h2>
                                <span>Jornada 18 de 18</span>
                            </div>
                            <div class="ranking-table">
                                <div class="table-header">
                                    <span class="col-rank">Pos.</span>
                                    <span class="col-team">Equipo</span>
                                    <span class="col-points">Pts</span>
                                    <span class="col-played">PJ</span>
                                </div>
                                <div class="table-body" id="conmebolQualifiersBody">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </section>

        <section class="news-section">
            <h2 class="section-title">
                <i class="fas fa-newspaper"></i> Noticias Relevantes
            </h2>
            <div class="news-grid">
                <a href="#" class="news-card" style="background-image: url('https://www.excelsior.com.mx/media/pictures/2022/12/19/2876152.jpg');">
                    <div class="news-card-content">
                        <span class="news-card-category">Final Histórica</span>
                        <h3>A pesar de la final historica de Mbappe no se logro coronar como campeon mundial</h3>
                    </div>
                </a>

                <a href="#" class="news-card" style="background-image: url('https://assets.goal.com/images/v3/blte4e603a2f6066a26/goal---image-w-crest--97f4a9be-5555-4939-b362-024218fef256.png');">
                    <div class="news-card-content">
                        <span class="news-card-category">Análisis</span>
                        <h3>El gol de Richarlison: ¿El mejor de la historia de los mundiales?</h3>
                    </div>
                </a>

                <a href="#" class="news-card" style="background-image: url('https://record.com.do/media/uploads/2022/12/2022-12-10-morocco_1e9ioilcxg3yo1pegmu5zo4pm3-728x410.webp');">
                    <div class="news-card-content">
                        <span class="news-card-category">Revelación</span>
                        <h3>Marruecos y la hazaña africana que inspiró a un continente</h3>
                    </div>
                </a>
            </div>
        </section>

        <section class="top-scorers-section">
            <h2 class="section-title">
                <i class="fas fa-bullseye"></i> Máximos Goleadores Históricos en Mundiales
            </h2>
            <div class="table-container">
                <div class="table-header">
                    <span>#</span>
                    <span>Jugador</span>
                    <span>Goles</span>
                </div>
                <div class="table-body" id="top-scorers-table">
                    </div>
            </div>
        </section>

        <section class="golden-ball-section">
            <h2 class="section-title">
                <i class="fas fa-medal"></i> Balón de Oro del Mundial
            </h2>
            <div class="winners-grid" id="golden-ball-grid"></div>
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