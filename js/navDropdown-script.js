document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded');
    const profilePicture = document.getElementById('profile-picture');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const logoutButton = document.getElementById('logout');

    if (profilePicture && dropdownMenu && logoutButton) {
        console.log('Required elements found in the DOM.');
        // Toggle dropdown menu when clicking on the profile picture
        profilePicture.addEventListener('click', () => {
            console.log('clicked');
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

            // Redirect to homepage or login page
            window.location.href = 'https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html';
        });
    } else {
        console.error('Required elements are not found in the DOM.');
    }
});
