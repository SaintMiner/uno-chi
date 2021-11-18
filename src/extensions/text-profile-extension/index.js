const Extension = require('@core/classes/extension');

const { info, warn, error, log } = require('pretty-console-logs');
const { show, update } = require('../voice-level-extension/rest');

class TextProfileExtension extends Extension {
    constructor() {
        super();
        core.client.on('message', async message => {
            if (!message.guild) return;
            if (message.author.bot) return;
            if (message.content.startsWith(core.configuration.prefix)) return;
            
            let profile = await show(message.guild.id, message.author.id);
            if (!profile.text) {
                profile.text = {
                    level: 1,
                    experience: 0,
                    message_count: 0,
                }

                let partOfSystemMessage = __(
                    { 
                        phrase: `<@{{mention}}> now is part of text system`,
                        locale: core.getGuildLanguage(message.guild.id) 
                    },
                    {
                        mention: message.author.id,                    
                    }
                );
    
                core.alertGuild(message.guild.id, partOfSystemMessage);
            }
            profile = profile.text;

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
            
            update({
                guild_id: message.guild.id,
                user_id: message.author.id,
                text: profile
            })
        });
    }

    nextLevelExperience(level) {
        return level*20+(level-1)*20;
    }

    
}

module.exports = TextProfileExtension;