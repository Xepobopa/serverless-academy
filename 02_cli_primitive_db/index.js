import inquirer from 'inquirer';
import * as fs from "fs/promises";

// ask user his name. Return an object with 'name' field that contains user input
async function getName() {
    return inquirer.prompt([
        {
            name: 'name',
            message: 'Enter your first name (Press ENTER to cancel): ',
            type: 'input',
            validate: (name) => {
                // error is user input contains numbers
                if (!isNaN(name) && name !== "") {
                    return 'Please provide a valid name without numbers';
                }

                return true;
            },
            // removes whitespaces from user input
            filter: (name) => {
                return name.trim();
            }
        }
    ])
}

// ask user if he would like to search. If not - exit
async function getUserSubmit() {
    return inquirer.prompt([
        {
            name: "next",
            message: "Search users name? ",
            type: "confirm",
        }
    ])
}

// ask user for a name to search
async function findUserDb() {
    return inquirer.prompt([
        {
            name: "name",
            message: "Enter user name you want to search: ",
            type: "input",
            validate: (name) => {
                // user must enter some data
                if (name === "") {
                    return "Enter user name";
                }
                // user input can't contain numbers
                if (!isNaN(name)) {
                    return 'Please provide a valid name without numbers';
                }

                return true;
            },
            // removes whitespaces from user input
            filter: (name) => {
                return name.trim();
            }
        }
    ])
}

// ask user his gender and age
async function getUserInfo() {
    return inquirer.prompt([
        {
            name: 'gender',
            message: 'Choose your gender: ',
            type: 'list',
            choices: ['Male', 'Female']
        },
        {
            name: 'age',
            message: 'Enter your age: ',
            type: 'input',
            validate: (age) => {
                // user must enter some data
                if(!age) {
                    return "Please enter your age";
                }
                // user's age can't be less than 0 and bigger than 100 (in common)
                if (age < 1 || age > 100) {
                    return "Be honest!";
                }
                // user must enter only numbers
                if(isNaN(age)) {
                    return "Please enter a valid age";
                }

                return true;
            },
        },
    ]);
}

// write user data to file in json format
function writeUser(user, filename) {
    fs.writeFile(
        filename,
        JSON.stringify(user),
        { flag: 'w+' }
    );
}

// read users from file
async function readDb(filename) {
    return await fs.readFile(filename, { flag: 'r', encoding: 'utf8' })
}

// init database
let db;
// get users from file
const jsonFromFile = await readDb('data.txt');
// if file is empty, create empty db else fill db by data from file
try {
    jsonFromFile === "" ? db = [] : db = JSON.parse(jsonFromFile);
} catch (e) {
    // if json can't parse file, create empty db
    db = [];
}

let userName;
while (true) {
    // get user name
    userName = await getName();
    if (!userName.name) { // if user pressed ENTER
        // ask user if he would like to search users
        const submission = await getUserSubmit();
        if (!submission.next){
            console.log("Bye!")
            process.exit();
        }

        // show db
        console.log(db);
        // search user by name
        const findUser = await findUserDb();
        const user = db.find(user => user.name.toLocaleLowerCase() === findUser.name.toLocaleLowerCase())
        if (!user) {
            console.log("\nCan't find user in db!")
            process.exit();
        }

        console.log("Your user: ", user);
        process.exit();
    }
    else {
        // save user
        const userInfo = await getUserInfo();
        db.push({...userName, ...userInfo});
        writeUser(db, "data.txt");
    }
}
