const Extension = require('@core/classes/extension');

const { info, warn, error, log } = require('pretty-console-logs');

class VoiceLevelExtension extends Extension {
    
    
    constructor() {
        super();
        this.voiceProfileExtension = core.getExtension('VoiceProfileExtension');
        this.voiceRoleExtension = core.getExtension('VoiceRoleExtension');
        this.voiceRoomExtension = core.getExtension('VoiceRoomExtension');

        this.tickInterval = core.configuration.voice_tick * 1000;
        this.saveInterval = 5 * 60 * 1000;
        

        if (!(this.voiceProfileExtension && this.voiceRoleExtension && this.voiceRoomExtension)) return;

        setInterval(() => {
            core.getGuilds().forEach(guild => {
                if (guild.settings.is_active == 'true') {
                    this.tickGuild(guild)
                }
            });
        }, this.tickInterval);
        
        setInterval(() => {
            this.voiceProfileExtension.saveAll();;
        }, this.saveInterval);
    }

    commands() {
        return [
            require('./commands/voice'),
        ]
    }

    tickGuild(guild) {
        core.client.guilds.fetch(guild.guild_id)
        .then(g => {
            const rooms = this.voiceRoomExtension.getGuildVoiceRooms(guild.guild_id);
            rooms.forEach(room => this.tickVoiceRoom(room, guild));
        })
        .catch(err => {return});
    }

    tickVoiceRoom(room, guild) {
        core.client.channels.fetch(room.room_id).then(channel => {
            channel.members.forEach(member => this.tickMember(member, room, guild));
        }).catch(err => {});
    }

    tickMember(member, room, guild) {
        let profile = this.voiceProfileExtension.findVoiceProfile(member.id, guild.guild_id);
        
        if (profile) {
            profile.experience += this.getVoiceRoomExperience(room);
            if (!profile.time_spents) {
                profile.time_spents = {};
            }

            if (!profile.time_spents.global) {
                profile.time_spents.global = 0;
            }

            if (+room.settings.mining) {
                if (profile.time_spents[room.room_id]) {
                    profile.time_spents[room.room_id] += +core.configuration.voice_tick;
                } else {
                    profile.time_spents[room.room_id] = +core.configuration.voice_tick;
                }

                let miningPayDay = 1 * 60 * 60;

                if (profile.time_spents[room.room_id] >= miningPayDay) {
                    profile.time_spents[room.room_id] -= miningPayDay;
                    profile.voicepoints += +room.settings.mining
                }
            }

            profile.time_spents.global += +core.configuration.voice_tick;
            
        } else {
            profile = {};
            Object.assign(profile, this.voiceProfileExtension.getVoiceProfileTemplate());
            profile.user_id = member.id;
            profile.guild_id = guild.guild_id;
            profile.experience = this.getVoiceRoomExperience(room);
            this.voiceProfileExtension.voiceProfiles.push(profile);
        }

        if (profile.experience >= this.getNextLevelExperienceCount(profile.level)) {
            profile.experience -= this.getNextLevelExperienceCount(profile.level);
            profile.level++;
            profile.voicepoints += 10 * profile.level;
            this.voiceRoleExtension.processUserByLevel(member, profile.level);

            let levelUpMessage = __(
                { 
                    phrase: `<@{{mention}}> has reached {{level}} level on voice system`,
                    locale: core.getGuildLanguage(message.guild.id) 
                },
                {
                    mention: message.author.id,
                    level: profile.level,
                }
            );

            core.alertGuild(message.guild.id, levelUpMessage);
        }
    }

    getVoiceRoomExperience(room) {
        let experience = 0;
        let weekday = new Date().getDay();

        if (room.settings) {
            experience = +room.settings.experience || 0
            if (room.settings.weekend == 'true' && ((weekday === 6) || (weekday === 0))) {
                experience *= 2;
            }
        }
        
        return Math.round(experience);
    }

    getNextLevelExperienceCount(level) {
        return (10 + level) * 10 * level * level;
    }

    
}

module.exports = VoiceLevelExtension;