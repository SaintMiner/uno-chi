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
    client.system_administrators = process.env.SYSTEM_ADMINISTRATORS.split(' ');
    client.prefix = process.env.PREFIX;
    client.database = {};
    client.database.keyspace = process.env.KEYSPACE;
    client.database.contactPoints = process.env.CONTACTPOINTS.split(' ');
    client.database.localDataCenter = process.env.LOCALDATACENTER;
    client.forceWeekday = false;
    client.voice_tick = process.env.VOICE_TICK;
    client.unrecognized_command = process.env.UNRECOGNIZED_COMMAND.toLowerCase() == 'true';
    client.server_port = process.env.SERVER_PORT;
}

function initModules() {
    require('./moduleLoader.js')(client);
}


client.login(process.env.BOT_TOKEN);