document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();

            // Clear token from localStorage
            localStorage.removeItem("auth_token");

            // Redirect to homepage or login page
            window.location.href = "https://jaynightmare.github.io/TALE-FYP";
        });
    } else {
        console.error("Logout button not found!");
    }
});
