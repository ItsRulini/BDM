// Reemplaza TODO el contenido de tu js/Mundiales.js con esto.

document.addEventListener('DOMContentLoaded', function() {
    const selectionContainer = document.getElementById('selection-container');
    // Esta variable guardará las categorías que el usuario seleccione
    let selectedSubCategories = []; 

    // --- DATOS ---
    const allWorldCups = [
        { id: 1, year: 2022, name: "Qatar 2022" },
        { id: 2, year: 2018, name: "Rusia 2018" },
        { id: 3, year: 2014, name: "Brasil 2014" },
        { id: 4, year: 2010, name: "Sudáfrica 2010" },
    ];

    const subCategories = [
        "Jugadas Polémicas",
        "Goles Históricos",
        "Partidos Memorables",
        "Figuras del Torneo",
        "Anécdotas y Curiosidades"
    ];

    // --- FUNCIONES DE RENDERIZADO (Crean el HTML) ---

    // Muestra la lista de Mundiales (Paso 1)
    function renderWorldCupSelection() {
        let worldCupsHTML = allWorldCups.map(worldCup => `
            <div class="category-item" data-mundial-name="${worldCup.name}">
                <span>Copa Mundial de la FIFA</span>
                <h4>${worldCup.name}</h4>
            </div>
        `).join('');

        selectionContainer.innerHTML = `
            <h2 class="selection-title">Paso 1: Selecciona un Mundial</h2>
            <section class="explore-content">${worldCupsHTML}</section>
        `;
        // IMPORTANTE: Después de crear el HTML, asignamos los eventos de clic
        addWorldCupClickListeners();
    }

    // Muestra la lista de sub-categorías (Paso 2)
    function renderSubCategorySelection(mundialName) {
        let subCategoriesHTML = subCategories.map(cat => `
            <div class="category-item selectable" data-category-name="${cat}">
                <span>${cat}</span>
            </div>
        `).join('');

        selectionContainer.innerHTML = `
            <h2 class="selection-title">Paso 2: Selecciona las categorías para ${mundialName}</h2>
            <section class="explore-content">${subCategoriesHTML}</section>
            <button id="finish-selection-btn" class="btn-post-sidebar">Finalizar</button>
        `;
        // IMPORTANTE: Asignamos los eventos de clic a las nuevas categorías y al botón
        addSubCategoryClickListeners();
        addFinishButtonListener();
    }

    // --- MANEJADORES DE EVENTOS (La lógica de los clics) ---

    function addWorldCupClickListeners() {
        document.querySelectorAll('.category-item[data-mundial-name]').forEach(item => {
            item.addEventListener('click', (e) => {
                const mundialName = e.currentTarget.dataset.mundialName;
                const selectedWorldCup = allWorldCups.find(wc => wc.name === mundialName);

                if (selectedWorldCup) {
                    localStorage.setItem('selectedMundial', selectedWorldCup.name);
                    localStorage.setItem('selectedMundialId', selectedWorldCup.id);
                    renderSubCategorySelection(selectedWorldCup.name);
                }
            });
        });
    }

    // ✅ ESTA FUNCIÓN SOLUCIONA TU PROBLEMA DE SELECCIÓN MÚLTIPLE
    function addSubCategoryClickListeners() {
        document.querySelectorAll('.category-item.selectable').forEach(item => {
            item.addEventListener('click', (e) => {
                const categoryName = e.currentTarget.dataset.categoryName;
                
                // Añade o quita la clase 'selected' para dar feedback visual
                e.currentTarget.classList.toggle('selected');
                
                const index = selectedSubCategories.indexOf(categoryName);
                if (index > -1) {
                    // Si ya estaba seleccionada, la quitamos
                    selectedSubCategories.splice(index, 1); 
                } else {
                    // Si no estaba, la añadimos
                    selectedSubCategories.push(categoryName); 
                }
                console.log("Categorías seleccionadas:", selectedSubCategories); // Para que veas en la consola cómo funciona
            });
        });
    }

    // ✅ ESTA FUNCIÓN AHORA VALIDA ANTES DE CONTINUAR
    function addFinishButtonListener() {
        document.getElementById('finish-selection-btn').addEventListener('click', () => {
            // VERIFICACIÓN: Si no se ha seleccionado ninguna categoría, muestra un mensaje y no continúa.
            if (selectedSubCategories.length === 0) {
                alert('Debes seleccionar al menos una categoría para continuar.');
                return; // Detiene la ejecución de la función aquí
            }
            
            // Si todo está bien, guarda los datos
            localStorage.setItem('selectedCategories', JSON.stringify(selectedSubCategories));
            const mundialId = localStorage.getItem('selectedMundialId');
            
            if (!mundialId) {
                alert("Error: No se ha seleccionado un mundial. Por favor, vuelve a empezar.");
                return;
            }
            
            const targetUrl = `index.php?controller=mundial&action=ver&id=${mundialId}`;
            window.location.href = targetUrl;
        });
    }

    // --- INICIO ---
    // Esto es lo primero que se ejecuta: muestra la selección de mundiales.
    renderWorldCupSelection(); 
});