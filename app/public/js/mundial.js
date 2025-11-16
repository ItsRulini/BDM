let CAMPEON = null;
let SUBCAMPEON = null;

document.addEventListener('DOMContentLoaded', function () {
    // Inicialización de Swiper para la galería de momentos
    const swiper = new Swiper('.media-swiper', {
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 800,
    });

    // Cargar datos del mundial desde la API
    cargarDatosMundial();
});

// Función para cargar los datos del mundial
async function cargarDatosMundial() {
    // Obtener el ID del mundial desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const mundialId = urlParams.get('id');

    if (!mundialId) {
        console.error('No se proporcionó ID del mundial');
        return;
    }

    try {
        const response = await fetch(`index.php?controller=api&action=getInfoMundial&id=${mundialId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            renderizarMundial(data.data);
        } else {
            console.error('Error al cargar el mundial:', data.message);
            mostrarError('No se pudo cargar la información del mundial');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarError('Error de conexión al cargar el mundial');
    }
}

// Función para renderizar todos los datos del mundial
async function renderizarMundial(mundial) {
    // Si el nombre contiene comas, reemplazar la última coma por " y " (manteniendo el resto igual)
    const rawName = (typeof mundial.nombre === 'string') ? mundial.nombre.trim() : '';
    if (rawName.includes(',')) {
        const parts = rawName.split(',').map(s => s.trim()).filter(Boolean);
        if (parts.length > 1) {
            mundial.nombre = parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1];
        } else {
            mundial.nombre = rawName;
        }
    } else {
        mundial.nombre = rawName;
    }

    // Título
    document.getElementById('mundial-name').textContent = mundial.nombre || 'Mundial';

    // Descripción
    renderizarDescripcion(mundial.descripcion);

    // Galería
    if (mundial.multimedia && mundial.multimedia.length > 0) {
        renderizarGaleria(mundial.multimedia);
    }

    // Mascota
    if (mundial.mascota) {
        renderizarMascota(mundial.mascota);
    }

    // Posiciones
    if (mundial.posiciones) {
        await renderizarPosiciones(mundial.id);
    }

    // Resultado de la final
    if (mundial.resultado) {
        await renderizarResultadoFinal(mundial.resultado);
    }

    // Premios individuales
    if (mundial.premios) {
        await renderizarPremios(mundial.id);
    }
}

// Renderizar descripción
function renderizarDescripcion(descripcion) {
    const container = document.querySelector('.description-card .card-body');
    if (container && descripcion) {
        // Dividir en párrafos si viene con saltos de línea
        const parrafos = descripcion.split('\n\n');
        container.innerHTML = parrafos.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    }
}

// Renderizar galería con soporte para imágenes y videos
function renderizarGaleria(multimedia) {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (!swiperWrapper) return;

    swiperWrapper.innerHTML = multimedia.map((media, index) => {
        // Detectar si es imagen o video por el tipo MIME
        const isImage = media.type && media.type.startsWith('image');
        const isVideo = media.type && media.type.startsWith('video');

        if (isVideo) {
            // Renderizar video
            return `
                <div class="swiper-slide">
                    <video 
                        class="swiper-video" 
                        controls 
                        playsinline
                        preload="metadata"
                        poster=""
                    >
                        <source src="${media.url}" type="${media.type}">
                        Tu navegador no soporta el elemento de video.
                    </video>
                </div>
            `;
        } else {
            // Renderizar imagen (por defecto si no es video)
            return `
                <div class="swiper-slide">
                    <img src="${media.url}" alt="Momento ${index + 1}">
                </div>
            `;
        }
    }).join('');

    // Reinicializar Swiper con configuración mejorada para videos
    if (window.swiperInstance) {
        window.swiperInstance.destroy();
    }
    
    window.swiperInstance = new Swiper('.media-swiper', {
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 800,
        // Eventos para manejar videos
        on: {
            slideChange: function() {
                // Pausar todos los videos cuando se cambia de slide
                const videos = document.querySelectorAll('.swiper-video');
                videos.forEach(video => {
                    video.pause();
                    video.currentTime = 0;
                });
            },
            slideChangeTransitionEnd: function() {
                // Opcional: Auto-reproducir video en el slide actual
                const activeSlide = this.slides[this.activeIndex];
                const video = activeSlide?.querySelector('.swiper-video');
                if (video) {
                    // Detener autoplay cuando hay video
                    this.autoplay.stop();
                    
                    // Opcional: Auto-play del video
                    video.play().catch(err => console.log('Autoplay bloqueado:', err));
                }
            }
        }
    });
}

// Renderizar mascota
function renderizarMascota(mascota) {
    const container = document.querySelector('.mascot-container');
    if (!container) return;

    container.innerHTML = `
        <div class="mascot-image">
            <img src="${mascota.imagen}" alt="${escapeHtml(mascota.nombre)}">
        </div>
        <div class="mascot-info">
            <h3>${escapeHtml(mascota.nombre)}</h3>
            <p>${escapeHtml(mascota.descripcion || 'Mascota oficial del mundial')}</p>
        </div>
    `;
}

// Renderizar posiciones
async function renderizarPosiciones(mundialId) {

    try {
        const response = await fetch(`index.php?controller=api&action=getPosicionesMundial&id=${mundialId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (data.success) {
            posiciones = data.data;
        } else {
            console.error('Error al cargar las posiciones:', data.message);
            mostrarError('No se pudo cargar la información de posiciones del mundial');
            return;
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarError('Error de conexión al cargar el mundial');
        return;
    }
    
    const container = document.querySelector('.positions-grid');
    if (!container) return;

    const medals = {
        campeon: { icon: 'fa-trophy', label: 'Campeón', class: 'champion' },
        subcampeon: { icon: 'fa-medal', label: 'Subcampeón', class: 'runner-up' },
        tercer_puesto: { icon: 'fa-medal', label: 'Tercer Puesto', class: 'third-place' },
        cuarto_puesto: { icon: 'fa-award', label: 'Cuarto Puesto', class: 'fourth-place' }
    };

    CAMPEON = posiciones.campeon;
    SUBCAMPEON = posiciones.subcampeon;

    container.innerHTML = Object.keys(medals).map(key => {
        const pais = posiciones[key];
        const medal = medals[key];
        
        if (!pais) return '';

        return `
            <div class="position-item ${medal.class}">
                <div class="position-medal">
                    <i class="fas ${medal.icon}"></i>
                </div>
                <div class="position-info">
                    <span class="position-label">${medal.label}</span>
                    <h3>${escapeHtml(pais)}</h3>
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar resultado de la final
async function renderizarResultadoFinal(resultado) {
    const container = document.querySelector('.final-result');
    if (!container) return;

    container.innerHTML = `
        <div class="final-teams">
            <div class="team-info">
                <h3>${CAMPEON}</h3>
            </div>
            <div class="score-container">
                <div class="score-box">
                    <span class="score">${resultado.goles1}</span>
                    <span class="score-separator">-</span>
                    <span class="score">${resultado.goles2}</span>
                </div>
                <span class="score-label">Tiempo Reglamentario</span>
            </div>
            <div class="team-info">
                <h3>${SUBCAMPEON}</h3>
            </div>
        </div>

        <div class="final-details">
            ${resultado.tiempoExtra ? `
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Tiempo Extra: ${resultado.marcadorTiempoExtra}</span>
                </div>
            ` : ''}
            
            ${resultado.penalties ? `
                <div class="detail-item highlight">
                    <i class="fas fa-circle-dot"></i>
                    <span>Definido por Penales</span>
                </div>
            ` : ''}
            
            ${resultado.muerteSubita ? `
                <div class="detail-item">
                    <i class="fas fa-skull"></i>
                    <span>Muerte Súbita</span>
                </div>
            ` : ''}
            
            <div class="detail-item final-score">
                <i class="fas fa-trophy"></i>
                <span class="winner">${escapeHtml(resultado.marcadorFinal)}</span>
            </div>
        </div>
    `;
}

// Renderizar premios
async function renderizarPremios(mundialId) {

    try {
        const response = await fetch(`index.php?controller=api&action=getPremiosMundial&id=${mundialId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (data.success) {
            premios = data.data;

            // Adaptar estructura al formato requerido por el renderizador
            premios = {
                balones: {
                    oro: premios.balon_oro ? {
                        nombre: premios.balon_oro,
                        foto: premios.balon_oro_foto ? `data:image/jpeg;base64,${premios.balon_oro_foto}` : null
                    } : null,
                    plata: premios.balon_plata ? {
                        nombre: premios.balon_plata,
                        foto: premios.balon_plata_foto ? `data:image/jpeg;base64,${premios.balon_plata_foto}` : null
                    } : null,
                    bronce: premios.balon_bronce ? {
                        nombre: premios.balon_bronce,
                        foto: premios.balon_bronce_foto ? `data:image/jpeg;base64,${premios.balon_bronce_foto}` : null
                    } : null
                },
                botines: {
                    oro: premios.bota_oro ? {
                        nombre: premios.bota_oro,
                        foto: premios.bota_oro_foto ? `data:image/jpeg;base64,${premios.bota_oro_foto}` : null,
                        info: `${premios.max_goles || ''} goles`
                    } : null,
                    plata: premios.bota_plata ? {
                        nombre: premios.bota_plata,
                        foto: premios.bota_plata_foto ? `data:image/jpeg;base64,${premios.bota_plata_foto}` : null
                    } : null,
                    bronce: premios.bota_bronce ? {
                        nombre: premios.bota_bronce,
                        foto: premios.bota_bronce_foto ? `data:image/jpeg;base64,${premios.bota_bronce_foto}` : null
                    } : null
                },
                guanteOro: premios.guante_oro ? {
                    nombre: premios.guante_oro,
                    foto: premios.guante_oro_foto ? `data:image/jpeg;base64,${premios.guante_oro_foto}` : null
                } : null
            };

        } else {
            console.error('Error al cargar los premios:', data.message);
            mostrarError('No se pudo cargar la información de premios del mundial');
            return;
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarError('Error de conexión al cargar los premios del mundial');
        return;
    }

    
    const container = document.querySelector('.awards-grid-container');
    if (!container) return;

    const html = [];

    // Balones (Mejor Jugador)
    if (premios.balones && (premios.balones.oro || premios.balones.plata || premios.balones.bronce)) {
        html.push(renderizarCategoriaPremio(
            'Mejor Jugador',
            'fa-futbol',
            [
                { ...premios.balones.oro, award: 'Balón de Oro', class: 'gold' },
                { ...premios.balones.plata, award: 'Balón de Plata', class: 'silver' },
                { ...premios.balones.bronce, award: 'Balón de Bronce', class: 'bronze' }
            ]
        ));
    }

    // Botines (Máximo Goleador)
    if (premios.botines && (premios.botines.oro || premios.botines.plata || premios.botines.bronce)) {
        html.push(renderizarCategoriaPremio(
            'Máximo Goleador',
            'fa-shoe-prints',
            [
                { ...premios.botines.oro, award: 'Botín de Oro', class: 'gold' },
                { ...premios.botines.plata, award: 'Botín de Plata', class: 'silver' },
                { ...premios.botines.bronce, award: 'Botín de Bronce', class: 'bronze' }
            ]
        ));
    }

    // Guante de Oro (Mejor Portero)
    if (premios.guanteOro) {
        html.push(`
            <div class="award-category single">
                <h3><i class="fas fa-hands"></i> Mejor Portero</h3>
                <div class="players-row single-award">
                    ${renderizarJugadorPremio({ 
                        ...premios.guanteOro, 
                        award: 'Guante de Oro', 
                        class: 'gold large' 
                    })}
                </div>
            </div>
        `);
    }

    container.innerHTML = html.join('');
}

// Renderizar categoría de premio
function renderizarCategoriaPremio(titulo, icono, jugadores) {
    const jugadoresHTML = jugadores
        .filter(j => j && j.nombre)
        .map(j => renderizarJugadorPremio(j))
        .join('');

    return `
        <div class="award-category">
            <h3><i class="fas ${icono}"></i> ${titulo}</h3>
            <div class="players-row">
                ${jugadoresHTML}
            </div>
        </div>
    `;
}

// Renderizar jugador con premio
function renderizarJugadorPremio(jugador) {
    if (!jugador || !jugador.nombre) return '';

        return `
            <div class="player-award ${jugador.class}">
                <div class="player-photo">
                    <img src="${jugador.foto || 'assets/default-player.png'}" alt="${escapeHtml(jugador.nombre)}">
                </div>
                <div class="player-info">
                    <span class="award-name">${escapeHtml(jugador.award)}</span>
                    <h4>${escapeHtml(jugador.nombre)}</h4> 
                    <p>${escapeHtml(jugador.info || '')}</p>
                </div>
            </div>
        `;
}

// Función para mostrar error
function mostrarError(mensaje) {
    const mainContent = document.querySelector('.mundial-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="mundial-card" style="text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff4444; margin-bottom: 1rem;"></i>
                <h3 style="color: #fff; margin-bottom: 1rem;">${escapeHtml(mensaje)}</h3>
                <a href="index.php?controller=home&action=index" class="btn-ver-posts">
                    Volver al Inicio
                </a>
            </div>
        `;
    }
}

// Función auxiliar para escapar HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}