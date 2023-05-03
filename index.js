// Packages needed for this application
const { prompt } = require('inquirer');
const logo = require("asciiart-logo");
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      port: process.env.PORT || 3306,
      user: 'root',
      password: 'REDACTED',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

db.connect((err) => {
    if (err) throw err;
});

//Display logo text, load prompts
function init() {
    const logoText = logo({ name: "Employee Tracker" }).render();

    console.log(logoText);

    loadMainPrompt();
};


//Recursive Main Prompt function
const loadMainPrompt = async () => {
    prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View All Employees', 'Quit']
        }
    ]).then(answer => {
        switch (answer.choice) {
            case 'Add Employee':
                addEmployeePrompt();
                break;
            case 'Update Employee Role':
                updateEmployeeRolePrompt();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRolePrompt();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add Department':
                addDepartmentPrompt();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Quit':
                return;
        }
    })
};

//Get functions
const viewAllRoles = async () => {
    try {
        const [rows] = await db.promise().query('SELECT title FROM role');
        const roleTitles = rows.map(row => row.title);
        return roleTitles;
    } catch (err) {
        throw err;
      }
}

// const viewAllManagers = async () => {
//     try {
//         const [rows, fields] = await db.promise().query('SELECT * FROM employee WHERE manager_id IS NULL');
//         const managerArr = rows.map(row => (row.first_name + ' ' + row.last_name));
//         managerArr.push('None');
//         return managerArr;
//     } catch (err) {
//         throw err;
//     }
// }

const viewAllEmployees = async () => {
    try {
        const [rows, fields] = await db.promise().query('SELECT * FROM employee');
        const employeeArr = rows.map(row => (row.first_name + ' ' + row.last_name));
        return employeeArr;
    } catch (err) {
        throw err;
    }
}

const viewAllEmployeeID = async () => {
    try {
        const [rows, fields] = await db.promise().query('SELECT * FROM employee');
        const employeeID = rows.map(row => (row.id));
        return employeeID;
    } catch (err) {
        throw err;
    }
}


//Nested question prompt functions

const addEmployeePrompt = async () => {
    const roles = await db.promise().query('SELECT title AS name, id AS value FROM role');
    const employees = await db.promise().query('SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee')
    const managerArr = employees[0];
    managerArr.push({value: null, name: 'None'});
    const answers = await prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employee’s first name?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a first name.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employee’s last name?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a last name.');
                    return false;
                }
            } 
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the employee’s role?',
            choices: roles[0]
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the employee’s manager?',
            choices: managerArr
        }
    ]);
        // const sql = 'INSERT INTO employee SET ?';
        // const roleTitles = await viewAllRoles();
        // const roleID = roleTitles.indexOf(answers.role) + 1
        // // const [managerID] = await db.execute('SELECT manager_id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?', [answers.manager]);
        // const managers = await viewAllManagers();
        // const managerID = managers.indexOf(answers.manager) +1
        // const [result] = await db.promise().query('SELECT COUNT(*) FROM employee');
        // const employeeID = parseInt(result[0].count) + 1;

        await db.promise().query('INSERT INTO employee SET ?', answers);
        // , (err) => {
        //     if (err) throw err;
            console.table(answers)
            loadMainPrompt();
        // }
        // )
}


//Get functions
// async function getRoles() {
//     const sql = `SELECT title AS role FROM employees_db.role`;

//     db.query(sql, function (err, results) {
//         return results;
//     });
// }

//Function to initialize app
init();