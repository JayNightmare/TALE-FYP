document.addEventListener("DOMContentLoaded", () => {
    const dashboardContent = document.querySelector(".dashboard-content");
    const sidebarLinks = document.querySelectorAll(".sidebar-item a");
    const dashboardCards = document.querySelectorAll(".dashboard-card");

    console.log("Dashboard Cards: ", dashboardCards); // Debugging line
    console.log("Sidebar Links: ", sidebarLinks); // Debugging line

    // Function to dynamically load dashboard content
    const loadDashboard = async (dashboard) => {
        try {
            let module;

            // Dynamically import the correct module
            switch (dashboard) {
                case "home":
                    module = await import("../js/dashboard/home-dash.js");
                    dashboardContent.innerHTML = module.homeHTML;
                    break;
                case "general-settings":
                    module = await import("../js/dashboard/general-settings-dash.js");
                    dashboardContent.innerHTML = module.generalSettingsHTML;
                    break;
                case "commands":
                    module = await import("../js/dashboard/command-dash.js");
                    dashboardContent.innerHTML = module.commandsHTML;
                    break;
                case "messages":
                    module = await import("../js/dashboard/messages-dash.js");
                    dashboardContent.innerHTML = module.messagesHTML;
                    break;
                case "translation-settings":
                    module = await import("../js/dashboard/translation-settings-dash.js");
                    dashboardContent.innerHTML = module.translationSettingsHTML;
                    break;
                case "moderation":
                    module = await import("../js/dashboard/moderation-dash.js");
                    dashboardContent.innerHTML = module.moderationHTML;
                    break;
                case "logging":
                    module = await import("../js/dashboard/logging-dash.js");
                    dashboardContent.innerHTML = module.loggingHTML;
                    break;
                default:
                    dashboardContent.innerHTML = `<h1>404 - Page Not Found</h1>`;
                    break;
            }

            // Update URL without reloading
            history.pushState({}, "", `?dashboard=${dashboard}`);
        } catch (error) {
            console.error("Error loading dashboard module:", error);
            dashboardContent.innerHTML = `<p>Error loading content. Please try again.</p>`;
        }
    };

    // Handle sidebar item clicks
    sidebarLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const dashboard = link.getAttribute("data-dashboard");
            loadDashboard(dashboard);
        });
    });

    // Handle dashboard card clicks
    dashboardCards.forEach((card) => {
        card.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Card clicked!"); // Debugging line
            const dashboard = card.getAttribute("data-dashboard");
            console.log("Dashboard:", dashboard); // Debugging line
            loadDashboard(dashboard);
        });
    });

    // Load the initial dashboard from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialDashboard = urlParams.get("dashboard") || "home";
    loadDashboard(initialDashboard);
});
