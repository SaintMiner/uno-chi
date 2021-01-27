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
        let interval = this.client.voice_tick * 1000;
        setInterval(() => {
            this.client.storage['guilds'].forEach(guild => {
                this.voiceTick(guild.guild_id)
            });
        }, interval);
    }

    voiceTick(guild_id) {        
        this.client.guilds.fetch(guild_id).then(guild => {
            const guildLevelRoles = this.client.storage['voice_roles'].filter(role => role.guild_id == guild.id);
            const voiceChannels = this.client.storage['voice_rooms'].filter(v => v.guild_id == guild.id);
            const currentGuild = this.client.storage['guilds'].find(g => g.guild_id == guild.id);
            voiceChannels.forEach(v => {this.client.channels.fetch(v.room_id).then(voice => {
                let channelSettings = this.getChannelSettings(v);
                voice.members.forEach(async member => {
                    let profile = this.client.getVoiceProfile(member.id, guild.id);
                    if (profile) {
                        profile.experience += this.getChannelExperience(v);
                        
                        if (!profile.time_spents) {
                            profile.time_spents = [];
                        }
                        this.processTimeSpents(profile, v);
                        
                        if (profile.experience >= this.nextLevelExperience(profile.level)) {
                            profile.experience -= this.nextLevelExperience(profile.level);
                            profile.level++;
                            profile.voicepoint += 10*profile.level;                                            
                            let levelUpRoles = guildLevelRoles.find(role => role.level == profile.level);
                            this.processRoles(member, levelUpRoles);
                            if (currentGuild.alert_channel_id) {
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
                            time_spents: [{
                                name: 'global',
                                time: +this.client.voice_tick
                            }]
                        };
                        this.client.storage['voice_profiles'].push(profile);

                        let levelUpRoles = guildLevelRoles.find(role => role.level == profile.level);
                        this.processRoles(member, levelUpRoles);

                        if (currentGuild.alert_channel_id) {
                            this.client.channels.fetch(currentGuild.alert_channel_id).then(c => {
                                c.send(`${member} - Теперь часть голосовой системы.`);
                            }).catch(e => console.error);
                        }
                    }
                })
            }).catch(e => console.error);
        });
        })
        .catch(console.error);
    }

    processTimeSpents(profile, voiceChannel) {
        let channelSettings = this.getChannelSettings(voiceChannel);
        let globalTimeSpent = profile.time_spents.find(ts => ts.name == 'global');
                        
        if (globalTimeSpent) {
            globalTimeSpent.time += +this.client.voice_tick;
        } else {
            profile.time_spents.push({
                name: 'global',
                time: +this.client.voice_tick
            });
        }

        if (channelSettings.includes('mining')) {
            let channelTimeSpent = profile.time_spents.find(ts => ts.name == voiceChannel.room_id.toString());
            if (channelTimeSpent) {
                channelTimeSpent.time += +this.client.voice_tick;
                let hour = 1000 * 60 * 60;
                if (channelTimeSpent.time >= hour) {
                    channelTimeSpent.time -= hour;
                    profile.voicepoint += +profile.level;
                }
            } else {
                profile.time_spents.push({
                    name: voiceChannel.room_id.toString(),
                    time: +this.client.voice_tick
                }); 
            }
        }
    }

    async processRoles(member, roles) {
        if (roles) {
            for await (const role of roles.add_roles) {
                await guild.roles.fetch(role).then(r => {
                    member.roles.add(r);
                });
            }
            for await (const role of roles.remove_roles) {
                await guild.roles.fetch(role).then(r => {
                    member.roles.add(r);
                });
            }
        }
    }

    nextLevelExperience(level) {
        return (10+level)*10*level*level;
    }

    getChannelSettings(voiceChannel) {
        let settings = [];
        if (voiceChannel.settings) {
            Object.keys(voiceChannel.settings).forEach(key => {
                if (voiceChannel.settings[key]) {
                    settings.push(key);
                }
            });
        }
        return settings;
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