const fs = require('fs');
const path = require('path');
const express = require('express');
var colors = require("colors");

// (Before of all:) Check the enviroment configuration for avoid errors
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
    console.error("[!] You need to configure the project with a .env file.");
    process.exit(1);
}

// Configuration
const app = express();
const PORT = process.env.port || 3000;

// Template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", function (req, res) {
    res.render("index", { title: "Home" });
});

// Start server
app.listen(PORT, function () {
    console.log("[".magenta + "*".blue + "]".magenta + ` Server is running on: http://localhost:${PORT}`.rainbow);
});