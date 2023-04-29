// Packages needed for this application
const inquirer = require('inquirer');
const questions = require('./lib/questions');


// Inquirer module to prompt user
inquirer.prompt(questions)