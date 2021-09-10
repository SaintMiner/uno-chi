require('dotenv').config();
require('module-alias/register');
const { info } = require('pretty-console-logs');

const { Client } = require('discord.js');
const client = new Client();

const axios = require('axios');
const api = axios.create({
    baseURL: process.env.REST_BASE_URL,    
    headers: {
        Authorization: process.env.REST_AUTHORIZATION,
        Cache: process.env.REST_CACHE
    }
});


const Core = require('./core');
core = new Core(client, `UnoCore ${process.env.CORE_VERSION}`);
core.initialize();
core.api = api;
client.on('ready', () => {
    info(`[${core.launchedAt}] ${client.user.tag} has logged in successfully!`);
    info(`Ready to serve on ${client.guilds.cache.size} servers, for ${client.users.cache.size} users.`);
});

client.login(process.env.BOT_TOKEN);