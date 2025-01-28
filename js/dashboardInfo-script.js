document.addEventListener("DOMContentLoaded", () => {
    const dashboardContent = document.querySelector(".dashboard-content");
    const sidebarLinks = document.querySelectorAll(".sidebar-item a");

    const loadDashboard = async (dashboard) => {
        try {
            let module;

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

            history.pushState({}, "", `?dashboard=${dashboard}`);
        } catch (error) {
            console.error("Error loading dashboard module:", error);
            dashboardContent.innerHTML = `<p>Error loading content. Please try again.</p>`;
        }
    };

    const setActiveItem = (dashboard) => {
        document.querySelectorAll(".active").forEach((el) => el.classList.remove("active"));

        const activeSidebarLink = Array.from(sidebarLinks).find(
            (link) => link.getAttribute("data-dashboard") === dashboard
        );
        if (activeSidebarLink) activeSidebarLink.classList.add("active");

        const activeCard = document.querySelector(
            `.dashboard-card[data-dashboard="${dashboard}"]`
        );
        if (activeCard) activeCard.classList.add("active");
    };

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const dashboard = link.getAttribute("data-dashboard");
            setActiveItem(dashboard);
            loadDashboard(dashboard);
        });
    });

    dashboardContent.addEventListener("click", (event) => {
        const card = event.target.closest(".dashboard-card");
        if (card) {
            event.preventDefault();
            const dashboard = card.getAttribute("data-dashboard");
            setActiveItem(dashboard);
            loadDashboard(dashboard);
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialDashboard = urlParams.get("dashboard") || "home";
    loadDashboard(initialDashboard);

    setActiveItem(initialDashboard);
});
