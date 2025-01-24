const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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
    done(null, profile); // Send user profile to the next middleware
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

    // Generate JWT
    const token = jwt.sign({
        username: user.username,
        id: user.id,
        avatar: user.avatar,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true, // Ensure this is true for HTTPS
        sameSite: 'None', // Adjust based on your frontend/backend configuration
        maxAge: 3600000, // 1 hour
    });

    // Redirect with the token as a query parameter
    const redirectUrl = `https://jaynightmare.github.io/TALE-FYP/screens/homepage/index.html`;
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
app.get('/api/auth/status', (req, res) => {
    const token = req.cookies?.auth_token; // Retrieve the cookie
    if (!token) {
        console.log('No token provided');
        return res.json({ loggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify token
        console.log('Decoded token:', decoded);

        res.json({
            loggedIn: true,
            username: decoded.username,
            avatar: decoded.avatar,
            id: decoded.id,
        });
    } catch (err) {
        console.error('Token verification failed:', err);
        res.json({ loggedIn: false });
    }
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
