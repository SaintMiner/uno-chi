const Extension = require('@core/classes/extension');

const { info, warn, error, log } = require('pretty-console-logs');

const setVoice = require('./commands/set-voice');

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
            core.getGuilds().forEach(guild => this.tickGuild(guild));
        }, this.tickInterval);
        setInterval(() => {
            this.voiceProfileExtension.saveAll();;
        }, this.saveInterval);
    }

    command() {
        return [
            setVoice,
        ]
    }

    tickGuild(guild) {
        core.client.guilds.fetch(guild.guild_id)
        .then(g => {
            const rooms = this.voiceRoomExtension.getGuildVoiceRooms(guild.guild_id);
            rooms.forEach(room => this.tickVoiceRoom(room, guild));
        })
        .catch(err => error(`${err}. GuildID: [${guild.guild_id}]`));        
    }

    tickVoiceRoom(room, guild) {
        core.client.channels.fetch(room.room_id).then(channel => {
            channel.members.forEach(member => this.tickMember(member, room, guild));
        }).catch(err => error(err));
    }

    tickMember(member, room, guild) {
        let profile = this.voiceProfileExtension.findVoiceProfile(member.id, guild.guild_id);

        if (profile) {
            profile.experience += this.getVoiceRoomExperience(room);            
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
        }
    }

    getVoiceRoomExperience(room) {
        let experience = 0;

        if (room.settings) {
            experience = +room.settings.experience || 0
        }
        
        return experience;
    }

    getNextLevelExperienceCount(level) {
        return (10 + level) * 10 * level * level;
    }

    
}

module.exports = VoiceLevelExtension;