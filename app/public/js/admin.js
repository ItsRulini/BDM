// Datos de ejemplo para los mundiales (esto vendrá de la base de datos)
const adminWorldCups = [
    { id: 1, year: 2022, name: "Qatar 2022", image: "https://cdn-3.expansion.mx/dims4/default/68cb107/2147483647/strip/true/crop/1371x876+0+0/resize/1800x1150!/format/webp/quality/80/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F6f%2Fc4%2F8766f2ff44a9b37bcd371593de2f%2Fqatar-2022.JPG", description: "El primer mundial en el Medio Oriente, lleno de sorpresas y con la épica final entre Argentina y Francia." },
    { id: 2, year: 2018, name: "Rusia 2018", image: "https://i.pinimg.com/736x/51/96/44/519644869b0fe4d59baa467249594234.jpg", description: "La sorprendente victoria de Francia y la memorable actuación de Croacia." },
    { id: 3, year: 2014, name: "Brasil 2014", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq06obpmRyvsfrJT8CZCMvgdKK4fON5LNe8A&s", description: "El mundial en la cuna del fútbol, recordado por el 7-1 de Alemania a Brasil." }
];

// Datos de ejemplo para las categorías (esto vendrá de la base de datos)
let categories = [
    { id: 1, name: 'Noticias', postCount: 15 },
    { id: 2, name: 'Análisis', postCount: 8 },
    { id: 3, name: 'Historias', postCount: 23 },
    { id: 4, name: 'Estadísticas', postCount: 12 }
];

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

function displayAdminWorldCups(worldCups) {
    const container = document.getElementById('worldCupsGrid');
    if (container) {
        container.innerHTML = worldCups.map(worldCup => createAdminWorldCupCard(worldCup)).join('');
    }
}

function goToCreateMundial() {
    window.location.href = 'index.php?controller=admin&action=crearMundial';
}

function editMundial(id) {
    // Redirigir a la acción editMundial del controlador admin con el ID
    window.location.href = `index.php?controller=admin&action=editarMundial&id=${id}`;
}

function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Lógica para cerrar sesión
        window.location.href = 'index.php?controller=home&action=login';
    }
}

// ==========================================
// FUNCIONES DE GESTIÓN DE CATEGORÍAS
// ==========================================

// Función para abrir el modal de categorías
function openCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCategories(); // Actualizar la vista de categorías
    }
}

// Función para cerrar el modal de categorías
function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Ocultar formulario si está activo
        const form = document.getElementById('categoryForm');
        if (form) {
            form.classList.remove('active');
        }
        
        // Limpiar el campo
        const input = document.getElementById('categoryName');
        if (input) {
            input.value = '';
        }
    }
}

// Función para mostrar el formulario de nueva categoría
function showCategoryForm() {
    const form = document.getElementById('categoryForm');
    if (form) {
        form.classList.add('active');
        
        // Hacer focus en el input después de la animación
        setTimeout(() => {
            const input = document.getElementById('categoryName');
            if (input) {
                input.focus();
            }
        }, 300);
    }
}

// Función para cancelar el formulario de categoría
function cancelCategoryForm() {
    const form = document.getElementById('categoryForm');
    const input = document.getElementById('categoryName');
    
    if (form) {
        form.classList.remove('active');
    }
    if (input) {
        input.value = '';
    }
}

// Función para guardar nueva categoría
function saveCategory() {
    const categoryNameInput = document.getElementById('categoryName');
    if (!categoryNameInput) return;
    
    const categoryName = categoryNameInput.value.trim();
    
    // Validaciones
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

    // Verificar si ya existe una categoría con ese nombre
    const exists = categories.some(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (exists) {
        alert('Ya existe una categoría con ese nombre.');
        categoryNameInput.focus();
        return;
    }

    // Crear nueva categoría
    const newCategory = {
        id: Date.now(), // ID temporal (en producción vendría de la BD)
        name: categoryName,
        postCount: 0
    };

    // Agregar la categoría al array
    categories.push(newCategory);
    
    // Actualizar la vista
    renderCategories();
    
    // Limpiar y ocultar el formulario
    cancelCategoryForm();

    // Mostrar mensaje de éxito
    console.log('Categoría creada:', newCategory);
    
    // TODO: Aquí iría la llamada AJAX para guardar en la base de datos
    /*
    fetch('index.php?controller=admin&action=createCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: categoryName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Actualizar el ID real desde la base de datos
            newCategory.id = data.categoryId;
            console.log('Categoría guardada en BD:', data);
        } else {
            alert('Error al guardar la categoría: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    });
    */
}

// Función para eliminar categoría
function deleteCategory(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
        console.error('Categoría no encontrada');
        return;
    }

    // Confirmar eliminación
    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer.`)) {
        // Eliminar del array local
        categories = categories.filter(cat => cat.id !== categoryId);
        
        // Actualizar la vista
        renderCategories();
        
        console.log('Categoría eliminada:', categoryId);
        
        // TODO: Aquí iría la llamada AJAX para eliminar de la base de datos
        /*
        fetch(`index.php?controller=admin&action=deleteCategory&id=${categoryId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Categoría eliminada de BD:', data);
            } else {
                alert('Error al eliminar la categoría: ' + data.message);
                // Revertir el cambio local
                categories.push(category);
                renderCategories();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
            // Revertir el cambio local
            categories.push(category);
            renderCategories();
        });
        */
    }
}

// Función para renderizar las categorías en el modal
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    // Generar HTML para las categorías existentes
    const categoriesHTML = categories.map(category => `
        <div class="category-card">
            <button class="delete-category" onclick="deleteCategory(${category.id})" title="Eliminar categoría">
                <i class="fas fa-times"></i>
            </button>
            <div class="category-name">${escapeHtml(category.name)}</div>
            <div class="category-count">${category.postCount} posts</div>
        </div>
    `).join('');

    // HTML para el botón de agregar nueva categoría
    const addButtonHTML = `
        <div class="add-category-card" onclick="showCategoryForm()" title="Crear nueva categoría">
            <div class="add-category-icon">
                <i class="fas fa-plus-circle"></i>
            </div>
            <div class="add-category-text">Nueva Categoría</div>
        </div>
    `;

    // Actualizar el contenido del grid
    grid.innerHTML = categoriesHTML + addButtonHTML;
}

// Función auxiliar para escapar HTML y prevenir XSS
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

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Cargar mundiales
    displayAdminWorldCups(adminWorldCups);
    
    // Configurar event listeners para el modal
    setupModalEventListeners();
});

// Configurar event listeners para el modal de categorías
function setupModalEventListeners() {
    // Cerrar modal al hacer clic fuera del contenido
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCategoryModal();
            }
        });
    }

    // Manejar tecla Enter en el input de categoría
    const categoryInput = document.getElementById('categoryName');
    if (categoryInput) {
        categoryInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveCategory();
            }
        });
    }

    // Manejar tecla Escape para cerrar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('categoryModal');
            if (modal && modal.classList.contains('active')) {
                closeCategoryModal();
            }
        }
    });
}

// ==========================================
// FUNCIONES UTILITARIAS
// ==========================================

// Función para mostrar notificaciones (opcional)
function showNotification(message, type = 'success') {
    // Implementar sistema de notificaciones si se desea
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Función para validar nombres de categorías
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
    
    // Verificar caracteres especiales peligrosos
    if (/<|>|&/.test(name)) {
        errors.push('El nombre contiene caracteres no permitidos');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Función para refrescar datos desde el servidor (para uso futuro)
function refreshCategoriesFromServer() {
    // TODO: Implementar cuando se conecte con el backend
    /*
    fetch('index.php?controller=admin&action=getCategories')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                categories = data.categories;
                renderCategories();
            }
        })
        .catch(error => {
            console.error('Error al cargar categorías:', error);
        });
    */
}