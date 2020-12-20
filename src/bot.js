require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
    console.log(`Starting ${client.user.tag}!`);
    initEnviroment();
    initModules();
});

function initEnviroment() {
    client.prefix = process.env.PREFIX;
    client.database = {};
    client.database.keyspace = process.env.KEYSPACE;
    client.database.contactPoints = process.env.CONTACTPOINTS.split(' ');
    client.database.localDataCenter = process.env.LOCALDATACENTER;
}

function initModules() {
    require('./moduleLoader.js')(client);
}


client.login(process.env.BOT_TOKEN);