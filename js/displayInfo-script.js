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
    document.getElementById('user-info').innerHTML = `
        <img src="https://cdn.discordapp.com/avatars/${userData.id}/${avatar}" alt="Avatar" style="width: 50px; height: 50px; border-radius: 10%;">
        <p>Welcome, ${userData.username}!</p>
    `;
} else {
    document.getElementById('user-info').innerHTML = `<p>Error loading user info.</p>`;
}
