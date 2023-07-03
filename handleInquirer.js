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
    }}