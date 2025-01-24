document.addEventListener('DOMContentLoaded', async () => {
    const userSection = document.getElementById('user-section'); // Placeholder for user info

    const token = localStorage.getItem('auth_token');

    if (!token) {
        // User is not logged in: Display login button
        userSection.innerHTML = `
            <a class="user-option" href="https://tale-fyp.onrender.com/auth/discord">
                <button class="login-button" alt="Log In">Log In</button>
            </a>
        `;
        return;
    }

    try {
        const response = await fetch('https://tale-fyp.onrender.com/api/auth/status', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
                        class="nav-image"
                        id="profile-picture" />
                    
                    <div id="dropdown-menu" class="dropdown">
                        <a href="/account.html" class="dropdown-item">Account</a>
                        <a href="#" id="logout" class="dropdown-item">Logout</a>
                    </div>
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


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Store the token in localStorage
        localStorage.setItem('auth_token', token);

        // Remove the token from the URL to clean up
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
