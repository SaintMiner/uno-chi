const Extension = require('@core/classes/extension');
const { info, warn, error, log } = require('pretty-console-logs');

const setChannelCommand = require('./commands/set-channel');

class GuildExtension extends Extension {
    constructor() {
        super();
        this.guildModel = require('./models/GuildModel');
        this.guilds = [];
        this.isPublic = true;
        this.loadGuilds();
        core.getGuilds = () => this.getGuilds();
        core.findGuild = (guild_id) => this.findGuild(guild_id);
    }

    commands() {
        return [
            setChannelCommand,
            require('./commands/channel'),
        ]
    }

    async loadGuilds() {
        this.guildModel = core.getConnection().loadSchema('GuildModel', this.guildModel);
        await this.guildModel.syncDBAsync().catch(err => {throw err});
        await this.fetchGuilds();
    }

    async fetchGuilds() {
        await this.guildModel.findAsync({}, {raw: true})
            .then(result => this.guilds = result.map(guild => {
                if (!guild.channels) guild.channels = {};
                if (!guild.settings) guild.settings = {};
                if (!guild.extensions) guild.extensions = {};

                return guild;
            }));
    }

    saveLocal(guild) {
        if (guild.template) {
            this.guilds.push(guild);
        }
    }

    async save(guild) {
        let record = new this.guildModel(guild);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));        
    }

    findGuild(guild_id) {
        let guild = this.guilds.find(g => g.guild_id == guild_id);
        if (!guild) {
            guild = this.getTemplate(guild_id);
        }
        return guild;
    }

    getGuilds() {
        return this.guilds;
    }

    getTemplate(guild_id) {
        return {
            guild_id: guild_id,
            channels: {},
            extensions: {},
            settings: {},
            template: true,
        }
    }
}

module.exports = GuildExtension