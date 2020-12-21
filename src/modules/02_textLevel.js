const Module = require('../classes/module.js');

class TextLevelModule extends Module {
    constructor(client) {
        super(client, {
            name: 'Text Level'
        });
        this.textProfileModel = this.client.models.find(m => m._properties.name == 'TextProfiles');
        this.startTextLevelMonitoring();
        let minutes = 5, interval = minutes * 60 * 1000;
        this.saveProfiles();
        console.log(this.client.storage['text_profiles']);
        setInterval(() => {
            console.log("Saving text profiles...");
            this.saveProfiles();
        }, interval);
    }

    startTextLevelMonitoring() {
        this.client.on('message', message => {
            if (message.author.id != this.client.user.id && !message.author.bot) {
                if (!message.content.startsWith(this.client.prefix)) {
                    let user_profile = this.client.storage['text_profiles'].find(profile => profile.user_id == message.author.id && profile.guild_id == message.guild.id);
                    if (user_profile) {
                        console.log('has profile');
                        user_profile.experience++;
                        user_profile.message_count++;
                        if (user_profile.experience >= this.nextLevelExperice(user_profile.level)) {
                            user_profile.experience -= this.nextLevelExperice(user_profile.level);
                            user_profile.level++;
                        }
                    } else {
                        console.log('no profile');
                        user_profile = {
                            user_id: message.author.id.toString(),
                            guild_id: message.guild.id.toString(),
                            message_count: 1,
                            experience: 1,
                            level: 1,
                        };
                        this.client.storage['text_profiles'].push(user_profile);
                    }
                    this.saveProfile(user_profile);
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
                this.client.storage['text_profiles'].forEach(profile => {
                    this.saveProfile(profile);
                });
            }
        }
    }

    nextLevelExperice(level) {
        return level*20+(level-1)*20;
    }
}

module.exports = TextLevelModule;