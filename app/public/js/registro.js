import { loginUser } from './login.js';

document.addEventListener ('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    cargarPaises();

    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que el formulario se envíe por defecto

            const formData = {
                nombres: document.getElementById('nombres').value,
                paterno: document.getElementById('paterno').value,
                materno: document.getElementById('materno').value,
                nacimiento: document.getElementById('nacimiento').value,
                correo: document.getElementById('correo').value,
                contrasena: document.getElementById('contrasena').value,
                genero: document.getElementById('genero').value,
                paisNacimiento: document.getElementById('pais').value,
                nacionalidad: document.getElementById('nacionalidad').value,
            }
            // Validación de la edad
            const birthDate = new Date(nacimiento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
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
            console.log("Datos del usuario para enviar:", { formData });
            alert("¡Formulario validado! Ahora se enviaría al servidor.");
            // Llamando a la función para crear el usuario
            createUser(formData);
            
        });
    }
});

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('contrasena');
    const toggleIcon = document.getElementById('togglePassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function validatePasswordStrength() {}

async function createUser (userData) {
    fetch('index.php?controller=api&action=registrarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registro exitoso. Bienvenido, " + userData.correo + "!");
            // Redirigir o limpiar el formulario si es necesario
            registrationForm.reset();

            // Iniciar sesión automáticamente después del registro
            loginUser(userData.correo, userData.contrasena);
        } else {
            alert("Error en el registro: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error al enviar el formulario:", error);
        alert("Ocurrió un error al procesar tu registro. Por favor, inténtalo de nuevo más tarde.");
    });
}

async function cargarPaises () {
    fetch('index.php?controller=api&action=getPaises' , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const selectPaisNacimiento = document.getElementById('pais');
            const selectNacionalidad = document.getElementById('nacionalidad');
            
            // Limpiamos ambos selects y dejamos la opción por defecto
            selectPaisNacimiento.innerHTML = '<option value="">Seleccione...</option>';
            selectNacionalidad.innerHTML = '<option value="">Seleccione...</option>';

            data.data.forEach (pais =>{
                // Opción para país de nacimiento
                const optionPais = document.createElement('option');
                optionPais.value = pais.id;
                optionPais.textContent = pais.nombre;
                selectPaisNacimiento.appendChild(optionPais);

                // Opción para nacionalidad
                const optionNacionalidad = document.createElement('option');
                optionNacionalidad.value = pais.id;
                optionNacionalidad.textContent = pais.nacionalidad;
                selectNacionalidad.appendChild(optionNacionalidad);
            });

        } else {
            // Si el backend devuelve success: false, mostramos el mensaje de error
            console.error("Error desde el API:", data.message);
        }

    })
    .catch(error => {
        console.error("Error al cargar los países: ", error);
    })
}