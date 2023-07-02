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