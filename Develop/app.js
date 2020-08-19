const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

const promptUser = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Input Employee Name"
        },
        {
            type: "input",
            name: "id",
            message: "Employee Identification Number: "
        },
        {
            type: "input",
            name: "email",
            message: "Employee Email: "
        },
        {
            type: "list",
            name: "role",
            message: "Employee Role: ",
            choices: ["Engineer", "Intern", "Manager"]
        },
        {
            type: "input",
            name: "officeNumber",
            message: "Manager Office Number: ",
            when: (answer) => answer.role === "Manager"
        },
        {
            type: "input",
            name: "github",
            message: "Employee Github Username: ",
            when: (answer) => answer.role === "Engineer"
        },
        {
            type: "input",
            name: "school",
            message: "Intern School: ",
            when: (answer) => answer.role === "Intern"
        },
    ]).then(function(content) {
        console.log(content);
        addEmployee();

        switch(content.role) {
            case "Manager":
                const addManager = new Manager(
                    content.name,
                    content.id,
                    content.email,
                    content.officeNumber,
                )
                employees.push(addManager);
                break;
                case "Engineer":
                    const addEngineer = new Engineer(
                        content.name,
                        content.id,
                        content.email,
                        content.github,
                    )
                    employees.push(addEngineer);
                    break;
                    case "Intern":
                        const addIntern = new Intern(
                            content.name,
                            content.id,
                            content.email,
                            content.school,
                        )
                        employees.push(addIntern);
                        break;
        }
    });
};

const addEmployee = () => {
    inquirer.prompt(
        {
            type: "confirm",
            name: "add",
            message: "Got More Employees?",
        }
    ).then(function(answer) {
        if (answer.add === true) {
            promptUser();
        }
        else {
            fs.writeFile(outputPath, render(employees), function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Congrats! You added all your employees to the team.");
                console.log("Our Team: ", employees);
            })
        }
    })
}

promptUser();