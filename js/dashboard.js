document.addEventListener('DOMContentLoaded', async () => {
    const serverInfoDiv = document.getElementById('server-info');

    // Extract the serverId from the URL
    const serverId = new URLSearchParams(window.location.search).get('serverId');
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

        const response = await fetch(`https://tale-fyp.onrender.com/api/auth/guilds/${serverId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            // Display server info
            serverInfoDiv.innerHTML = `
                <p><strong>Server Name:</strong> ${data.name}</p>
                <p><strong>Server ID:</strong> ${data.id}</p>
                <p><strong>Manage Server Permission:</strong> ${
                    data.canManage ? 'Yes' : 'No'
                }</p>
            `;
        } else {
            console.error('Error:', data.message);
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
