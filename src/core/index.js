moment = require('moment');

const { I18n } = require('i18n');
const { info } = require('pretty-console-logs');

const Basic = require('./classes/basic');

const ConfigurationLoader = require('./configuration-loader');
const ExtensionManager = require('./extension-manager');
const CommandManager = require('./command-manager');
const CommandBuilder = require('./command-builder');

class UnoCore extends Basic{
    constructor(client, version) {
        super(version);
        this.client = client;
        this.version = version;
        this.launchedAt = moment().format('DD.MM.YYYY HH:mm:ss');
    }
    
    initialize() {
        info(`[${this.launchedAt}] ${this.client.user.tag} has logged in successfully!`);
        
        this.configurationLoader = new ConfigurationLoader();

        this.i18n = new I18n({
            locales: ['en', 'ru'],
            directory: `${__dirname}/json/locales`,
            defaultLocale: process.env.DEFAULT_LANGUAGE || 'en',
            register: global
        });
        
        this.extensionManager = new ExtensionManager();
        this.extensionManager.initialize();
        
        this.commandBuilder = new CommandBuilder();
        this.commandManager = new CommandManager();

        this.extensionManager.extensions.forEach(extension => {
            this.commandBuilder.build(extension.commands());
        });

        this.commandManager.initialize();
        this.commandManager.mergeAll();
    }
        
}

module.exports = UnoCore;