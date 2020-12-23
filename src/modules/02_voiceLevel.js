const Module = require('../classes/module.js');

class VoiceLevelModule extends Module {
    constructor(client) {
        super(client, {
            name: 'Voice Level'
        });
        this.guildModel = this.client.models.find(m => m._properties.name == 'Guilds');
        this.voiceProfileModel = this.client.models.find(m => m._properties.name == 'VoiceProfiles');
        this.startVoiceLevelSystem();
        let minutes = 5, interval = minutes * 60 * 1000;
        setInterval(() => {
            this.saveProfiles();
        }, interval);
    }

    startVoiceLevelSystem() {
        let interval = 9 * 1000;
        setInterval(() => {
            if (this.client.storage['guilds']) {
                if (this.client.storage['guilds'].length) {
                    this.client.storage['guilds'].forEach(guild => {
                        this.client.guilds.fetch(guild.guild_id)
                        .then(guild => {
                            const guildLevelRoles = this.client.storage['voice_roles'].filter(role => role.guild_id == guild.id);
                            const voiceChannels = this.client.storage['voice_rooms'].filter(v => v.guild_id == guild.id);

                            voiceChannels.forEach(v => {
                                this.client.channels.fetch(v.room_id).then(voice => {
                                    voice.members.forEach(member => {
                                        let profile = this.client.storage['voice_profiles']
                                            .find(profile => profile.user_id == member.id && profile.guild_id == guild.id);
                                        
                                        if (profile) {
                                            profile.experience += v.experience;
                                            if (profile.experience >= this.nextLevelExperience(profile.level)) {
                                                profile.experience -= this.nextLevelExperience(profile.level);
                                                profile.level++;
                                                profile.voicepoint += 10*profile.level;

                                                //requires refactoring
                                                let levelUpRoles = guildLevelRoles.find(role => role.level == profile.level);
                                                levelUpRoles.add_roles.forEach(role => {
                                                    guild.roles.fetch(role).then(r => {
                                                        member.roles.add(r);
                                                    });
                                                });
                                                levelUpRoles.remove_roles.forEach(role => {
                                                    guild.roles.fetch(role).then(r => {
                                                        member.roles.remove(r);
                                                    });
                                                });
                                                ///////////////////////
                                            }
                                        } else {
                                            profile = {
                                                user_id: member.id.toString(),
                                                guild_id: v.guild_id.toString(),
                                                experience: v.experience,
                                                level: 1,
                                                voicepoint: 10,
                                            };
                                            this.client.storage['voice_profiles'].push(profile);
                                            
                                            //requires refactoring
                                            let levelUpRoles = guildLevelRoles.find(role => role.level == profile.level);
                                            levelUpRoles.add_roles.forEach(role => {
                                                guild.roles.fetch(role).then(r => {
                                                    member.roles.add(r);
                                                });
                                            });
                                            levelUpRoles.remove_roles.forEach(role => {
                                                guild.roles.fetch(role).then(r => {
                                                    member.roles.remove(r);
                                                });
                                            });
                                            /////////////////////////
                                        }
                                    });
                                }).catch(e => console.error);
                            });
                        })
                        .catch(console.error);
                    });
                }
            }
        }, interval);
    }

    nextLevelExperience(level) {
        return (10+level)*10*level*level;
    }

    saveProfile(data) {
        let profile = new this.voiceProfileModel(data);
        profile.save(function(err){
            if(err) console.log(err);
        });
    }

    saveProfiles() {        
        if (this.client.storage['voice_profiles']) {
            if (this.client.storage['voice_profiles'].length) {
                console.log(`Saving voice profiles...`);
                this.client.storage['voice_profiles'].forEach(profile => {
                    this.saveProfile(profile);
                });
            }
        }
    }
}

module.exports = VoiceLevelModule;