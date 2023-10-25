// NOTE
// When using send-photo command, deprecated warning shown.
// To solve this problem, uncomment two lines below
// process.env.NTBA_FIX_319 = 1;
// process.env.NTBA_FIX_350 = 0;

import { createInterface } from 'readline';
import * as fs from 'fs/promises';
import {program}  from 'commander';
import TelegramBot from 'node-telegram-bot-api';

const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

// token and chatid from credentials.json file
let credentials = [];

// get token and init bot
await getCredentials('credentials.json');
if (!credentials.TELEGRAM_TOKEN) {
    throw new Error("Can't find token in 'credentials.json'!\nAdd '{\"TELEGRAM_TOKEN\":\"Enter your token\"}' in file");
}
const token = credentials.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});

// return an object with TELEGRAM_TOKEN and CHAT_ID (may be empty)
async function getCredentials(filename) {
    try {
        const credString = await fs.readFile(filename, 'utf-8');
        credentials = JSON.parse(Buffer.from(credString).toString());
    } catch (e) {
        console.log("Can't find file 'credentials.json' or this file invalid / empty\nAdd '{\"TELEGRAM_TOKEN\":\"TOKEN\"}' in file");
        process.exit();
    }
}

// argument credentials is an array that will be saved in cred file
async function setCredentials(filename, credentials) {
    try {
        await fs.writeFile(filename, JSON.stringify(credentials));
    } catch (e) {
        console.log(e);
        process.exit();
    }
}

program
    .name('Save notes')
    .description('Send messages to the telegram bot')
    .version('1.0.0');

// add 'send-message' command
program.command('send-message')
    .description('Send a provided string to the telegram bot')
    .argument('<string>', 'string to send')
    .action(async (str, option) => {
        // get chat id from credentials
        const chatId = credentials.CHAT_ID;

        // check chat id
        if (!chatId) {
            throw new Error("ChatId is not saved or can't find 'credentials.json' file.\nUse 'start-bot' command to save a chatId");
        }

        // send message to bot
        await bot.sendMessage(chatId, str);
        console.log(`Sent message: '${str}'`);
        process.exit();

    });

// add 'send-message' command
program.command('send-photo')
    .description('Send a photo to your chat with a telegram bot')
    .argument('<string>', 'Path to the photo')
    .action(async (str, option) => {
        // get chat id from credentials
        const chatId = credentials.CHAT_ID;

        // check chat id
        if (!chatId) {
            throw new Error("ChatId is not saved or can't find 'credentials.json' file.\nUse 'start-bot' command to save a chatId");
        }

        // send photo to bot
        await bot.sendPhoto(chatId, str);
        console.log(`Photo has sent!`);
        process.exit();
    });

// add 'start-bot' command. Start a bot to save chat id
program.command("start-bot")
    .description("Start bot so you can enter '/start' and get chatId from bot")
    .action(() => {
        bot.on('message', async (msg) => {
            if (!msg?.chat.id) {
                console.log("Enter '/start' to the telegram bot");
            }
            const chatId = msg.chat.id;

            // save chat id in credentials
            if (msg.text === "/start") {
                await bot.sendMessage(chatId, `Hello, ${msg.from.first_name}! Your chatId is: **${chatId}**`, {parse_mode: 'Markdown'});

                credentials.CHAT_ID = chatId;
                await setCredentials('credentials.json', credentials);

                await bot.sendMessage(chatId, `ChatId saved. No you can use other commands (node index.js help)`,);

                console.log("ChatId saved!")
                process.exit();
            }
        });
        console.log("Bot started")
        console.log("Go to the bot, write '/start' and chatId will be saved");
    })

program.parse();
