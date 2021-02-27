require('dotenv').config();
require('module-alias/register');
const { info } = require('pretty-console-logs');

const { Client } = require('discord.js');
const client = new Client();


const Core = require('./core');
core = new Core(client, `UnoCore ${process.env.CORE_VERSION}`);
core.initialize();
client.on('ready', () => {
    info(`[${core.launchedAt}] ${client.user.tag} has logged in successfully!`);
    info(`Ready to serve on ${client.guilds.cache.size} servers, for ${client.users.cache.size} users.`);
});

client.login(process.env.BOT_TOKEN);