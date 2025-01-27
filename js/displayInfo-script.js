document.addEventListener('DOMContentLoaded', async () => {
    const userSection = document.getElementById('user-section');

    userSection.innerHTML = `<p>Loading...</p>`;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const refreshIcon = document.getElementById('refresh-icon');
    const refreshButton = document.getElementById('refresh-container');

    if (refreshIcon) {
        refreshButton.addEventListener('click', async () => {
            console.log('Refresh icon clicked. Re-checking user info...');

            refreshIcon.style.animation = 'spin 1s linear infinite';

            await fetchAndUpdateUserInfo();

            setTimeout(() => {
                refreshIcon.style.animation = '';
            }, 1000);
        });
    }

    if (token) {
        localStorage.setItem('auth_token', token);

        window.history.replaceState({}, document.title, window.location.pathname);
    }

    await fetchAndUpdateUserInfo();
});

async function fetchAndUpdateUserInfo() {
    const userSection = document.getElementById('user-section');
    const token = localStorage.getItem('auth_token');

    if (!token) {
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

            addDropdownAndLogoutListeners();
        } else {
            console.log('User is not logged in');
            userSection.innerHTML = `
                <a class="user-option" href="https://tale-fyp.onrender.com/auth/discord">
                    <button class="login-button" alt="Log In">Log In</button>
                </a>
            `;
        }
    } catch (error) {
        console.error('Error fetching login status:', error);

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

    profilePicture.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && e.target !== profilePicture) {
            dropdownMenu.classList.remove('show');
        }
    });

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('auth_token');

        window.location.href = 'https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html';
    });
}
