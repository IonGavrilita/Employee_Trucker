//Dependencies found here
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
require("dotenv").config()

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  runStart();
});


function runStart() {
  inquirer
    .prompt({
      name: "option",
      type: "list",
      message: "What would you like to choose?",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View departments",
        "View roles",
        "View employees",
        "Update employee role",
        "Remove department",
        "Remove employee",
        "Remove role",
        "Quit"
      ],
     
    })
    .then(function(result) {
      console.log("You entered: " + result.option);

      switch (result.option) {
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "View departments":
          viewDepartment();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "Update employee role":
          updateEmployee();
          break;
        case "Remove department":
          removeDepartment();
          break;
        case "Remove employee":
          removeEmployee();
          break;
        case "Remove role":
            removeRole();
          break;
        default:
          quit();
      }
    });
}




function addDepartment() {

    inquirer.prompt({
      
        type: "input",
        message: "Enter department name?",
        name: "deptName"

    }).then(function(answer){



        connection.query("INSERT INTO department (name) VALUES (?)", [answer.deptName] , function(err, res) {
            if (err) throw err;
            console.table(res)
            runStart()
    })
    })
}


function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What's the name of the role?",
        name: "roleName"
      },
      {
        type: "input",
        message: "What is the salary for this role?",
        name: "salary"
      },
      {
        type: "input",
        message: "What is the department id number?",
        name: "deptID"
      }
    ])
    .then(function(answer) {


      connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salary, answer.deptID], function(err, res) {
        if (err) throw err;
        console.table(res);
        runStart();
      });
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What's the first name of the employee?",
        name: "FirstName"
      },
      {
        type: "input",
        message: "What's the last name of the employee?",
        name: "LastName"
      },
      {
        type: "input",
        message: "What is the employee's role id number?",
        name: "roleID"
      },
      {
        type: "input",
        message: "What is the manager id number?",
        name: "managerID"
      }
    ])
    .then(function(answer) {

      
      connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.FirstName, answer.LastName, answer.roleID, answer.managerID], function(err, res) {
        if (err) throw err;
        console.table(res);
        runStart();
      });
    });
}



function updateEmployee() {
  connection.query("SELECT id, first_name, last_name FROM employee;", function (err, res) {
      if (err) throw err;
      const array1 = res.map(array => {
          var object = {
              name: `${array.first_name} ${array.last_name}`,
              value: array.id
          }
          return object
      });
      inquirer.prompt({
          name: "update",
          type: "list",
          message: "Choose an employee to update",
          choices: array1
      })
          .then(function (response) {
              connection.query("SELECT id, title FROM role;", function (err, res) {
                  if (err) throw err;
                  const map2 = res.map(array => {
                      var object = {
                          name: array.title,
                          value: array.id
                      }
                      return object
                  });
                  inquirer.prompt({
                      name: "roleUpdate",
                      type: "list",
                      message: "What is the employee's new role?",
                      choices: map2
                  }).then(function (answer) {
                      let values = [answer.roleUpdate, response.update];
                      connection.query("UPDATE employee SET role_id = ? WHERE id=?", values, function (err, res) {
                          if (err) throw err;

                          connection.query("SELECT * FROM employee WHERE id=?", response.update, function (err, res) {
                              if (err) throw err;
                              console.table(res);
                              runStart();
                          }
                          );
                      })
                  })
              })
          })
  });
};


function viewDepartment() {
  let query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    runStart();
  });
}

function viewRoles() {
  let query = "SELECT * FROM role";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    runStart();
  });
}

function viewEmployees() {
  let query = "SELECT * FROM employee";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    runStart();
  });
}

function removeDepartment() {
    connection.query("SELECT id, name FROM department;", function (err, res) {
        if (err) throw err;
        const array1 = res.map(array => {
            var object = {
                name: `${array.name}`,
                value: array.id
            }
            return object
        });
        inquirer.prompt({
            name: "delete",
            type: "list",
            message: "Choose department to delete",
            choices: array1
        })
            .then(function (response) {
                connection.query("DELETE FROM department WHERE id=?;", [response.delete], function (err, res) {
                    if (err) throw err;
                    runStart();
                }
                );
            })
    })
};

function removeRole() {
    connection.query("SELECT id, title FROM role;", function (err, res) {
        if (err) throw err;
        const array1 = res.map(array => {
            var object = {
                name: `${array.title}`,
                value: array.id
            }
            return object
        });
        inquirer.prompt({
            name: "delete",
            type: "list",
            message: "Choose role to delete",
            choices: array1
        })
            .then(function (response) {
                connection.query("DELETE FROM role WHERE id=?;", [response.delete], function (err, res) {
                    if (err) throw err;
                    runStart();
                }
                );
            })
    })
};

function removeEmployee() {
    connection.query("SELECT id, first_name, last_name FROM employee;", function (err, res) {
        if (err) throw error;
        const array1 = res.map(array => {
            var object = {
                name: `${array.first_name} ${array.last_name}`,
                value: array.id
            }
            return object
        });
        inquirer.prompt({
            name: "delete",
            type: "list",
            message: "Choose employee to delete",
            choices: array1
        })
            .then(function (response) {
                connection.query("DELETE FROM employee WHERE id=?;", [response.delete], function (err, res) {
                    if (err) throw err;
                    runStart();
                });

            });
    });
};

function quit() {
  connection.end();
  process.exit();
}