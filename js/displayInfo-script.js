// Parse token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    // Decode JWT (you can use libraries like jwt-decode)
    const userData = JSON.parse(atob(token.split('.')[1]));

    // If userdata avatar contains "a_" make it .gif format
    const avatar = userData.avatar ? userData.avatar.startsWith("a_") ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.gif`
        : `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;

    // Display user info
    document.getElementById('discord-avatar').innerHTML = `
        <img src="${avatar}" class="nav-image" alt="Avatar">
    `;
} else {
    document.getElementById('discord-avatar').innerHTML = `<p>Error</p>`;
}
