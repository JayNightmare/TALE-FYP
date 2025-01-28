document.addEventListener('DOMContentLoaded', async () => {
    const serverList = document.getElementById('server-list');
    const serverInputForm = document.getElementById('server-input-form');
    const serverInputField = document.getElementById('server-id-input');
    const token = localStorage.getItem('auth_token');

    if (!token) {
        serverList.innerHTML = `<p>You need to log in to view your servers.</p>`;
        return;
    }

    serverList.innerHTML = `<p>Loading servers...</p>`;

    try {
        const response = await fetch('https://tale-fyp.onrender.com/api/auth/guilds', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.guilds && data.guilds.length > 0) {
            serverList.innerHTML = '';

            const displayedGuilds = data.guilds.slice(0, 10);
            displayedGuilds.forEach((guild) => {
                addServerToList(guild, serverList);
            });

            attachServerClickHandler(serverList);
        } else {
            serverList.innerHTML = `<p>No servers available with Manage Server permission.</p>`;
        }
    } catch (error) {
        console.error('Error fetching servers:', error);
        serverList.innerHTML = `<p>Failed to load servers. Please try again later.</p>`;
    }

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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const guild = await response.json();

            if (guild?.canManage) {
                addServerToList(guild, serverList, true);
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
});

function addServerToList(guild, serverList, addToTop = false) {
    const guildIcon = guild.icon.startsWith("a_")
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif`
        : `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;

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
}

function attachServerClickHandler(serverList) {
    serverList.addEventListener('click', (e) => {
        if (e.target.classList.contains('server-button')) {
            const serverId = e.target.closest('.server-item').dataset.id;
            console.log(`Selected server ID: ${serverId}`);
            window.location.href = `https://jaynightmare.github.io/TALE-FYP/screens/dashboard/index.html?${serverId}`;
        }
    });
}
