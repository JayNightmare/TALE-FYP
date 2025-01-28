document.addEventListener('DOMContentLoaded', () => {
    const serverList = document.getElementById('server-list');
    const serverInputForm = document.getElementById('server-input-form');
    const serverInputField = document.getElementById('server-id-input');
    const loadMoreButton = document.getElementById('load-more-button');
    const searchBar = document.querySelector('.server-name input'); // Search bar input
    const token = localStorage.getItem('auth_token');

    if (!token) {
        serverList.innerHTML = `<p>You need to log in to view your servers.</p>`;
        return;
    }

    let allServers = []; // Cache of all servers for search functionality
    let currentServers = []; // Currently displayed servers
    let nextAfter = null; // Cursor for pagination
    let isLoading = false;

    // Fetch and display servers in batches of 10
    const fetchAndDisplayServers = async () => {
        if (isLoading) return;
        isLoading = true;

        try {
            const response = await fetch(
                `https://tale-fyp.onrender.com/api/auth/guilds?limit=10&after=${nextAfter || ''}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 429) {
                const { retry_after } = await response.json();
                alert(`Rate limited. Please try again after ${retry_after} seconds.`);
                return;
            }

            const data = await response.json();

            if (data.guilds && data.guilds.length > 0) {
                allServers = allServers.concat(data.guilds);
                currentServers = allServers.slice(0, currentServers.length + 10);

                renderServerList(currentServers);
                nextAfter = data.nextAfter || null;

                if (!nextAfter) {
                    loadMoreButton.style.display = 'none'; // Hide load more button when no more servers
                }
            } else if (!nextAfter) {
                serverList.innerHTML = `<p>No servers available with Manage Server permission.</p>`;
            }
        } catch (error) {
            console.error('Error fetching servers:', error);
            serverList.innerHTML = `<p>Failed to load servers. Please try again later.</p>`;
        } finally {
            isLoading = false;
        }
    };

    // Render servers in the list
    const renderServerList = (servers) => {
        serverList.innerHTML = '';

        if (servers.length === 0) {
            serverList.innerHTML = `<p>No servers found.</p>`;
            return;
        }

        servers.forEach((guild) => addServerToList(guild, serverList, false));
    };

    // Search functionality
    const searchServers = () => {
        const query = searchBar.value.trim().toLowerCase();

        if (!query) {
            renderServerList(currentServers);
            return;
        }

        const filteredServers = allServers.filter(
            (guild) =>
                guild.name.toLowerCase().includes(query) || guild.id.includes(query)
        );

        renderServerList(filteredServers);
    };

    // Add server to the list
    const addServerToList = (guild, serverList, addToTop) => {
        const guildIcon = guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : `https://cdn.discordapp.com/embed/avatars/0.png`;

        const serverItem = `
            <div class="server-item" data-id="${guild.id}">
                <img src="${guildIcon}" alt="${guild.name}" class="server-icon">
                <div class="server-name">${guild.name}</div>
                <button class="server-button">Manage</button>
            </div>
        `;

        if (addToTop) {
            serverList.insertAdjacentHTML('afterbegin', serverItem);
        } else {
            serverList.insertAdjacentHTML('beforeend', serverItem);
        }
    };

    // Attach click handler for server buttons
    const attachServerClickHandler = () => {
        serverList.addEventListener('click', (e) => {
            if (e.target.classList.contains('server-button')) {
                const serverId = e.target.closest('.server-item').dataset.id;
                console.log(`Selected server ID: ${serverId}`);
                window.location.href = `https://jaynightmare.github.io/TALE-FYP/screens/dashboard/index.html?${serverId}`;
            }
        });
    };

    // Handle manual server input
    serverInputForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const serverId = serverInputField.value.trim();

        if (!serverId) {
            alert('Please enter a valid server ID.');
            return;
        }

        try {
            const response = await fetch(`https://tale-fyp.onrender.com/api/auth/guilds/${serverId}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 429) {
                const { retry_after } = await response.json();
                alert(`Rate limited. Please try again after ${retry_after} seconds.`);
                return;
            }

            const guild = await response.json();

            if (guild?.canManage) {
                allServers.unshift(guild); // Add to the top of the cache
                currentServers.unshift(guild); // Add to the top of the displayed servers
                renderServerList(currentServers); // Re-render server list
                alert(`Server "${guild.name}" added to the list!`);
            } else {
                alert('You do not have permission to manage this server.');
            }
        } catch (error) {
            console.error('Error fetching server by ID:', error);
            alert('Failed to fetch the server. Please ensure the server ID is correct.');
        }

        serverInputField.value = '';
    });

    // Initial fetch and event listeners
    fetchAndDisplayServers();
    loadMoreButton.addEventListener('click', fetchAndDisplayServers);
    searchBar.addEventListener('input', searchServers);
    attachServerClickHandler();
});
