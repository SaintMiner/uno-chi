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
                            const currentGuild = this.client.storage['guilds'].find(g => g.guild_id == guild.id);
                            voiceChannels.forEach(v => {
                                this.client.channels.fetch(v.room_id).then(voice => {
                                    voice.members.forEach(async member => {
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
                                                if (levelUpRoles) {
                                                    if (levelUpRoles.add_roles) {
                                                        if (levelUpRoles.add_roles.length) {
                                                            await levelUpRoles.add_roles.forEach(role => {
                                                                guild.roles.fetch(role).then(r => {
                                                                    member.roles.add(r);
                                                                });
                                                            });
                                                        }
                                                    }
                                                    if (levelUpRoles.remove_roles) {
                                                        if (levelUpRoles.remove_roles.length) {
                                                            await levelUpRoles.remove_roles.forEach(role => {
                                                                guild.roles.fetch(role).then(r => {
                                                                    member.roles.remove(r);
                                                                });
                                                            });
                                                        }
                                                    }
                                                }
                                                ///////////////////////
                                                if (currentGuild) {
                                                    this.client.channels.fetch(currentGuild.alert_channel_id).then(c => {
                                                        c.send(`${member} - Достиг \`${profile.level}\` голосового уровня...`);
                                                    }).catch(e => console.error);
                                                }
                                                
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
                                            if (levelUpRoles) {
                                                if (levelUpRoles.add_roles) {
                                                    if (levelUpRoles.add_roles.length) {
                                                    levelUpRoles.add_roles.forEach(role => {
                                                        guild.roles.fetch(role).then(r => {
                                                            member.roles.add(r);
                                                        });
                                                    });
                                                }

                                                if (levelUpRoles.remove_roles) {
                                                    if (levelUpRoles.remove_roles.length) {
                                                        console.log(levelUpRoles.remove_roles);
                                                        levelUpRoles.remove_roles.forEach(role => {
                                                            guild.roles.fetch(role).then(r => {
                                                                member.roles.remove(r);
                                                            });
                                                        });
                                                    }
                                                }
                                            }
                                            /////////////////////////
                                            if (currentGuild) {
                                                if (currentGuild.alert_channel_id) {
                                                    this.client.channels.fetch(currentGuild.alert_channel_id).then(c => {
                                                        c.send(`${member} - Теперь часть системы.`);
                                                    }).catch(e => console.error);
                                                }
                                            }
                                        }
                                    }});
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

    getChannelExperience(voiceChannel) {
        let experience = voiceChannel.experience;
        let now = new Date();
        let isWeekday = (now.getDay() == 0 || now.getDay() == 6)? true : false;
        if (voiceChannel.support_weekday_double && (isWeekday || this.client.forceWeekday)) {
            experience *= 2;
        }
        return experience;
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