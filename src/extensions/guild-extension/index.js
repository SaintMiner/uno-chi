const Extension = require('@core/classes/extension');
const { info, warn, error, log } = require('pretty-console-logs');

class GuildExtension extends Extension {
    constructor() {
        super();
        this.guildModel = require('./models/GuildModel');
        this.guilds = [];
        this.isPublic = true;
        this.loadGuilds();
        core.getGuilds = () => this.getGuilds();
        core.findGuild = (guild_id) => this.findGuild(guild_id);
        core.getGuildLanguage = (guild_id) =>  this.getGuildLanguage(guild_id);
        core.sendLocalizedError = (message, error) =>  this.sendLocalizedError(message, error);
        core.sendSuccessful = (message) => this.sendSuccessful(message);
        core.alertGuild = (guild_id, text) => this.alertGuild(guild_id, text);
        core.rouletteAlertGuild = (guild_id, content) => this.rouletteAlertGuild(guild_id, content);

        core.client.on('guildCreate', async guild => {
            let newGuild = this.findGuild(guild.id);
            newGuild.settings.is_active = 'true';
            this.saveLocal(newGuild);
            this.save(newGuild);
        });
    }

    alertGuild(guild_id, text) {
        let guild = this.findGuild(guild_id);

        if (!text) return;
        if (!guild) return;
        if (!guild.channels) return;
        if (!guild.channels.alert) return;

        let channel = core.client.channels.resolve(guild.channels.alert);
        if (!channel) return;

        channel.send(text);

    }

    rouletteAlertGuild(guild_id, content) {
        let guild = this.findGuild(guild_id);

        if (!content) return;
        if (!guild) return;
        if (!guild.channels) return;
        if (!guild.channels.alert) return;

        let channel = core.client.channels.resolve(guild.channels.roulette);
        if (!channel) return;

        channel.send(content);
    }

    commands() {
        return [
            require('./commands/guild'),
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
            guild.template = false;
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

    getGuildLanguage(guild_id) {
        let guild = this.findGuild(guild_id);

        if (!guild.settings || guild.template) return 'en';

        let language = guild.settings.language || 'en';
        return language;
    }

    sendLocalizedError(message, error) {
        message.channel.send(__({ phrase: error, locale: this.getGuildLanguage(message.guild.id) }));
    }

    sendSuccessful(message) {
        message.channel.send('✅ Seems to be successful');
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