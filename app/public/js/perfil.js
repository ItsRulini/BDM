document.addEventListener('DOMContentLoaded', () => {
    const userProfileData = {
        nombres: "Jane Doe",
        username: "Jane_Doe",
        nacimiento: "1998-05-15",
        pais: "México",
        nacionalidad: "Mexicana",
        correo: "jane.doe@example.com",
    };

    const userPosts = [
        { title: "Mi primera publicación", content: "¡Hola a todos! Emocionada de unirme a la comunidad.", date: "2025-08-18" },
        { title: "Análisis del Mundial 2018", content: "El Mundial de Rusia fue increíble, ¡especialmente el partido de Francia!", date: "2025-08-17" },
    ];

    const profileName = document.querySelector('.profile-header h2');
    const profileUsername = document.querySelector('.profile-header p');
    const profileInfoList = document.querySelector('.profile-info ul');
    const userPostsContainer = document.querySelector('.profile-content');

    // Muestra la información del usuario
    profileName.textContent = userProfileData.nombres;
    profileUsername.textContent = `@${userProfileData.username}`;
    profileInfoList.innerHTML = `
        <li><strong>Nombre completo:</strong> ${userProfileData.nombres}</li>
        <li><strong>Fecha de Nacimiento:</strong> ${userProfileData.nacimiento}</li>
        <li><strong>País:</strong> ${userProfileData.pais}</li>
        <li><strong>Nacionalidad:</strong> ${userProfileData.nacionalidad}</li>
        <li><strong>Correo:</strong> ${userProfileData.correo}</li>
    `;

    // Muestra las publicaciones del usuario
    userPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <span class="post-time">${post.date}</span>
        `;
        userPostsContainer.appendChild(postElement);
    });

    console.log("Perfil cargado con datos de muestra.");
});