document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Store the token in localStorage
        localStorage.setItem('auth_token', token);

        // Redirect to the homepage
        window.location.href = 'https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html';
    } else {
        window.location.href = 'https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html';
    }
});
