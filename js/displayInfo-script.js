document.addEventListener('DOMContentLoaded', async () => {
    const userSection = document.getElementById('user-section');

    // Add a temporary "Loading..." state
    userSection.innerHTML = `<p>Loading...</p>`;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Store the token in localStorage
        localStorage.setItem('auth_token', token);

        // Remove the token from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Fetch and update user info
    await fetchAndUpdateUserInfo();
});

async function fetchAndUpdateUserInfo() {
    const userSection = document.getElementById('user-section');
    const token = localStorage.getItem('auth_token');

    if (!token) {
        // User is not logged in: Display login button immediately
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

            // User is logged in: Display profile picture with dropdown
            userSection.innerHTML = `
                <div class="user-option">
                    <img src="${avatar}" 
                        alt="${data.username}" 
                        class="nav-image" 
                        id="profile-picture" />
                    
                    <div id="dropdown-menu" class="dropdown hidden">
                        <a href="../account/index.html" class="dropdown-item">Account</a>
                        <a href="#" id="logout" class="dropdown-item">Logout</a>
                    </div>
                </div>
            `;

            // Add dropdown and logout event listeners after DOM update
            addDropdownAndLogoutListeners();
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

        // Fallback: Show login button on error
        userSection.innerHTML = `
            <a class="user-option" href="https://tale-fyp.onrender.com/auth/discord">
                <button class="login-button" alt="Log In">Log In</button>
            </a>
        `;
    }
}

function addDropdownAndLogoutListeners() {
    const profilePicture = document.getElementById('profile-picture');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const logoutButton = document.getElementById('logout');

    if (!profilePicture || !dropdownMenu || !logoutButton) {
        console.error('Dropdown or logout elements not found.');
        return;
    }

    // Toggle dropdown menu when clicking on the profile picture
    profilePicture.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    // Hide dropdown menu if clicking outside of it
    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && e.target !== profilePicture) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Logout logic
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Clear token from localStorage
        localStorage.removeItem('auth_token');

        // Redirect to homepage
        window.location.href = 'https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html';
    });
}
