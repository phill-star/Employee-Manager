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