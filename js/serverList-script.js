document.addEventListener('DOMContentLoaded', async () => {
    const serverList = document.getElementById('server-list');
    const token = localStorage.getItem('auth_token');

    if (!token) {
        serverList.innerHTML = `<p>You need to log in to view your servers.</p>`;
        return;
    }

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

            data.guilds.forEach(guild => {
                const guildIcon = guild.icon
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                    : `https://cdn.discordapp.com/embed/avatars/0.png`;

                const serverItem = document.createElement('div');
                serverItem.className = 'server-item';

                serverItem.innerHTML = `
                    <img src="${guildIcon}" alt="${guild.name}" class="server-icon">
                    <div class="server-name">${guild.name}</div>
                    <button class="server-button" data-id="${guild.id}">Manage</button>
                `;

                serverList.appendChild(serverItem);
            });

            document.querySelectorAll('.server-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const serverId = e.target.dataset.id;
                    console.log(`Selected server ID: ${serverId}`);
                    window.location.href = `https://jaynightmare.github.io/TALE-FYP/screens/dashboard/index.html/${serverId}`;
                });
            });
        } else {
            serverList.innerHTML = `<p>No servers available with Manage Server permission.</p>`;
        }
    } catch (error) {
        console.error('Error fetching servers:', error);
        serverList.innerHTML = `<p>Failed to load servers. Please try again later.</p>`;
    }
});
