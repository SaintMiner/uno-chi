const Module = require('../classes/module.js');

class TextLevelModule extends Module {
    constructor(client) {
        super(client, {
            name: 'Text Level'
        });
        this.textProfileModel = this.client.models.find(m => m._properties.name == 'TextProfiles');
        this.startTextLevelSystem();
        let minutes = 5, interval = minutes * 60 * 1000;
        setInterval(() => {
            this.saveProfiles();
        }, interval);
    }

    startTextLevelSystem() {
        this.client.on('message', message => {
            if (message.author.id != this.client.user.id && !message.author.bot) {
                if (!message.content.startsWith(this.client.prefix)) {
                    let profile = this.client.storage['text_profiles'].find(profile => profile.user_id == message.author.id && profile.guild_id == message.guild.id);
                    if (profile) {
                        profile.experience++;
                        profile.message_count++;
                        if (profile.experience >= this.nextLevelExperience(profile.level)) {
                            profile.experience -= this.nextLevelExperience(profile.level);
                            profile.level++;
                        }
                    } else {
                        profile = {
                            user_id: message.author.id.toString(),
                            guild_id: message.guild.id.toString(),
                            message_count: 1,
                            experience: 1,
                            level: 1,
                        };
                        this.client.storage['text_profiles'].push(profile);
                    }
                }
            }
        });
    }

    saveProfile(data) {
        let profile = new this.textProfileModel(data);
        profile.save(function(err){
            if(err) console.log(err);
        });
    }

    saveProfiles() {        
        if (this.client.storage['text_profiles']) {
            if (this.client.storage['text_profiles'].length) {
                console.log(`Saving text profiles...`);
                this.client.storage['text_profiles'].forEach(profile => {
                    this.saveProfile(profile);
                });
            }
        }
    }

    nextLevelExperience(level) {
        return level*20+(level-1)*20;
    }
}

module.exports = TextLevelModule;