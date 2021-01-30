const { I18n } = require('i18n');
const { info } = require('pretty-console-logs');

moment = require('moment');

const ModuleLoader = require('./core/moduleLoader');

class Core {
    constructor(client) {
        this.version = `UnoCore ${process.env.CORE_VERSION}`;
        this.badge = `[${this.version}] `;
        this.launchedAt = moment().format('DD.MM.YYYY HH:mm:ss');
        info(`[${this.launchedAt}] ${client.user.tag} has logged in successfully!`);
        info(this.badge, `Initialising...`);
        this.client = client;
        this.init();
    }
    
    init() {
        this.moduleLoader = new ModuleLoader(this.client);
        this.moduleLoader.loadModules();

        this.i18n = new I18n({
            locales: ['en', 'ru'],
            directory: `${__dirname}/json/locales`,
            defaultLocale: process.env.DEFAULT_LANGUAGE || 'en',
            register: global
        });
    }
}

module.exports = Core;