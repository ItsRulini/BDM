export async function loginUser(correo, contrasena) { // Función para iniciar sesión
    fetch('index.php?controller=api&action=login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            correo,
            contrasena
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Inicio de sesión exitoso. ¡Bienvenido " + data.data.correo + "!");
            // Aquí puedes redirigir al usuario a otra página o actualizar la interfaz

            console.log("Datos del usuario:", data.data);
            if (data.data.role === 'Administrador') 
                window.location.href = 'index.php?controller=admin&action=index'; // Redirigir a la página de administrador
            else 
                window.location.href = 'index.php?controller=home&action=index'; // Redirigir a la página de usuario

        } else {
            alert("Error en el inicio de sesión: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error al iniciar sesión:", error);
        alert("Ocurrió un error al procesar tu inicio de sesión. Por favor, inténtalo de nuevo más tarde.");
    });
}

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

            loginUser(correo, contrasena);

        });
    }
});