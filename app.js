const fs = require('fs');
const path = require('path');
const express = require('express');
const layouts = require("express-ejs-layouts");
var colors = require("colors");
require('dotenv').config();

// (Before of all:) Check the enviroment configuration for avoid errors
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
    console.error("[!] You need to configure the project with a .env file.");
    process.exit(1);
}

// Configuration
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
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