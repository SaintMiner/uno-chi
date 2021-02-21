const { MessageEmbed } = require('discord.js');

function createRoom(message, args) {
    const voiceRoomExtension = core.getExtension('VoiceRoomExtension');
    
    if (!args.id) return core.sendLocalizedError(message, `ROOM_ID_MUST_BE_SPECIFIED`);
    if (!args.exp) return core.sendLocalizedError(message, `EXPERIENCE_MUST_BE_SPECIFIED`);

    let room_id = args.id[0];
    let experience = args.exp[0];
    let mining = args.mining ? args.mining[0] : 0;
    let channel = message.guild.channels.resolve(room_id);

    if (!channel) return core.sendLocalizedError(message, `CHANNEL_NOT_FOUND`);
    if (channel.type != 'voice') return core.sendLocalizedError(message, `CHANNEL_MUST_BE_VOICE`);
    if (isNaN(experience)) return core.sendLocalizedError(message, `EXPERIENCE_MUST_BE_A_NUMBER`);


    let room = voiceRoomExtension.findVoiceRoom(message.guild.id, room_id);
    room.settings.experience = experience;

    if (!isNaN(mining[0])) {
        room.settings.mining = mining;
    }
    
    voiceRoomExtension.save(room);
    voiceRoomExtension.saveLocal(room);

    core.sendSuccessful(message);
}

function getRoomInfo(message, args, overage) {
    const voiceRoomExtension = core.getExtension('VoiceRoomExtension');

    let room_id = overage[0];
    let room = voiceRoomExtension.findVoiceRoom(message.guild.id, room_id);
    if (room.isTemplate) return core.sendLocalizedError(message, `ROOM_IS_NOT_PART_OF_VOICE_SYSTEM`);
    let channel = message.guild.channels.resolve(room.room_id);

    let memberCount = channel.members.filter(member => !member.bot).size;
    let embed = new MessageEmbed();
    
    let visitorFieldTitle = __({ phrase: `VISITORS`, locale: core.getGuildLanguage(message.guild.id)});
    let miningFieldTitle = __({ phrase: `MINING`, locale: core.getGuildLanguage(message.guild.id)});
    let title = __(
        { 
            phrase: `Voice room information "{{name}}"`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            name: channel.name
        }
    );
    let xpPerTickFieldTitle = __(
        { 
            phrase: `XP per {{tick}} seconds`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            tick: core.configuration.voice_tick
        }
    );
    
    embed.setColor("#580ad6")
        .setTitle(title)
        .addField(visitorFieldTitle, memberCount, true)
        .addField(xpPerTickFieldTitle, room.settings.experience, true);
        
    if (room.settings.mining) {
        embed.addField(miningFieldTitle, room.settings.mining, true);
    }

    message.channel.send(embed);
}

function removeRoom(message, args, overage) {
    const voiceRoomExtension = core.getExtension('VoiceRoomExtension');

    let room_id = overage[0];
    let room = voiceRoomExtension.findVoiceRoom(message.guild.id, room_id);
    if (room.isTemplate) return core.sendLocalizedError(message, `ROOM_IS_NOT_PART_OF_VOICE_SYSTEM`);

    voiceRoomExtension.delete(room);

    core.sendSuccessful(message);
}

let remove = {
    permissions: ['ADMINISTRATOR'],
    slug: 'remove',
    execute: removeRoom,
}

let info = {
    slug: 'info',
    execute: getRoomInfo,
}

let create = {
    permissions: ['ADMINISTRATOR'],
    slug: 'create',
    execute: createRoom,
}

let command = {
    slug: 'room',
    childrens: [ create, info, remove ],
}

module.exports = command;