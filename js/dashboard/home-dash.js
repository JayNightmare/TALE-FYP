export const homeHTML = `
            <h1>Welcome <span class="highlight">Username</span>,</h1>
            <p>Where would you like to start?</p>
            <div class="card-container">
                <div class="dashboard-card item" data-dashboard="general-settings">
                    <i class="icon">⚙️</i>
                    <h3>General Settings</h3>
                    <p>Set managing roles and the default language. Manage your server data and other permissions for your server.</p>
                </div>
                <div class="dashboard-card item" data-dashboard="commands">
                    <i class="icon">📋</i>
                    <h3>Commands</h3>
                    <p>Update permissions, aliases and more for all the default commands, and set if you want to receive an error message.</p>
                </div>
                <div class="dashboard-card item" data-dashboard="messages">
                    <i class="icon">💬</i>
                    <h3>Messages</h3>
                    <p>Setup templates, components, and default messages that the bot will send. Customize the output sent out by T.A.L.E.</p>
                </div>
                <div class="dashboard-card item" data-dashboard="translation-settings">
                    <i class="icon">🌍</i>
                    <h3>Translation Settings</h3>
                    <p>Setup permissions for who and where the bot can respond to and from. Setup default translation languages and language-specific channels.</p>
                </div>
                <div class="dashboard-card item" data-dashboard="moderation">
                    <i class="icon">🛡️</i>
                    <h3>Moderation</h3>
                    <p>View "Cases" where a message is held for review. Setup immune roles, user notifications, and punish settings for punishment actions.</p>
                </div>
                <div class="dashboard-card item" data-dashboard="logging">
                    <i class="icon">📜</i>
                    <h3>Logging</h3>
                    <p>Setup logging tools to help improve the moderation of a server. Setup logs for events such as translations, role changes, and more.</p>
                </div>
            </div>

`