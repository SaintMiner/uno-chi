require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
    console.log(`Starting ${client.user.tag}!`);
    client.prefix = process.env.PREFIX;
    initModules();
});

function initModules() {
    require('./moduleLoader.js')(client);
}


client.login(process.env.BOT_TOKEN);