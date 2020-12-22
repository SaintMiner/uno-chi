require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
    initEnviroment();
    let now = new Intl.DateTimeFormat('ru-RU', client.timeOptions).format(new Date());
    console.log(`${now} | Starting ${client.user.tag}!`);
    initModules();
});

function initEnviroment() {
    client.timeOptions = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
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