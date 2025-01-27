document.addEventListener("DOMContentLoaded", async () => {
    // Example user data (Replace with your actual fetch logic)
    const token = localStorage.getItem("auth_token");
    if (!token) {
        console.error("No token found!");
        return;
    }

    try {
        const response = await fetch("https://tale-fyp.onrender.com/api/auth/status", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.loggedIn) {
            // Display username
            document.querySelector(".username").textContent = data.username;

            // Determine avatar format
            const avatarUrl = data.avatar.startsWith("a_")
                ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.gif`
                : `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;

            // Display profile picture
            const avatarImage = document.getElementById("avatar-image");
            avatarImage.src = avatarUrl;
            avatarImage.style.display = "block";
        } else {
            console.error("User is not logged in");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
});
