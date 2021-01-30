require('dotenv').config();
require('module-alias/register');

const { Client } = require('discord.js');
const client = new Client();


const Core = require('./core');

client.on('ready', () => {    
    core = new Core(client);
});

function initEnviroment() {
    client.i18n = i18n;
    client.timeOptions = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
    client.systemAdministrators = process.env.SYSTEM_ADMINISTRATORS.split(' ');
    client.prefix = process.env.PREFIX;
    client.database = {};
    client.database.keyspace = process.env.KEYSPACE;
    client.database.contactPoints = process.env.CONTACTPOINTS.split(' ');
    client.database.localDataCenter = process.env.LOCALDATACENTER;
    client.forceWeekday = false;
    client.voice_tick = process.env.VOICE_TICK;
    client.unrecognizedCommand = process.env.UNRECOGNIZED_COMMAND.toLowerCase() == 'true';
    client.server_port = process.env.SERVER_PORT;
}

client.login(process.env.BOT_TOKEN);