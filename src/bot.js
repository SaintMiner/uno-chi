require('dotenv').config();
require('module-alias/register');

const { Client } = require('discord.js');
const client = new Client();


const Core = require('./core');
core = new Core(client, `UnoCore ${process.env.CORE_VERSION}`);

client.on('ready', () => core.initialize());

client.login(process.env.BOT_TOKEN);