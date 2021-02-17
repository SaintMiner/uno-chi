let { set, voice } = require('../../voice-level-extension/commands/set-voice');

function setRoom(message, args) {
    let voiceRoomExtension = core.getExtension('VoiceRoomExtension');
    
    if (!voiceRoomExtension) return;
    if (!args.room) return;
    if (!args.room[0]) return 
    if (!args.exp) return;
    if (isNaN(args.exp)) return;
    if (!message.guild.channels.resolve(args.room[0])) return;
        
    let room = voiceRoomExtension.findVoiceRoom(message.guild.id, args.room[0]);

    room.settings.experience = args.exp[0];
    room.settings.mining = args.mining ? args.mining[0] : '0';
    room.settings.weekend = args.hasOwnProperty('weekend').toString();

    voiceRoomExtension.save(room);
    voiceRoomExtension.saveLocal(room);
    
}

let room = {
    slug: 'room',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: ['ADMINISTRATOR'],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: setRoom,
    childrens: [],
}

voice.childrens.push(room);
set.childrens.push(voice);

module.exports = set;