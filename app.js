require('dotenv').config();
const path = require('path');
const fs = require('fs');
const colors = require("colors");

// (Before of all:) Check the enviroment configuration for avoid errors
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
    console.error("[!] You need to configure the project with a .env file.");
    process.exit(1);
}

/********** Configuration *********/
const express = require('express');
const layouts = require("express-ejs-layouts");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, 'public')));

// Expose a flag to views to switch between Vite dev and built assets
app.locals.isDev = process.env.VITE_DEV === 'true';
app.locals.viteUrl = process.env.VITE_URL || 'http://localhost:5173';

// Layout
app.use(layouts);
app.set('layout', path.join(__dirname, 'views/layout'));
// app.set('layout extractStyles', true);
// app.set('layout extractScripts', true);

// Template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Controllers
const authController = require('./controllers/authController');

/********** Routes **********/
app.get("/", function (req, res) {
    res.render("index", { title: "Home" });
});

// Auth
app.get("/register", authController.showRegister);
app.post("/register", authController.handleRegister);
app.get("/login", authController.showLogin);
app.post("/login", authController.handleLogin);

// Start server
app.listen(PORT, function () {
    console.log("[".magenta + "*".blue + "]".magenta + ` Server is running on: http://localhost:${PORT}`.rainbow);
});