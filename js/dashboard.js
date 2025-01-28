document.addEventListener('DOMContentLoaded', async () => {
    const serverInfoDiv = document.getElementById('server-info');

    // Extract the serverId from the URL
    const serverId = window.location.pathname.split('?').pop();
    console.log('Selected Server ID:', serverId);

    if (!serverId) {
        serverInfoDiv.innerHTML = `<p>Error: No server ID found</p>`;
        return;
    }

    // Fetch server data from the backend
    try {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            console.error('No auth token found.');
            serverInfoDiv.innerHTML = `<p>Error: You are not logged in</p>`;
            return;
        }

        const response = await fetch(`https://tale-fyp.onrender.com/api/server/${serverId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            // Display server info
            serverInfoDiv.innerHTML = `
                <p><strong>Server Name:</strong> ${data.serverName}</p>
                <p><strong>Server ID:</strong> ${serverId}</p>
            `;
        } else {
            serverInfoDiv.innerHTML = `<p>Error: ${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error fetching server info:', error);
        serverInfoDiv.innerHTML = `<p>Error fetching server info. Please try again later</p>`;
    }

    // Logout button logic
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('auth_token');
        window.location.href = 'https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html';
    });
});
