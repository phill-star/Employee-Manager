const mysql = require('mysql2');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    multipleStatements: true,
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "Anil2020",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update employee role",
                "Exit"
            ]
        })
        .then(function(answer) {
            if (answer.action === 'View all departments') {
                viewDepartments();
            } else if (answer.action === 'View all roles') {
                viewRoles();
            } else if (answer.action === 'View all employees') {
                viewEmployees();
            } else if (answer.action === 'Add a department') {
                addDepartment();
            } else if (answer.action === 'Add a role') {
                addRole();
            } else if (answer.action === 'Add an employee') {
                addEmployee();
            } else if (answer.action === 'Update employee role') {
                updateRole();
            } else if (answer.action === 'Exit') {
                connection.end();
            }
        })
}

function viewDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
        console.log(`DEPARTMENTS:`)
        res.forEach(department => {
            console.log(`ID: ${department.id} | Name: ${department.name}`)
        })
        start();
    });
};

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
        console.log(`ROLES:`)
        res.forEach(role => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
        })
        start();
        
    });
};

function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function(err, res) {
        console.log(`EMPLOYEES:`)
        res.forEach(employee => {
            console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        })
        start();
    });
};

function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What is the name of this department?",
        })
        .then(function(answer) {
            var query = "INSERT INTO department (name) VALUES ( ? )";
            connection.query(query, answer.department, function(err, res) {
                console.log(`You have added this department: ${(answer.department).toUpperCase()}.`)
            })
            viewDepartments();
        })
}
// ...

// Add these options to your main menu prompt choices
"Edit a department",
"Delete a department",

// Function to handle editing a department
async function editDepartment() {
    connection.query('SELECT * FROM department', function(err, result) {
        if (err) throw err;

        inquirer
            .prompt({
                name: "departmentToEdit",
                type: "list",
                message: "Which department would you like to edit?",
                choices: result.map(department => department.name),
            })
            .then(function(answer) {
                const departmentToEdit = answer.departmentToEdit;

                inquirer
                    .prompt({
                        name: "newName",
                        type: "input",
                        message: "Enter the new name for the department:",
                    })
                    .then(function(updateAnswer) {
                        const newName = updateAnswer.newName;

                        connection.query(
                            "UPDATE department SET name = ? WHERE name = ?",
                            [newName, departmentToEdit],
                            function(err, res) {
                                if (err) throw err;
                                console.log(`Department '${departmentToEdit}' updated to '${newName}'.`);
                                viewDepartments();
                            }
                        );
                    });
            });
    });
}

// Function to handle deleting a department
async function deleteDepartment() {
    connection.query('SELECT * FROM department', function(err, result) {
        if (err) throw err;

        inquirer
            .prompt({
                name: "departmentToDelete",
                type: "list",
                message: "Which department would you like to delete?",
                choices: result.map(department => department.name),
            })
            .then(function(answer) {
                const departmentToDelete = answer.departmentToDelete;

                inquirer
                    .prompt({
                        name: "confirmation",
                        type: "confirm",
                        message: `Are you sure you want to delete '${departmentToDelete}' department?`,
                    })
                    .then(function(confirmAnswer) {
                        if (confirmAnswer.confirmation) {
                            connection.query(
                                "DELETE FROM department WHERE name = ?",
                                [departmentToDelete],
                                function(err, res) {
                                    if (err) throw err;
                                    console.log(`Department '${departmentToDelete}' deleted.`);
                                    viewDepartments();
                                }
                            );
                        } else {
                            console.log("Deletion canceled.");
                            viewDepartments();
                        }
                    });
            });
    });
}

// ...

function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw (err);
        inquirer
            .prompt([{
                    name: "title",
                    type: "input",
                    message: "What is the title of this role?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary of this role?",
                },
                {
                    name: "departmentName",
                    type: "list",
                    message: "Which department is this role in?",
                    choices: function() {
                        var choicesArray = [];
                        res.forEach(res => {
                            choicesArray.push(
                                res.name
                            );
                        })
                        return choicesArray;
                    }
                }
            ])

        .then(function(answer) {
            const department = answer.departmentName;
            connection.query('SELECT * FROM DEPARTMENT', function(err, res) {

                if (err) throw (err);
                let filteredDept = res.filter(function(res) {
                    return res.name == department;
                })
                let id = filteredDept[0].id;
                let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                let values = [answer.title, parseInt(answer.salary), id]
                console.log(values);
                connection.query(query, values,
                    function(err, res, fields) {
                        console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
                    })
                viewRoles()
            })
        })
    })
}

async function addEmployee() {
    connection.query('SELECT * FROM role', function(err, result) {
        if (err) throw (err);
        connection.query("SELECT * FROM employee", function(err, res) {
            if (err) throw (err);
            inquirer
                .prompt([{
                        name: "firstName",
                        type: "input",
                        message: "What is the employee's first name?",
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "What is the employee's last name?",
                    },
                    {
                        name: "roleName",
                        type: "list",
                        message: "What role does the employee have?",
                        choices: function() {
                            rolesArray = [];
                            result.forEach(result => {
                                rolesArray.push(result.title);
                            })
                            return rolesArray;
                        }
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the employee's manager?",
                        choices: function() {
                            managersArray = [];
                            res.forEach(manager => {
                                managersArray.push(manager.last_name);
                            });
                            // Add an option for no manager
                            managersArray.push("None");
                            return managersArray;
                        }
                    }
                ])
                .then(function(answer) {
                    console.log(answer);
                    const role = answer.roleName;
                    const manager = answer.manager;
                
                    // Find the role ID based on the selected role
                    const selectedRole = result.find(roleObj => roleObj.title === role);
                    const roleId = selectedRole.id;
                
                    // Find the manager ID based on the selected manager
                    const selectedManager = res.find(managerObj => managerObj.last_name === manager);
                    const managerId = selectedManager ? selectedManager.id : null;
                
                    // Insert the employee into the database
                    const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    const values = [answer.firstName, answer.lastName, roleId, managerId];
                
                    connection.query(query, values, function(err, res) {
                        if (err) throw err;
                        console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`);
                        viewEmployees();
                    });
                });
                
        });
    });
}


function updateRole() {
    connection.query('SELECT * FROM employee', function(err, result) {
        if (err) throw (err);
        inquirer
            .prompt([{
                name: "employeeName",
                type: "list",
                message: "Which employee's role is changing?",
                choices: function() {
                    employeeArray = [];
                    result.forEach(result => {
                        employeeArray.push(
                            result.last_name
                        );
                    })
                    return employeeArray;
                }
            }])
            
            .then(function(answer) {
                console.log(answer);
                const name = answer.employeeName;
                connection.query("SELECT * FROM role", function(err, res) {
                    inquirer
                        .prompt([{
                            name: "role",
                            type: "list",
                            message: "What is their new role?",
                            choices: function() {
                                rolesArray = [];
                                res.forEach(res => {
                                    rolesArray.push(
                                        res.title)
                                })
                                return rolesArray;
                            }
                        }])
                        
                        .then(function(rolesAnswer) {
                            const role = rolesAnswer.role;
                            console.log(rolesAnswer.role);
                            connection.query('SELECT * FROM role WHERE title = ?', [role], function(err, res) {
                                if (err) throw (err);
                                let roleId = res[0].id;
                                let query = "UPDATE employee SET role_id = ? WHERE last_name = ?";
                                let values = [roleId, name]; // corrected '=' and added ';' at the end
                                console.log(values);
                                connection.query(query, values, function(err, res, fields) {
                                    if (err) throw err;
                                    console.log(`You have updated ${name}'s role to ${role}.`);
                                    viewEmployees();
                                });
                            });
                        });
                });
            });
    });
}
