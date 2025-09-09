// Datos de ejemplo para los mundiales (esto vendrá de la base de datos)
const adminWorldCups = [
    { id: 1, year: 2022, name: "Qatar 2022", image: "https://cdn-3.expansion.mx/dims4/default/68cb107/2147483647/strip/true/crop/1371x876+0+0/resize/1800x1150!/format/webp/quality/80/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F6f%2Fc4%2F8766f2ff44a9b37bcd371593de2f%2Fqatar-2022.JPG", description: "El primer mundial en el Medio Oriente, lleno de sorpresas y con la épica final entre Argentina y Francia." },
    { id: 2, year: 2018, name: "Rusia 2018", image: "https://i.pinimg.com/736x/51/96/44/519644869b0fe4d59baa467249594234.jpg", description: "La sorprendente victoria de Francia y la memorable actuación de Croacia." },
    { id: 3, year: 2014, name: "Brasil 2014", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq06obpmRyvsfrJT8CZCMvgdKK4fON5LNe8A&s", description: "El mundial en la cuna del fútbol, recordado por el 7-1 de Alemania a Brasil." }
];

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

/* <button class="admin-btn delete" onclick="deleteMundial(${worldCup.id})">
    <i class="fas fa-trash"></i> Eliminar
</button> */

function displayAdminWorldCups(worldCups) {
    const container = document.getElementById('worldCupsGrid');
    container.innerHTML = worldCups.map(worldCup => createAdminWorldCupCard(worldCup)).join('');
}

function goToCreateMundial() {
    window.location.href = 'index.php?controller=admin&action=crearMundial';
}

function editMundial(id) {
    // Redirigir a la acción editMundial del controlador admin con el ID
    window.location.href = `index.php?controller=admin&action=editarMundial&id=${id}`;
}

// function deleteMundial(id) {
//     if (confirm('¿Estás seguro de que deseas eliminar este mundial? Esta acción no se puede deshacer.')) {
//         console.log(`Eliminando mundial ${id}`);
//         // Aquí iría la lógica para eliminar de la base de datos
//         // Por ahora solo lo removemos del array local
//         const index = adminWorldCups.findIndex(wc => wc.id === id);
//         if (index > -1) {
//             adminWorldCups.splice(index, 1);
//             displayAdminWorldCups(adminWorldCups);
//         }
//     }
// }

function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Lógica para cerrar sesión
        window.location.href = 'index.php?controller=home&action=login';
    }
}

// Cargar mundiales al iniciar
document.addEventListener('DOMContentLoaded', function() {
    displayAdminWorldCups(adminWorldCups);
});