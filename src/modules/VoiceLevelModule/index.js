const Module = require('@core/classes/module');
const { info, warn, error, log } = require('pretty-console-logs');

class VoiceLevelModule extends Module {
    
    init() {
        this.tickInterval = core.getConfiguration().voice_tick * 1000;
        this.saveInterval = 5 * 60 * 1000;
        this.voiceProfileModule = core.moduleLoader.modules.get('VoiceProfileModule');
        this.voiceRoleModule = core.moduleLoader.modules.get('VoiceRoleModule');

        setInterval(() => {
            core.getGuilds().forEach(guild => this.tickGuild(guild));
        }, this.tickInterval);
        setInterval(() => {
            this.voiceProfileModule.saveAll();;
        }, this.saveInterval);
    }

    tickGuild(guild) {
        core.client.guilds.fetch(guild.guild_id)
        .then(g => {
            const rooms = core.getGuildVoiceRooms(guild.guild_id);
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
        this.voiceRoleModule.processUserByLevel(member, 10);

        let profile = this.voiceProfileModule.findVoiceProfile(member.id, guild.guild_id);
        if (profile) {
            profile.experience += this.getVoiceRoomExperience(room);
        } else {
            profile = {};
            Object.assign(profile, this.voiceProfileModule.getVoiceProfileTemplate());
            profile.user_id = member.id;
            profile.guild_id = guild.guild_id;
            profile.experience = this.getVoiceRoomExperience(room);
            this.voiceProfileModule.voiceProfiles.push(profile);
        }

        if (profile.experience >= this.getNextLevelExperienceCount(profile.level)) {
            profile.experience -= this.getNextLevelExperienceCount(profile.level);
            profile.level++;
            profile.voicepoints += 10*profile.level;
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
        return (10+level)*10*level*level;
    }

    
}

module.exports = VoiceLevelModule