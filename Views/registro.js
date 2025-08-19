document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que el formulario se envíe por defecto

            const nombres = document.getElementById('nombres').value;
            const paterno = document.getElementById('paterno').value;
            const materno = document.getElementById('materno').value;
            const nacimiento = document.getElementById('nacimiento').value;
            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;

            // Validación de la edad
            const birthDate = new Date(nacimiento);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 12) {
                alert("Debes ser mayor de 12 años para registrarte.");
                return;
            }

            // Aquí enviarías los datos al backend (PHP)
            // Por ahora, solo mostraremos un mensaje de éxito
            console.log("Datos del usuario para enviar:", { nombres, paterno, materno, nacimiento, correo, contrasena });
            alert("¡Formulario validado! Ahora se enviaría al servidor.");
            // En un proyecto real, aquí usarías `fetch()` o `XMLHttpRequest` para comunicarte con `procesar_registro.php`
            fetch('procesar_registro.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombres,
                    paterno,
                    materno,
                    nacimiento,
                    correo,
                    contrasena
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Registro exitoso. Bienvenido, " + nombres + "!");
                    // Redirigir o limpiar el formulario si es necesario
                    registrationForm.reset();
                } else {
                    alert("Error en el registro: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error al enviar el formulario:", error);
                alert("Ocurrió un error al procesar tu registro. Por favor, inténtalo de nuevo más tarde.");
            });
        });
    }
});