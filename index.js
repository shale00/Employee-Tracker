// Packages needed for this application
const inquirer = require('inquirer');
const questions = require('./lib/questions');
const logo = require("asciiart-logo");
const db = require("./db");

init();

//Display logo text, load prompts
function init() {
    const logoText = logo({ name: "Employee Tracker" }).render();

    console.log(logoText);

    loadMainPrompts();
}


// Inquirer module to prompt user
inquirer.prompt(questions)