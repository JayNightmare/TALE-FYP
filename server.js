const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const serverCache = new NodeCache({ stdTTL: 900 }); // 15 minutes

// * Session Configuration
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

// * CORS for GitHub Pages
app.use(cors({
    origin: 'https://jaynightmare.github.io', // GitHub Pages base URL
    credentials: true,
}));

// * Passport Configuration
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email', 'guilds'],
}, (accessToken, refreshToken, profile, done) => {
    const userData = {
        username: profile.username,
        id: profile.id,
        avatar: profile.avatar,
        access_token: accessToken,
    };
    done(null, userData);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(passport.initialize());
app.use(passport.session());

// * Route: Initiate Discord Login
app.get('/auth/discord', passport.authenticate('discord'));

// * Route: Handle Callback and Redirect to GitHub Pages
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: 'https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html',
}), (req, res) => {
    const user = req.user;

    const token = jwt.sign({
        username: user.username,
        id: user.id,
        avatar: user.avatar,
        access_token: user.access_token,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const redirectUrl = `https://jaynightmare.github.io/TALE-FYP/screens/callback/index.html?token=${token}`;
    res.redirect(redirectUrl);
});

// * Route: Logout
app.get('/logout', (req, res) => {
    res.clearCookie('auth_token', { secure: true, sameSite: 'None' }); // Clear the JWT cookie
    req.logout(() => {
        res.redirect('https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html');
    });
});

// * Middleware to decode and validate JWT
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// * Route: Check Auth Status
app.get('/api/auth/status', authenticate, async (req, res) => {
    const { username, avatar, id } = req.user;

    try {
        const response = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
        headers: { Authorization: `Bearer ${req.user.access_token}` },
        });

        const guilds = response.data;

        res.json({
        loggedIn: true,
        username,
        avatar,
        id,
        guilds,
        });
    } catch (error) {
        console.error('Error fetching guilds:', error);
        res.status(500).json({ loggedIn: false, message: 'Failed to fetch guilds' });
    }
});

// * Route: Fetch User Guilds
app.get("/api/auth/guilds", authenticate, async (req, res) => {
    const { id, access_token } = req.user;

    // Check cache for stored servers
    const cachedGuilds = serverCache.get(id);
    if (cachedGuilds) {
        return res.json({ success: true, guilds: cachedGuilds });
    }

    try {
        let allGuilds = [];
        let after = null;

        do {
            const response = await axios.get(
                "https://discord.com/api/v10/users/@me/guilds",
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                    params: { limit: 10, after },
                }
            );

            const guilds = response.data;

            // Filter guilds where the user has "Manage Server" permission
            const manageableGuilds = guilds.filter(
                (guild) => (guild.permissions & 0x20) === 0x20
            );

            allGuilds = allGuilds.concat(manageableGuilds);
            after = guilds.length > 0 ? guilds[guilds.length - 1].id : null;
        } while (after);

        // Cache the servers for the user
        serverCache.set(id, allGuilds);

        res.json({ success: true, guilds: allGuilds });
    } catch (error) {
        console.error(
            "Error fetching guilds:",
            error.response?.data || error.message
        );
        res.status(500).json({
            success: false,
            message: "Failed to fetch guilds",
        });
    }
});

// * Endpoint to fetch user's servers
app.get('/api/user/servers', authenticate, async (req, res) => {
    const { id, access_token } = req.user;

    const cachedServers = serverCache.get(id);
    if (cachedServers) {
        return res.json({ success: true, servers: cachedServers });
    }

    try {
        let allServers = [];
        let after = null; // Pagination cursor

        do {
            const response = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
                headers: { Authorization: `Bearer ${access_token}` },
                params: { limit: 10, after },
            });

            const servers = response.data;

            const manageableServers = servers.filter(server =>
                (server.permissions & 0x20) === 0x20
            );

            allServers = allServers.concat(manageableServers);

            after = servers.length > 0 ? servers[servers.length - 1].id : null;
        } while (after);

        serverCache.set(id, allServers);

        res.json({ success: true, servers: allServers });
    } catch (error) {
        console.error('Error fetching user servers:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch servers' });
    }
});

// * Route: Fetch Specific Guild
app.get("/api/auth/guilds/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { access_token } = req.user;

    try {
        const response = await axios.get(
            `https://discord.com/api/v10/guilds/${id}`,
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );

        const guild = response.data;
        const managePermission = (guild.permissions & 0x20) === 0x20;

        res.json({
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            canManage: managePermission,
        });
    } catch (error) {
        console.error("Error fetching guild by ID:", error);
        res.status(400).json({
            success: false,
            message: "Failed to fetch guild or insufficient permissions.",
        });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));