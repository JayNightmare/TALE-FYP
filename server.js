const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();

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

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));