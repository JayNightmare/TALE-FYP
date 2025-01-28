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

// * Route: Check Auth Status
app.get('/api/auth/status', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({ loggedIn: false });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        if (!decoded.access_token) {
            console.error('Access token is missing in the decoded JWT');
            return res.json({ loggedIn: false });
        }

        const discordResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${decoded.access_token}`,
            },
        });

        const guilds = discordResponse.data;

        res.json({
            loggedIn: true,
            username: decoded.username,
            avatar: decoded.avatar,
            id: decoded.id,
            guilds: guilds,
        });
    } catch (err) {
        console.error('Error:', err);
        res.json({ loggedIn: false });
    }
});

app.get('/api/auth/guilds', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        const discordResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${decoded.access_token}`,
            },
        });

        const guilds = discordResponse.data;

        // Filter guilds where the user has Manage Server permission
        const manageServerGuilds = guilds.filter(guild => (guild.permissions & 0x20) === 0x20);

        res.json({ guilds: manageServerGuilds });
    } catch (err) {
        console.error('Error fetching guilds:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/server/:serverId', async (req, res) => {
    const { serverId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user's guilds to verify access
        const discordResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${decoded.access_token}`,
            },
        });

        const guilds = discordResponse.data;
        const guild = guilds.find(g => g.id === serverId);

        if (!guild) {
            return res.status(403).json({ success: false, message: 'You do not have access to this server.' });
        }

        res.json({ success: true, serverName: guild.name });
    } catch (error) {
        console.error('Error fetching server info:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
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
                params: { limit: 100, after },
            });

            const servers = response.data;

            const manageableServers = servers.filter(server =>
                (server.permissions & 0x20) === 0x20
            );

            allServers = allServers.concat(manageableServers);

            after = servers.length > 0 ? servers[servers.length - 1].id : null;
        } while (after); // Stop when no more servers

        serverCache.set(id, allServers);

        res.json({ success: true, servers: allServers });
    } catch (error) {
        console.error('Error fetching user servers:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch servers' });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));