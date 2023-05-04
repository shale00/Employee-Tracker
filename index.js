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


//Main Prompt function
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
// const viewAllRoles = async () => {
//     try {
//         const [rows] = await db.promise().query('SELECT title FROM role');
//         const roleTitles = rows.map(row => row.title);
//         return roleTitles;
//     } catch (err) {
//         throw err;
//       }
// }


//Get and join functions
const viewAllEmployees = async () => {
    // try {
    //     const [rows, fields] = await db.promise().query('SELECT * FROM employee');
    //     const employeeArr = rows.map(row => (row.first_name + ' ' + row.last_name));
    //     return employeeArr;
    // } catch (err) {
    //     throw err;
    // }

    const allEmployees = await db.promise().query('SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(mgr.first_name, " ", mgr.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee mgr ON employee.manager_id = mgr.id');
    //join employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    //SELECT employy
    console.table(allEmployees[0]);
    loadMainPrompt();
}

const employeeList = async () => {
    const employees = await db.promise().query('SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee');
    const employeeArr = employees[0];
    employeeArr.push({value: null, name: 'None'});
    return employeeArr;
}

const roleList = async () => {
    const roles = await db.promise().query('SELECT title AS name, id AS value FROM role');
    return roles[0];
}

// const viewAllEmployeeID = async () => {
//     try {
//         const [rows, fields] = await db.promise().query('SELECT * FROM employee');
//         const employeeID = rows.map(row => (row.id));
//         return employeeID;
//     } catch (err) {
//         throw err;
//     }
// }


//Nested question prompt functions
const addEmployeePrompt = async () => {
    // const roles = await db.promise().query('SELECT title AS name, id AS value FROM role');
    // const employees = await db.promise().query('SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee')
    // const employeeArr = employees[0];
    // employeeArr.push({value: null, name: 'None'});
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
            choices: roleList
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the employee’s manager?',
            choices: employeeList
        }
    ]);
        await db.promise().query('INSERT INTO employee SET ?', answers);
            viewAllEmployees();
};

const updateEmployeeRolePrompt = async () => {
    const answers = await prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Which employee’s role do you want to update?',
            choices: employeeList
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the employee’s role?',
            choices: roleList
        }
    ]);
        await db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.id]);
            viewAllEmployees();
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