const Basic = require('./classes/basic');

class ConfigurationLoader extends Basic {
    
    configuration = {};

    constructor() {
        super();        
        this.configuration = core.configuration = {};
        this.configuration.systemAdministrators = process.env.SYSTEM_ADMINISTRATORS.split(' ');
        this.configuration.prefix = process.env.PREFIX;
        this.configuration.database = {};
        this.configuration.database.keyspace = process.env.KEYSPACE;
        this.configuration.database.contactPoints = process.env.CONTACTPOINTS.split(' ');
        this.configuration.database.localDataCenter = process.env.LOCALDATACENTER;
        this.configuration.voice_tick = process.env.VOICE_TICK;
        this.configuration.server_port = process.env.SERVER_PORT;
        this.configuration.core_version = process.env.CORE_VERSION;
        this.configuration.api_token = process.env.API_TOKEN;
    }

}

module.exports = ConfigurationLoader;