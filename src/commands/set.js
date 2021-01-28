const Command = require('../classes/command.js');

class SetCommand extends Command {

    commandSetVoiceHelp = (message) => this.dropError(message, 'Command: `set voice <room_id*> <xp*[-100 - 100]> -<settings> <owner_id>`');

    constructor(client) {
        super(client, {
            slug: 'set',
            description: 'COMMAND_SET_DESCRIPTION',
            category: 'Administration',
            aliases: [],
            usages: [
                'set voice <voice_channel_id> <xp [-100 - 100]> -<settings> <owner_id>',
                'set alert <text_channel_id>',
                'set roulette <text_channel_id>'
            ],
            permissions: ['ADMINISTRATOR'],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });
        this.voiceRoomModel = this.client.models.find(m => m._properties.name == 'VoiceRooms');
        this.voiceRoleModel = this.client.models.find(m => m._properties.name == 'VoiceRoles');
        this.guildModel     = this.client.models.find(m => m._properties.name == 'Guilds');
    }

    executeCustom(message, args) {
        switch(args[0]) {
            case 'voice':
                let newRoom = false;
                let voice_room = this.client.storage['voice_rooms']
                    .find(v => v.room_id == args[1] && v.guild_id == message.guild.id);

                if (!voice_room) {
                    newRoom = true;
                    voice_room = {
                        room_id: args[1],
                        experience: +args[2],
                        guild_id: message.guild.id,
                        support_weekday_double: false,
                        owner_id: args[4],
                    };
                } else {
                    voice_room.room_id = args[1];
                    voice_room.experience = +args[2];
                    voice_room.owner_id = args[4];
                }

                this.setVoice(message, args[3], voice_room, newRoom);                
            break;

            case 'voicelevel':
                this.setVoiceLevel(message, args[1], args[2],args.slice(3));
            break;

            case 'alert':
                this.setAlert(message, args[1]);
            break;

            case 'roulette':
                this.setRoulette(message, args[1]);
            break;
        }
    }

    async setRoulette(message, roullete) {
        if (roullete) {            
            await this.client.channels.fetch(roullete).then(a => {
                if (a) {
                    if (a.type != 'text') {
                        this.dropError(message, 'The roullete channel must be text channel!');
                        roullete = null;
                        return false;
                    }
                } else {
                    roullete = null;
                }
            }).catch(e => {
                this.dropError(message, 'This channel does not exist!');
                roullete = null;
                return false;
            });
        } else {
            roullete = null;
        }

        let guild = this.client.storage['guilds'].find(g => g.guild_id == message.guild.id);
        if (!guild) {
            guild = {
                guild_id: message.guild.id,
                roullete_channel_id: roullete,
            };
            this.client.storage['guilds'].push(guild);
        } else {
            guild.roullete_channel_id = roullete;
        }

        guild = new this.guildModel(guild);
        guild.save(function(err){
            if(err) console.log(err);
        });
        message.channel.send('Saved!');
    }

    async setAlert(message, alert) {
        if (alert) {            
            await this.client.channels.fetch(alert).then(a => {
                if (a) {
                    if (a.type != 'text') {
                        this.dropError(message, 'The alert channel must be text channel!');
                        return false;
                    }
                } else {
                    alert = null;
                }
            }).catch(e => {
                this.dropError(message, 'This channel does not exist!');
                return false;
            });
        } else {
            alert = null;
        }

        let guild = this.client.storage['guilds'].find(g => g.guild_id == message.guild.id);
        if (!guild) {
            guild = {
                guild_id: message.guild.id,
                alert_channel_id: alert,
            };
            this.client.storage['guilds'].push(guild);
        } else {
            guild.alert_channel_id = alert;
        }

        guild = new this.guildModel(guild);
        guild.save(function(err){
            if(err) console.log(err);
        });
        message.channel.send('Saved!');

    }

    async setVoiceLevel(message, level, mode, roles) {
        if (!roles) {
            roles = []
        } else {
            roles = [...new Set(roles)];
        }

        if (await this.validateSetVoiceLevel(message, level, mode, roles)) {
            let roleBuff = [];
            let voiceRole = this.client.storage['voice_roles']
                .find(v => v.level == level && v.guild_id == message.guild.id);
            if (!voiceRole) {
                voiceRole = {
                    guild_id: message.guild.id,
                    level: +level   
                };
                this.client.storage['voice_roles'].push(voiceRole);
            }
            await roles.forEach(async (role) => {
                await message.guild.roles.fetch(role).then(r => {
                    if (r) {
                        roleBuff.push(role);
                    }
                }).catch(e => {
                    throw e
                });
            });
            
            if (mode == '-a') {
                voiceRole.add_roles = roleBuff;
            }
            if (mode == '-r') {
                voiceRole.remove_roles = roleBuff;
            }

            let voice_role = new this.voiceRoleModel(voiceRole);
            voice_role.save(function(err){
                if(err) console.log(err);
            });
            message.channel.send('Saved!');
        }

    }
   
    async setVoice(message, roomSettings, voiceChannel, newRoom) {        
        if (await this.validateSetVoice(message, roomSettings, voiceChannel)) {
            if (roomSettings) {
                voiceChannel.support_weekday_double = roomSettings.includes('w');                    
                voiceChannel.settings.mining = roomSettings.includes('m');
            }

            if(newRoom) this.client.storage['voice_rooms'].push(voiceChannel);
            let room = new this.voiceRoomModel(voiceChannel);
            room.save(function(err){
                if(err) console.log(err);
            });
            message.channel.send('Saved!');
        }        
    }

    async validateSetVoiceLevel(message, level, mode, roles) {
        if (!mode) {
            this.dropError(message, 'Mode is required! Available options: [-a, -r]');
            return false;
        } 
        if (mode != '-r' && mode != '-a') {
            this.dropError(message, 'Mode is required! Available options: [-a, -r]');
            return false;
        }
        if (isNaN(level)) {
            this.dropError(message, 'Level must be a number!');
            return false;
        }
        if (level > 10000 || level < 1) {
            this.dropError(message, 'Я думаю ты больше 8 лет не проживешь...');
            return false;
        }
        return true;
    }

    async validateSetVoice(message, roomSettings, voiceChannel) {
        let roomSettingsReges = /-\w*/g;
        if (!voiceChannel.room_id || isNaN(voiceChannel.experience)) {
            this.commandSetVoiceHelp(message);
            return false;
        } else {
            await this.client.channels.fetch(voiceChannel.room_id).then(room => {
                if (message.guild.id != room.guild.id) {
                    this.dropError(message, 'You can only set your guild voice rooms!');
                    return false;
                }
                if (room.type != 'voice') {
                    this.dropError(message, 'You can only voice rooms!');
                    return false;
                }
            }).catch(e => {
                this.dropError(message, 'This room does not exist!');
                return false;
            });
        }
        if (isNaN(voiceChannel.experience)) {
            this.commandSetVoiceHelp(message);
            return false;
        }
        if (voiceChannel.experience > 100 || voiceChannel.experience < -100) {
            this.commandSetVoiceHelp(message);
            return false;
        }
        if (roomSettings) {
            if (!roomSettingsReges.test(roomSettings)) {
                this.commandSetVoiceHelp(message);
                return false;
            }
        }
        return true;
    }
}

module.exports = SetCommand;