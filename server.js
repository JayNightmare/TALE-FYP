const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors');
require('dotenv').config();

const app = express();

// Session Configuration
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

// CORS for GitHub Pages
app.use(cors({
    origin: 'https://jaynightmare.github.io', // GitHub Pages base URL
    credentials: true,
}));

// Passport Configuration
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

// Route: Initiate Discord Login
app.get('/auth/discord', passport.authenticate('discord'));

// Route: Handle Callback and Redirect to GitHub Pages
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: 'https://jaynightmare.github.io/TALE-FYP/screens/homepage-no-account/index.html', // Redirect to "log in" page on failure
}), (req, res) => {
    const user = req.user;

    // Send user info to the "logged in" page via query parameters
    const redirectUrl = `https://jaynightmare.github.io/TALE-FYP/screens/homepage-logged-in/index.html?username=${user.username}&id=${user.id}&avatar=${user.avatar}`;
    res.redirect(redirectUrl);
});

// Route: Logout
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('https://jaynightmare.github.io/TALE-FYP/screens/homepage-no-account/index.html'); // Redirect back to "log in" page
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
