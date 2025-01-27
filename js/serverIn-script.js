document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("auth_token");
    const serversCountElement = document.getElementById("servers-in-count");

    if (!token) {
        serversCountElement.textContent = "0"; // Default if no token
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

        if (data.loggedIn && data.guilds) {
            // Assuming `data.guilds` is an array of servers the user is in
            const serverCount = data.guilds.length;
            serversCountElement.textContent = serverCount;
        } else {
            console.log("User not logged in or no guilds data available");
            serversCountElement.textContent = "0";
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        serversCountElement.textContent = "0"; // Default on error
    }
});
