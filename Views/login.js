document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita el envío por defecto

            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;

            // Validación simple
            if (correo === "" || contrasena === "") {
                alert("Por favor, ingresa tu correo y contraseña.");
                return;
            }

            console.log("Datos de login para enviar:", { correo, contrasena });
            alert("¡Login validado! Ahora se enviaría al servidor.");
            // En un proyecto real, aquí usarías `fetch()` para verificar las credenciales con `procesar_login.php`
        });
    }
});