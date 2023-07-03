const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the ' + process.env.DB_NAME + ' database.');
});

const userOptions = () => {
    return inquirer.prompt([
      {
        name: 'optionTree',
        message: 'What do you want to do?',
        type: 'list',
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Remove an Employee",
          "Exit"
        ]
      },
    ]);
  };

  const addDepartment = () => {
  return inquirer.prompt([
    {
      name: 'depName',
      message: 'What is the name of the department?',
      type: 'input',
    },
  ]);
};

const addRole = () => {
    return inquirer.prompt([
      {
        name: 'roleName',
        message: 'What is the name of this role?',
        type: 'input',
      },
      {
        name: 'salary',
        message: 'What is the hourly salary of this role?',
        type: 'number',
      },
      {
        name: 'depName',
        message: "What is this role's department ID?",
        type: 'number',
      },
    ]);
  };


const addEmployee = () => {
    return inquirer.prompt([
      {
        name: 'firstName',
        message: 'What is their first name?',
        type: 'input',
      },
      {
        name: 'lastName',
        message: 'What is their last name?',
        type: 'input',
      },
      {
        name: 'roleName',
        message: 'What is their role ID?',
        type: 'number',
      },
      {
        name: 'managerName',
        message: "What is their manager's ID?",
        type: 'number',
      },
      {
        name: 'depName',
        message: 'What is their department ID?',
        type: 'number',
      },
    ]);
  };

  const updateEmployee = () => {
    return inquirer.prompt([
      {
        name: 'employeeSelection',
        message: 'Select employee to update via ID',
        type: 'number',
      },
      {
        name: 'newRole',
        message: 'What is their new role ID?',
        type: 'number',
      },
      {
        name: 'managerSelection',
        message: "What is their new manager's employee ID",
        type: 'number',
      },
      {
        name: 'newDep',
        message: 'What is their new department ID?',
        type: 'number',
      },
    ]);
  };
  
  const removeEmployee = () => {
  return inquirer.prompt([
    {
      name: 'employeeSelection',
      message: 'Select employee to remove via ID',
      type: 'number',
    },
    {
      name: 'confirmDelete',
      message: 'Are you sure you want to remove this employee?',
      type: 'confirm',
    },
  ]);
};

const optionHandler = async () => {
    let input = await userOptions();
    switch (input.optionTree) {
      case "View all Departments":
        db.query('SELECT * FROM department_table', function (err, results) {
          if (err) {
            console.log(err);
          }
          console.table(results);
        });
        break;

        case "View all Roles":
            db.query('SELECT role_table.id AS role_id, role_table.role_name AS role_name, role_table.salary AS salary, department_table.department_name AS department_name FROM role_table JOIN department_table ON role_table.department_id = department_table.id', function (err, results) {
              if (err) {
                console.log(err);
                }
              console.table(results);
            });
            break;

        case "View all Employees":
            db.query('SELECT employee_table_1.id AS employee_id, employee_table_1.first_name AS first_name, employee_table_1.last_name AS last_name, role_table.role_name AS role_name, role_table.salary AS salary, department_table.department_name AS department_name, employee_table.first_name AS mngr_1st_name, employee_table.last_name AS mngr_last_name FROM employee_table AS employee_table_1 JOIN role_table ON employee_table_1.role_id = role_table.id JOIN department_table ON employee_table_1.department_id = department_table.id LEFT OUTER JOIN employee_table ON employee_table_1.manager_id = employee_table.id;', function (err, results) {
              if (err) {
                console.log(err);
                }
                console.table(results);
            });
            break;
                
        case "Add a Department":
            let addNewDepartment = await addDepartment();
            db.query(`INSERT INTO department_table (department_name) VALUES ("${addNewDepartment.depName}")`, function (err, results) {
              if (err) {
                console.log(err);
                }
                console.table(results);
            })
            break;

        case "Add a Role":
           let addNewRole = await addRole();
            db.query(`INSERT INTO role_table (role_name, salary, department_id) VALUES ("${addNewRole.roleName}", ${addNewRole.salary}, ${addNewRole.depName})`, function (err, results) {
              if (err) {
                console.log(err);
                }
                console.table(results);
            });
            break;

        case "Add an Employee":
            let addNewEmployee = await addEmployee();
            db.query(`INSERT INTO employee_table (first_name, last_name, manager_id, role_id, department_id) VALUES ("${addNewEmployee.firstName}", "${addNewEmployee.lastName}", ${addNewEmployee.managerName}, ${addNewEmployee.roleName}, ${addNewEmployee.depName})`, function (err, results) {
              if (err) {
                console.log(err);
                }
                console.table(results);
            });
            break;      
    }}