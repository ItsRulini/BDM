document.addEventListener('DOMContentLoaded', function () {
    // Inicialización de Swiper para la galería de momentos
    const swiper = new Swiper('.media-swiper', {
        // Opciones del carrusel
        loop: true, // Para que sea un carrusel infinito
        grabCursor: true, // Muestra un cursor de "agarrar"

        // Botones de navegación (flechas)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});