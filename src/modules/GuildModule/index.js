const Module = require('@core/classes/module');
const { info, warn, error, log } = require('pretty-console-logs');

class GuildModule extends Module {
    constructor() {
        super(2);
        this.guildModel = require('./Models/GuildModel');
        this.guilds = [];
    }
    
    init() {
        this.loadGuilds();
    }

    async loadGuilds() {
        this.guildModel = core.getConnection().loadSchema('GuildModel', this.guildModel);
        await this.guildModel.syncDBAsync().catch(err => {throw err});
        await this.fetchGuilds();
    }

    async fetchGuilds() {
        await this.guildModel.findAsync({}, {raw: true}).then(result => this.guilds = result);
    }

    findGuild(guild_id) {
        return this.guilds.find(g => g.guild_id == guild_id);
    }

    async saveGuild(guild) {
        let record = new this.guildModel(guild);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
        await this.fetchGuilds();
    }
}

module.exports = GuildModule