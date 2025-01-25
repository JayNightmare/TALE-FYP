document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        // No token found, redirect to login page
        window.location.href = 'https://tale-fyp.onrender.com/auth/discord';
        return;
    }

    // Optional: Verify token validity with the server
    fetch('https://tale-fyp.onrender.com/api/auth/status', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (!data.loggedIn) {
            window.location.href = 'https://tale-fyp.onrender.com/auth/discord';
        }
    })
    .catch(error => {
        console.error('Error verifying token:', error);
        window.location.href = 'https://tale-fyp.onrender.com/auth/discord';
    });
});
