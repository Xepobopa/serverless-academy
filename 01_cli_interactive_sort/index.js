// init readline module to read data from console
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'How would you like to sort an array?\n' +
        '1. Sort words alphabetically\n' +
        '2. Show numbers from lesser to greater\n' +
        '3. Show numbers from bigger to smaller\n' +
        '4. Display words in ascending order by number of letters in the word\n' +
        '5. Show only unique words\n' +
        '6. Display only unique values from the set of words and numbers entered by the user\n' +
        'Enter "exit" to terminate the program\n' +
        'Select (1 - 6) and press ENTER: ',
});

// return a new array without any numbers
function removeDigits(arr) {
    const newArr = [];
    for (const elem of arr) {
        if (isNaN(elem))
            newArr.push(elem);
    }
    return newArr;
}

// return a new array without any letters
function removeLetters(arr) {
    const newArr = [];
    for (const elem of arr) {
        if (!isNaN(elem))
            newArr.push(elem);
    }
    return newArr;
}

// where words are collected
let words = [];
// ask user to input words separated by spaces
rl.question("Enter your words split : ", userWords => {
    words = userWords.split(' ');
    console.log(words);
    rl.prompt();
});

// a listener that execute sorting by command (index)
rl.on('line', (line) => {
    switch (line) {
        case "1":
            console.log(removeDigits(words).sort());
            break;
        case "2":
            console.log(removeLetters(words).sort());
            break;
        case "3":
            console.log(removeLetters(words).sort().reverse());
            break;
        case "4":
            console.log(removeDigits(words).sort((a, b) => b.length - a.length));
            break;
        case "5":
            console.log([...new Set(removeDigits(words))]);
            break;
        case "6":
            console.log([...new Set([...words])]);
            break;
        case "exit":
            rl.close();
            process.exit(0);
            break;
        default:
            console.log('Unknown command!')
            break;
    }
    console.log()

    rl.prompt();
}).on('close', () => { // exit when rl is closed and say goodbye
    console.log('\nHave a great day!');
    process.exit(0);
});
