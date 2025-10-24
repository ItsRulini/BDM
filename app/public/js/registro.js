import { loginUser } from './login.js';

document.addEventListener ('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const fotoPerfilInput = document.getElementById('fotoPerfil');
    const profilePicPreview = document.getElementById('profilePicPreview');
    const nacimientoInput = document.getElementById('nacimiento');

    cargarPaises();

    const profilePicWrapper = document.querySelector('.profile-pic-wrapper');

    profilePicWrapper?.addEventListener('click', () => {
        fotoPerfilInput.click();
    });

    fotoPerfilInput?.addEventListener('change', () => {
        const file = fotoPerfilInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // NUEVO: Validación en tiempo real para nombres (solo letras y espacios)
    const nombresInput = document.getElementById('nombres');
    const paternoInput = document.getElementById('paterno');
    const maternoInput = document.getElementById('materno');

    [nombresInput, paternoInput, maternoInput].forEach(input => {
        input?.addEventListener('input', (e) => {
            // Permitir solo letras (incluyendo acentos y ñ) y espacios
            e.target.value = e.target.value.replace(/[^a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]/g, '');
        });
    });

    // NUEVO: Crear el selector de correo
    crearSelectorCorreo();

    if (registrationForm) {
        registrationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const file = fotoPerfilInput.files[0];
            let fotoPerfilBase64 = null;
            
            if (!file) {
                alert("Por favor, selecciona una foto de perfil.");
                return;
            }

            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert("La imagen no puede superar los 5MB.");
                    return;
                }
                fotoPerfilBase64 = await toBase64(file);
            }

            // NUEVO: Validar nombres antes de enviar
            const nombres = document.getElementById('nombres').value;
            const paterno = document.getElementById('paterno').value;
            const materno = document.getElementById('materno').value;

            if (!validarNombre(nombres, 'Nombres')) return;
            if (!validarNombre(paterno, 'Apellido Paterno')) return;
            if (materno && !validarNombre(materno, 'Apellido Materno')) return;

            // NUEVO: Obtener el correo completo
            const correoCompleto = obtenerCorreoCompleto();
            if (!correoCompleto) {
                alert("Por favor, ingresa un correo válido.");
                return;
            }

            const formData = {
                nombres: nombres,
                paterno: paterno,
                materno: materno,
                nacimiento: document.getElementById('nacimiento').value,
                correo: correoCompleto,
                contrasena: document.getElementById('contrasena').value,
                genero: document.getElementById('genero').value,
                paisNacimiento: document.getElementById('pais').value,
                nacionalidad: document.getElementById('nacionalidad').value,
                fotoPerfil: fotoPerfilBase64
            }

            if (!validarContrasena(formData.contrasena)) {
                return;
            }
            
            // Validación de la edad
            const birthDate = new Date(formData.nacimiento);
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

            console.log("Datos del usuario para enviar:", { formData });
            createUser(formData);
        });
    }
    
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
});

// NUEVA FUNCIÓN: Validar que solo contenga letras
function validarNombre(nombre, campo) {
    if (!nombre || nombre.trim() === '') {
        alert(`El campo ${campo} es obligatorio.`);
        return false;
    }
    
    // Verificar que solo contenga letras, espacios y caracteres latinos
    const regex = /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/;
    if (!regex.test(nombre)) {
        alert(`El campo ${campo} solo puede contener letras.`);
        return false;
    }
    
    return true;
}

// NUEVA FUNCIÓN: Crear selector de correo con dominios
function crearSelectorCorreo() {
    const correoInput = document.getElementById('correo');
    if (!correoInput) return;

    // Crear estructura HTML para el selector
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';
    
    const inputCorreo = document.createElement('input');
    inputCorreo.type = 'text';
    inputCorreo.id = 'correoUsuario';
    inputCorreo.placeholder = 'usuario';
    inputCorreo.style.cssText = 'flex: 1;';
    inputCorreo.required = true;

    const arroba = document.createElement('span');
    arroba.textContent = '@';
    arroba.style.cssText = 'font-weight: bold; color: #00ff88;';

    const selectDominio = document.createElement('select');
    selectDominio.id = 'correoDominio';
    selectDominio.style.cssText = 'flex: 1;';
    selectDominio.innerHTML = `
        <option value="gmail.com">gmail.com</option>
        <option value="outlook.com">outlook.com</option>
        <option value="hotmail.com">hotmail.com</option>
    `;

    wrapper.appendChild(inputCorreo);
    wrapper.appendChild(arroba);
    wrapper.appendChild(selectDominio);

    // Reemplazar el input original con el nuevo selector
    correoInput.parentNode.replaceChild(wrapper, correoInput);

    // Validación en tiempo real del correo
    inputCorreo.addEventListener('input', (e) => {
        let valor = e.target.value;
        
        // No permitir que inicie con punto
        if (valor.startsWith('.')) {
            valor = valor.substring(1);
        }
        
        // No permitir puntos consecutivos
        valor = valor.replace(/\.{2,}/g, '.');
        
        // Solo permitir letras, números, puntos, guiones bajos y guiones
        valor = valor.replace(/[^a-zA-Z0-9._-]/g, '');
        
        e.target.value = valor;
    });

    // Validación al perder el foco
    inputCorreo.addEventListener('blur', (e) => {
        const valor = e.target.value;
        
        if (valor && !validarParteLocalCorreo(valor)) {
            alert('El correo debe:\n• Iniciar con letra o número\n• No contener puntos consecutivos\n• No iniciar con punto');
            e.target.focus();
        }
    });
}

// NUEVA FUNCIÓN: Validar la parte local del correo (antes del @)
function validarParteLocalCorreo(parteLocal) {
    if (!parteLocal || parteLocal.trim() === '') {
        return false;
    }
    
    // Debe iniciar con letra o número
    if (!/^[a-zA-Z0-9]/.test(parteLocal)) {
        return false;
    }
    
    // No debe tener puntos consecutivos
    if (/\.{2,}/.test(parteLocal)) {
        return false;
    }
    
    // Solo puede contener letras, números, puntos, guiones y guiones bajos
    if (!/^[a-zA-Z0-9._-]+$/.test(parteLocal)) {
        return false;
    }
    
    return true;
}

// NUEVA FUNCIÓN: Obtener el correo completo
function obtenerCorreoCompleto() {
    const parteLocal = document.getElementById('correoUsuario')?.value;
    const dominio = document.getElementById('correoDominio')?.value;
    
    if (!parteLocal || !dominio) {
        return null;
    }
    
    if (!validarParteLocalCorreo(parteLocal)) {
        return null;
    }
    
    return `${parteLocal}@${dominio}`;
}

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
            registrationForm.reset();
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
            
            selectPaisNacimiento.innerHTML = '<option value="">Seleccione...</option>';
            selectNacionalidad.innerHTML = '<option value="">Seleccione...</option>';

            data.data.forEach (pais =>{
                const optionPais = document.createElement('option');
                optionPais.value = pais.id;
                optionPais.textContent = pais.nombre;
                selectPaisNacimiento.appendChild(optionPais);

                const optionNacionalidad = document.createElement('option');
                optionNacionalidad.value = pais.id;
                optionNacionalidad.textContent = pais.nacionalidad;
                selectNacionalidad.appendChild(optionNacionalidad);
            });

        } else {
            console.error("Error desde el API:", data.message);
        }

    })
    .catch(error => {
        console.error("Error al cargar los países: ", error);
    })
}

function validarContrasena(contrasena) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!regex.test(contrasena)) {
        alert("La contraseña no es segura. Debe tener:\n\n- Mínimo 8 caracteres\n- Al menos una letra mayúscula (A-Z)\n- Al menos una letra minúscula (a-z)\n- Al menos un número (0-9)\n- Al menos un caracter especial (ej. @$!%*?&)");
        return false;
    }
    return true;
}