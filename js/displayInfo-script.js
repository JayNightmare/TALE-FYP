document.addEventListener('DOMContentLoaded', async () => {
    const userSection = document.getElementById('user-section');

    try {
        const response = await fetch('https://tale-fyp.onrender.com/api/auth/status', {
            credentials: 'include', // Include cookies for authentication
        });

        const data = await response.json();

        if (data.loggedIn) {
            console.log('User is logged in:', data.username);
            const avatar = data.avatar.startsWith("a_")
                ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.gif`
                : `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;

            // User is logged in: Display profile picture
            userSection.innerHTML = `
                <div class="user-option">
                    <img src="${avatar}"
                        alt="${data.username}"
                        class="nav-image" />
                </div>
            `;
        } else {
            console.log('User is not logged in');
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
