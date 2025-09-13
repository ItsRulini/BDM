// Datos de todos los mundiales (del más reciente al más antiguo)
const allWorldCups = [
    { id: 1, year: 2022, name: "Qatar 2022" },
    { id: 2, year: 2018, name: "Rusia 2018" },
    { id: 3, year: 2014, name: "Brasil 2014" },
    { id: 4, year: 2010, name: "Sudáfrica 2010" },
    { id: 5, year: 2006, name: "Alemania 2006" },
    { id: 6, year: 2002, name: "Corea y Japón 2002" },
    { id: 7, year: 1998, name: "Francia 1998" },
    { id: 8, year: 1994, name: "Estados Unidos 1994" },
    { id: 9, year: 1990, name: "Italia 1990" },
    { id: 10, year: 1986, name: "México 1986" },
    // ...puedes seguir añadiendo los demás mundiales aquí
];

// Función para crear el HTML de una categoría de mundial
function createWorldCupCategory(worldCup) {
    // Creamos una URL que sigue el patrón de tu aplicación
    const link = `index.php?controller=mundial&action=ver&id=${worldCup.id}`;

    return `
        <a href="${link}" class="category-item">
            <span>Copa Mundial de la FIFA</span>
            <h4>${worldCup.name}</h4>
        </a>
    `;
}

// Función para mostrar todas las categorías en la página
function displayWorldCupCategories(worldCups) {
    const listContainer = document.getElementById('world-cups-list');
    if (listContainer) {
        listContainer.innerHTML = worldCups.map(worldCup => createWorldCupCategory(worldCup)).join('');
    }
}

// Se ejecuta cuando la página ha cargado
document.addEventListener('DOMContentLoaded', function() {
    displayWorldCupCategories(allWorldCups);
});