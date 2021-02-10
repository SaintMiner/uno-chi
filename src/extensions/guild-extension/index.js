const Extension = require('@core/classes/extension');
const { info, warn, error, log } = require('pretty-console-logs');

class GuildExtension extends Extension {
    constructor() {
        super();
        this.guildModel = require('./Models/GuildModel');
        this.guilds = [];
        this.isPublic = false;
        this.loadGuilds();
        core.getGuilds = () => this.getGuilds();
        core.findGuild = (guild_id) => this.findGuild(guild_id);
    }

    async loadGuilds() {
        this.guildModel = core.getConnection().loadSchema('GuildModel', this.guildModel);
        await this.guildModel.syncDBAsync().catch(err => {throw err});
        await this.fetchGuilds();
    }

    async fetchGuilds() {
        await this.guildModel.findAsync({}, {raw: true}).then(result => this.guilds = result);
    }

    async save(guild) {
        let record = new this.guildModel(guild);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
        await this.fetchGuilds();
    }

    findGuild(guild_id) {
        return this.guilds.find(g => g.guild_id == guild_id);
    }

    getGuilds() {
        return this.guilds;
    }
}

module.exports = GuildExtension