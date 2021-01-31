const Module = require('@core/classes/module');
const { info, warn, error, log } = require('pretty-console-logs');

class GuildModule extends Module {
    constructor() {
        super(2);
        this.guildModel = require('./GuildModule/Models/GuildModel');
        this.guilds = [];
    }
    
    init() {
        this.loadGuilds();
    }

    async loadGuilds() {
        this.guildConnector = core.getConnection().loadSchema('GuildModel', this.guildModel);
        await this.guildConnector.syncDBAsync().catch(err => {throw err});
        await this.fetchGuilds();
        await this.saveGuild({guild_id: '24'});
        console.log(this.guilds);
    }

    async fetchGuilds() {
        await this.guildConnector.findAsync({}, {raw: true}).then(result => this.guilds = result);
    }

    findGuild(guild_id) {
        return this.guilds.find(g => g.guild_id == guild_id);
    }

    async saveGuild(guild) {
        let record = new this.guildConnector(guild);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
        await this.fetchGuilds()
    }
}

module.exports = GuildModule