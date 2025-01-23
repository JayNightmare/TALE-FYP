// Parse Query Parameters
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const userId = urlParams.get('id');
const avatar = urlParams.get('avatar');

// Display User Info
if (username && userId && avatar) {
    document.getElementById('user-info').innerHTML = `
        <img src="https://cdn.discordapp.com/avatars/${userId}/${avatar}.png" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%;">
        <p>Welcome, ${username}!</p>
    `;
} else {
    document.getElementById('user-info').innerHTML = `<p>Error loading user info.</p>`;
}
