const Extension = require('@core/classes/extension');

const { info, warn, error, log } = require('pretty-console-logs');

class TextProfileExtension extends Extension {
    constructor() {
        super();
        this.textProfilesModel = require('./models/text-profile-model');
        this.textProfiles = [];
        this.loadTextProfiles();

        core.client.on('message', message => {
            if (!message.guild) return;
            if (message.author.bot) return;
            if (message.content.startsWith(core.configuration.prefix)) return;
            
            let profile = this.findTextProfile(message.author.id, message.guild.id);

            profile.message_count++;
            profile.experience++;

            if (profile.experience >= this.nextLevelExperience(profile.level)) {
                profile.experience -= this.nextLevelExperience(profile.level);
                profile.level++;

                let levelUpMessage = __(
                    { 
                        phrase: `<@{{mention}}> has reached {{level}} level on text system`,
                        locale: core.getGuildLanguage(message.guild.id) 
                    },
                    {
                        mention: message.author.id,
                        level: profile.level,
                    }
                );

                core.alertGuild(message.guild.id, levelUpMessage);
            }
            
            this.saveLocal(profile);
        });

        this.saveInterval = 5 * 60 * 1000;

        setInterval(() => {
            this.saveAll();;
        }, this.saveInterval);

        core.findTextProfile = (user_id, guild_id) => this.findTextProfile(user_id, guild_id);
    }

    async loadTextProfiles() {
        this.textProfilesModel = core.getConnection().loadSchema('TextProfilesModel', this.textProfilesModel);
        await this.textProfilesModel.syncDBAsync().catch(err => {throw err});
        await this.fetchTextProfiles();
    }

    async fetchTextProfiles() {
        await this.textProfilesModel.findAsync({}, {raw: true}).then(result => this.textProfiles = result);
    }

    findTextProfile(user_id, guild_id) {
        let profile = this.textProfiles.find(tp => tp.user_id == user_id && tp.guild_id == guild_id);
        if (!profile) {
            profile = this.getTemplate(user_id, guild_id);
        }
        return profile;
    }

    async save(textProfile) {
        let record = new this.textProfilesModel(textProfile);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
    }

    saveLocal(textProfile) {
        if (textProfile.isTemplate) {
            textProfile.isTemplate = false;
            let partOfSystemMessage = __(
                { 
                    phrase: `<@{{mention}}> now is part of text system`,
                    locale: core.getGuildLanguage(textProfile.guild_id) 
                },
                {
                    mention: textProfile.user_id,                    
                }
            );

            core.alertGuild(textProfile.guild_id, partOfSystemMessage);
            this.textProfiles.push(textProfile);
        }
    }

    saveAll() {
        info(`[${this.name}] Saving text profiles (${moment().format('DD.MM.YYYY HH:mm:ss')})`);
        this.textProfiles.forEach(profile => this.save(profile));
    }

    getTemplate(user_id, guild_id) {
        return {
            user_id: user_id,
            guild_id: guild_id,
            experience: 0,
            level: 1,
            message_count: 0,
            isTemplate: true
        }
    }

    nextLevelExperience(level) {
        return level*20+(level-1)*20;
    }

    
}

module.exports = TextProfileExtension;