// Variable para almacenar el ID de la categoría en edición
let editingCategoryId = null;

async function loadAdminWorldCups() {
    try {
        const response = await fetch('index.php?controller=api&action=getMundiales', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es JSON válido
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Respuesta no es JSON:", text);
            throw new Error("El servidor no devolvió JSON válido");
        }

        const data = await response.json();

        if (data.success) {
            if (data.data && data.data.length > 0) {
                displayAdminWorldCups(data.data);
                console.log('✅ Mundiales cargados:', data.data.length);
            } else {
                displayNoWorldCupsMessage();
                console.log('ℹ️ No hay mundiales registrados');
            }
        } else {
            console.error('❌ Error desde API:', data.message);
            displayNoWorldCupsMessage();
        }

    } catch (error) {
        console.error("❌ Error al obtener los mundiales:", error);
        displayNoWorldCupsMessage();
        
        // Mostrar notificación al usuario
        alert('Error al cargar los mundiales. Por favor recarga la página.');
    }
}

async function displayAdminWorldCups(worldCups) {
    const container = document.getElementById('worldCupsGrid');
    if (!container) return;

    container.innerHTML = worldCups.map(worldCup => createAdminWorldCupCard(worldCup)).join('');
}

function displayNoWorldCupsMessage() {
    const container = document.getElementById('worldCupsGrid');
    if (!container) return;

    container.innerHTML = `
        <div class="no-worldcups">
            <p>No hay mundiales registrados todavía</p>
        </div>
    `;
}

// ==========================================
// FUNCIONES DE MUNDIALES
// ==========================================

function createAdminWorldCupCard(worldCup) {
    return `
        <div class="world-cup-card">
            <img src="${worldCup.image}" alt="Copa del Mundo ${worldCup.year}">
            <div class="world-cup-info">
                <h3>${worldCup.name}</h3>
                <p>${worldCup.description}</p>
            </div>
            <div class="admin-overlay">
                <button class="admin-btn" onclick="editMundial(${worldCup.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        </div>
    `;
}

function goToCreateMundial() {
    window.location.href = 'index.php?controller=admin&action=crearMundial';
}

function editMundial(id) {
    window.location.href = `index.php?controller=admin&action=editarMundial&id=${id}`;
}

async function uploadStatistics() {
    const mundiales = document.getElementById('totalMundiales');
    const posts = document.getElementById('totalPosts');
    const users = document.getElementById('totalUsers');

    fetch('index.php?controller=api&action=getEstadisticasAdmin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            const statistics = data.data;

            mundiales.textContent = statistics.mundiales;
            posts.textContent = statistics.posts;   
            users.textContent = statistics.usuarios;
        } else {
            console.error("Error desde el API:", data.message);
        }

    })
    .catch(error => {
        console.error("Error al cargar estadisticas", error);
    })
}

// ==========================================
// FUNCIONES DE GESTIÓN DE CATEGORÍAS
// ==========================================

async function openCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        await loadCategories();
        await renderCategories();
    }
}

function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        const form = document.getElementById('categoryForm');
        if (form) {
            form.classList.remove('active');
        }
        
        const input = document.getElementById('categoryName');
        if (input) {
            input.value = '';
        }

        editingCategoryId = null;

        const saveButton = document.querySelector('#categoryForm .btn-primary');
        if (saveButton) {
            saveButton.textContent = 'Guardar Categoría';
        }

        const formTitle = document.querySelector('#categoryForm .form-title');
        if (formTitle) {
            formTitle.textContent = 'Nueva Categoría';
        }
    }
}

function showCategoryForm() {
    editingCategoryId = null;

    const form = document.getElementById('categoryForm');
    if (form) {
        form.classList.add('active');
        
        const saveButton = document.querySelector('#categoryForm .btn-primary');
        if (saveButton) {
            saveButton.textContent = 'Guardar Categoría';
        }

        const formTitle = document.querySelector('#categoryForm .form-title');
        if (formTitle) {
            formTitle.textContent = 'Nueva Categoría';
        }
        
        setTimeout(() => {
            const input = document.getElementById('categoryName');
            if (input) {
                input.value = '';
                input.focus();
            }
        }, 300);
    }
}

function cancelCategoryForm() {
    const form = document.getElementById('categoryForm');
    const input = document.getElementById('categoryName');
    
    if (form) {
        form.classList.remove('active');
    }
    if (input) {
        input.value = '';
    }

    editingCategoryId = null;

    const saveButton = document.querySelector('#categoryForm .btn-primary');
    if (saveButton) {
        saveButton.textContent = 'Guardar Categoría';
    }

    const formTitle = document.querySelector('#categoryForm .form-title');
    if (formTitle) {
        formTitle.textContent = 'Nueva Categoría';
    }
}

function updateCategory(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
        console.error('Categoría no encontrada');
        return;
    }

    editingCategoryId = categoryId;

    const form = document.getElementById('categoryForm');
    if (form) {
        form.classList.add('active');
    }

    const input = document.getElementById('categoryName');
    if (input) {
        input.value = category.nombre;
        input.focus();
        input.select();
    }

    const saveButton = document.querySelector('#categoryForm .btn-primary');
    if (saveButton) {
        saveButton.textContent = 'Actualizar Categoría';
    }

    const formTitle = document.querySelector('#categoryForm .form-title');
    if (formTitle) {
        formTitle.textContent = 'Editar Categoría';
    }
}

function saveCategory() {
    const categoryNameInput = document.getElementById('categoryName');
    if (!categoryNameInput) return;
    
    const categoryName = categoryNameInput.value.trim();
    
    if (!categoryName) {
        alert('Por favor, ingresa un nombre para la categoría.');
        categoryNameInput.focus();
        return;
    }

    if (categoryName.length < 2) {
        alert('El nombre de la categoría debe tener al menos 2 caracteres.');
        categoryNameInput.focus();
        return;
    }

    if (editingCategoryId !== null) {
        const exists = categories.some(cat => 
            cat.nombre.toLowerCase() === categoryName.toLowerCase() && 
            cat.id !== editingCategoryId
        );

        if (exists) {
            alert('Ya existe una categoría con ese nombre.');
            categoryNameInput.focus();
            return;
        }

        const categoryIndex = categories.findIndex(cat => cat.id === editingCategoryId);
        if (categoryIndex !== -1) {
            categories[categoryIndex].nombre = categoryName;
            
            console.log('Categoría actualizada:', categories[categoryIndex]);

            fetch('index.php?controller=api&action=updateCategoria', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingCategoryId,
                    name: categoryName
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.success) {
                    console.log('Categoría actualizada en BD:', data);
                    await renderCategories();
                    await cancelCategoryForm();
                } else {
                    alert('Error al actualizar la categoría: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            });
        }
    } else {
        const exists = categories.some(cat => 
            cat.nombre.toLowerCase() === categoryName.toLowerCase()
        );

        if (exists) {
            alert('Ya existe una categoría con ese nombre.');
            categoryNameInput.focus();
            return;
        }

        const newCategory = {
            name: categoryName
        };

        categories.push(newCategory);
        
        console.log('Categoría creada:', newCategory);
        
        fetch('index.php?controller=api&action=crearCategoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: categoryName
            })
        })
        .then(response => response.json())
        .then(async data => {
            if (data.success) {
                newCategory.id = data.categoryId;
                console.log('Categoría guardada en BD:', data);
                await loadCategories();
                await renderCategories();
                await cancelCategoryForm();
            } else {
                categories = categories.filter(cat => cat.id !== newCategory.id);
                alert('Error al guardar la categoría: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            categories = categories.filter(cat => cat.id !== newCategory.id);
            alert('Error al conectar con el servidor');
        });
    }
}

let categories = [];

async function loadCategories() {
    try {
        const response = await fetch('index.php?controller=api&action=getCategorias', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
            categories = data.data;
        } else {
            categories = [];
            console.error('No se pudieron cargar las categorías:', data.message);
        }
    } catch (error) {
        categories = [];
        console.error('Error al cargar las categorías:', error);
    }
}

async function renderCategories() {

    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    const categoriesHTML = categories.map(category => `
        <div class="category-card">
            <button class="update-category" onclick="updateCategory(${category.id})" title="Editar categoría">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <div class="category-name">${escapeHtml(category.nombre)}</div>
            <div class="category-count">${category.num_posts} posts</div>
        </div>
    `).join('');

    const addButtonHTML = `
        <div class="add-category-card" onclick="showCategoryForm()" title="Crear nueva categoría">
            <div class="add-category-icon">
                <i class="fas fa-plus-circle"></i>
            </div>
            <div class="add-category-text">Nueva Categoría</div>
        </div>
    `;

    grid.innerHTML = categoriesHTML + addButtonHTML;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// EVENT LISTENERS Y INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    uploadStatistics();
    loadAdminWorldCups();
    setupModalEventListeners();
});

function setupModalEventListeners() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCategoryModal();
            }
        });
    }

    const categoryInput = document.getElementById('categoryName');
    if (categoryInput) {
        categoryInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveCategory();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('categoryModal');
            if (modal && modal.classList.contains('active')) {
                closeCategoryModal();
            }
        }
    });

    const playerModal = document.getElementById('playerModal');
    const countryModal = document.getElementById('countryModal');
    
    if (playerModal) {
        playerModal.addEventListener('click', function(e) {
            if (e.target === this) closePlayerModal();
        });
    }
    
    if (countryModal) {
        countryModal.addEventListener('click', function(e) {
            if (e.target === this) closeCountryModal();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (playerModal && playerModal.classList.contains('active')) {
                closePlayerModal();
            }
            if (countryModal && countryModal.classList.contains('active')) {
                closeCountryModal();
            }
        }
    });
}

// ==========================================
// FUNCIONES UTILITARIAS
// ==========================================

function showNotification(message, type = 'success') {
    console.log(`${type.toUpperCase()}: ${message}`);
}

function validateCategoryName(name) {
    const errors = [];
    
    if (!name || name.trim().length === 0) {
        errors.push('El nombre es obligatorio');
    }
    
    if (name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (name.trim().length > 50) {
        errors.push('El nombre no puede exceder 50 caracteres');
    }
    
    if (/<|>|&/.test(name)) {
        errors.push('El nombre contiene caracteres no permitidos');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function refreshCategoriesFromServer() {
    // TODO: Implementar cuando se conecte con el backend
}

// ==========================================
// FUNCIONES DE GESTIÓN DE JUGADORES
// ==========================================

let countries = [];

async function loadCountries () {
    try {
        const response = await fetch('index.php?controller=api&action=getPaises', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.success) {
            countries = data.data.map(pais => ({
                id: pais.id,
                name: pais.nombre,
                nationality: pais.nacionalidad
            }));
        } else {
            console.error("Error desde el API:", data.message);
        }

    } catch (error) {
        console.error("Error al cargar los países:", error);
    }
}


async function openPlayerModal() {
    const modal = document.getElementById('playerModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        await loadCountries();
        loadNationalities();
    }
}

function closePlayerModal() {
    const modal = document.getElementById('playerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetPlayerForm();
    }
}

function loadNationalities() {
    const select = document.getElementById('playerNationality');
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona una nacionalidad...</option>';

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.id;
        option.textContent = `${country.name} (${country.nationality})`;
        select.appendChild(option);
    });
}

function previewPlayerPhoto(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('playerPhotoPreview');
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Vista previa">`;
        preview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

async function savePlayer(event) {
    event.preventDefault();

    const name = document.getElementById('playerName').value.trim();
    const nationality = document.getElementById('playerNationality').value;
    const birthdate = document.getElementById('playerBirthdate').value;
    const photoInput = document.getElementById('playerPhoto');

    // ... (tus validaciones de que los campos no estén vacíos van aquí) ...

    const playerData = {
        nombre: name,
        nacionalidad: nationality,
        fechaNacimiento: birthdate,
        foto: null
    };

    // Si el usuario seleccionó una foto, la leemos y la convertimos a Base64
    if (photoInput.files[0]) {
        try {
            // Creamos una Promesa para esperar a que el archivo se lea
            playerData.foto = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result); // reader.result es la cadena Base64
                reader.onerror = error => reject(error);
                reader.readAsDataURL(photoInput.files[0]);
            });
        } catch (error) {
            console.error("Error al leer la imagen:", error);
            alert("No se pudo procesar la imagen seleccionada.");
            return;
        }
    }

    // Ahora enviamos todo como un solo objeto JSON
    fetch('index.php?controller=api&action=crearJugador', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData) // Convertimos el objeto a texto JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            closePlayerModal();
        } else {
            alert('Error al registrar jugador: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error en la conexión con la API:', error);
        alert('Hubo un problema de conexión. Inténtalo de nuevo.');
    });
}

function resetPlayerForm() {
    const form = document.getElementById('playerForm');
    if (form) {
        form.reset();
    }

    const preview = document.getElementById('playerPhotoPreview');
    if (preview) {
        preview.innerHTML = `
            <i class="fas fa-camera"></i>
            <p>Haz clic para seleccionar foto</p>
            <span>JPG, PNG o WEBP (máx. 5MB)</span>
        `;
        preview.classList.remove('has-image');
    }
}

// ==========================================
// FUNCIONES DE GESTIÓN DE PAÍSES
// ==========================================

function openCountryModal() {
    const modal = document.getElementById('countryModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCountryModal() {
    const modal = document.getElementById('countryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetCountryForm();
    }
}

function saveCountry(event) {
    event.preventDefault();
    
    const countryName = document.getElementById('countryName').value.trim();
    const nationality = document.getElementById('countryNationality').value.trim();

    if (!countryName) {
        alert('Por favor, ingresa el nombre del país');
        return;
    }

    if (!nationality) {
        alert('Por favor, ingresa la nacionalidad');
        return;
    }

    if (countryName.length < 2) {
        alert('El nombre del país debe tener al menos 2 caracteres');
        return;
    }

    if (nationality.length < 2) {
        alert('La nacionalidad debe tener al menos 2 caracteres');
        return;
    }

    const exists = countries.some(country => 
        country.name.toLowerCase() === countryName.toLowerCase()
    );

    if (exists) {
        alert('Este país ya está registrado');
        return;
    }

    const newCountry = {
        id: Date.now(),
        name: countryName,
        nationality: nationality
    };

    countries.push(newCountry);
    
    console.log('País registrado:', newCountry);

    fetch('index.php?controller=api&action=crearPais', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: countryName,
            nationality: nationality
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            newCountry.id = data.countryId;
            alert('País registrado exitosamente');
            console.log(data.message);
            closeCountryModal();
            loadNationalities();
        } else {
            alert('Error al registrar país: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    });
}

function resetCountryForm() {
    const form = document.getElementById('countryForm');
    if (form) {
        form.reset();
    }
}