require('dotenv').config();

const decache = require('decache');
const { Client } = require('discord.js');
const client = new Client();
const { I18n } = require('i18n');

const i18n = new I18n({
    locales: ['en', 'ru'],
    directory: `${__dirname}/json/locales`,
    defaultLocale: process.env.DEFAULT_LANGUAGE || 'en',
    register: global
});

client.on('ready', () => {
    initEnviroment();
    let now = new Intl.DateTimeFormat('ru-RU', client.timeOptions).format(new Date());
    console.log(`${now} | Starting ${client.user.tag}!`);
    initModules();
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

function initModules() {
    require('./moduleLoader.js')(client);
	decache('./moduleLoader.js');
}

client.login(process.env.BOT_TOKEN);