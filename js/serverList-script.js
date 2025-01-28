document.addEventListener('DOMContentLoaded', async () => {
    const serverList = document.getElementById('server-list');
    const token = localStorage.getItem('auth_token');

    if (!token) {
        serverList.innerHTML = `<p>You need to log in to view your servers.</p>`;
        return;
    }

    // Display a loading indicator while fetching the server list
    serverList.innerHTML = `<p>Loading servers...</p>`;

    try {
        const response = await fetch('https://tale-fyp.onrender.com/api/auth/guilds', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        // Handle the case where the server list is empty
        if (data.guilds && data.guilds.length > 0) {
            serverList.innerHTML = ''; // Clear the loading message

            data.guilds.forEach(guild => {
                const guildIcon = guild.icon.startsWith("a_")
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif`
                    : `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`

                // Create the server item element
                const serverItem = `
                    <div class="server-item" data-id="${guild.id}">
                        <img src="${guildIcon}" alt="${guild.name}" class="server-icon">
                        <div class="server-name">${guild.name}</div>
                        <button class="server-button">Manage</button>
                    </div>
                `;

                serverList.innerHTML += serverItem;
            });

            // Add a single event listener for the server list container
            serverList.addEventListener('click', (e) => {
                if (e.target.classList.contains('server-button')) {
                    const serverId = e.target.closest('.server-item').dataset.id;
                    console.log(`Selected server ID: ${serverId}`);
                    window.location.href = `https://jaynightmare.github.io/TALE-FYP/screens/dashboard/index.html/${serverId}`;
                }
            });
        } else {
            serverList.innerHTML = `<p>No servers available with Manage Server permission.</p>`;
        }
    } catch (error) {
        console.error('Error fetching servers:', error);
        serverList.innerHTML = `<p>Failed to load servers. Please try again later.</p>`;
    }
});
