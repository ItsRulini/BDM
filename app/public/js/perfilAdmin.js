document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo para el perfil de Administrador
    const adminProfileData = {
        nombres: "Admin FootGG",
        username: "admin_footgg",
        nacimiento: "1990-01-01",
        pais: "México",
        nacionalidad: "Mexicana",
        correo: "admin@footgg.com",
    };

    // Datos de ejemplo para la actividad del admin
    const adminActivity = [
        { title: "Post Aprobado: 'Análisis del Mundial 2018'", user: "Villa", status: "approved" },
        { title: "Post Pendiente: 'Opinión sobre VAR'", user: "El bicho", status: "pending" },
    ];

    // Seleccionamos los elementos del DOM (esto puede fallar si los selectores no coinciden)
    const profileName = document.querySelector('.profile-name h2');
    const profileUsername = document.querySelector('.profile-name p');
    const profileInfoList = document.querySelector('.info-card ul');
    const userPostsGrid = document.getElementById('userPostsGrid');

    // Muestra la información del administrador
    if(profileName) profileName.textContent = adminProfileData.nombres;
    if(profileUsername) profileUsername.textContent = `@${adminProfileData.username}`;
    if (profileInfoList) {
        profileInfoList.innerHTML = `
            <li><i class="fas fa-calendar-alt"></i><strong>Fecha de Nacimiento:</strong> <span>${adminProfileData.nacimiento}</span></li>
            <li><i class="fas fa-flag"></i><strong>País:</strong> <span>${adminProfileData.pais}</span></li>
            <li><i class="fas fa-globe"></i><strong>Nacionalidad:</strong> <span>${adminProfileData.nacionalidad}</span></li>
            <li><i class="fas fa-envelope"></i><strong>Correo:</strong> <span>${adminProfileData.correo}</span></li>
        `;
    }

    // Muestra la actividad del admin (reemplaza las publicaciones)
    if (userPostsGrid) {
        userPostsGrid.innerHTML = ''; // Limpiamos el contenido de ejemplo
        adminActivity.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'post-card'; // Reutilizamos la clase
            activityElement.innerHTML = `
                <h4>${activity.title}</h4>
                <p>Enviado por: @${activity.user}</p>
                <div class="post-status ${activity.status}">
                    <i class="fas fa-info-circle"></i> ${activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </div>
            `;
            userPostsGrid.appendChild(activityElement);
        });
    }

    console.log("Perfil de Administrador cargado con datos de muestra.");
});