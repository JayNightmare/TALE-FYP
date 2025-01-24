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

document.addEventListener('DOMContentLoaded', async () => {
    const userSection = document.getElementById('user-section');

    try {
        const response = await fetch('https://tale-fyp.onrender.com/api/auth/status', {
            credentials: 'include', // Include cookies for authentication
        });

        const data = await response.json();

        if (data.loggedIn) {
            // User is logged in: Display profile picture
            userSection.innerHTML = `
                <div class="user-option">
                    <img src="https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png" 
                        alt="${data.username}" 
                        class="nav-image" 
                        style="border-radius: 50%; width: 48px; height: 48px;" />
                </div>
            `;
        } else {
            // User is not logged in: Display login button
            userSection.innerHTML = `
                <a class="user-option" href="https://tale-fyp.onrender.com/auth/discord">
                    <button class="login-button" alt="Log In">Log In</button>
                </a>
            `;
        }
    } catch (error) {
        console.error('Error fetching login status:', error);

        // Fallback: Show login button
        userSection.innerHTML = `
            <a class="user-option" href="https://tale-fyp.onrender.com/auth/discord">
                <button class="login-button" alt="Log In">Log In</button>
            </a>
        `;
    }
});
