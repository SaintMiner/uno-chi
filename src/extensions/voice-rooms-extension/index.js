const Extension = require('@core/classes/extension');
const setVoiceRoom = require('./commands/set-voice-room');

const { info, warn, error, log } = require('pretty-console-logs');

class VoiceRoomExtension extends Extension {
    constructor() {
        super();
        this.voiceRoomsModel = require('./models/voice-room-model');
        this.voiceRooms = [];
        this.loadVoiceRooms();        
    }

    commands() {
        return [
            setVoiceRoom,
        ]
    }

    async loadVoiceRooms() {
        this.voiceRoomsModel = core.getConnection().loadSchema('VoiceRoomsModel', this.voiceRoomsModel);
        await this.voiceRoomsModel.syncDBAsync().catch(err => {throw err});
        await this.fetchVoiceRooms();
    }

    async fetchVoiceRooms() {
        await this.voiceRoomsModel.findAsync({}, {raw: true}).then(result => this.voiceRooms = result);
    }

    async save(voiceRoom) {
        let record = new this.voiceRoomsModel(voiceRoom);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
    }

    async delete(voiceRoom) {
        await this.voiceRoomsModel.deleteAsync({guild_id: voiceRoom.guild_id, room_id: voiceRoom.room_id}, (err) => {
            if(err) console.log(err);
        });
    }

    saveLocal(voiceRoom) {
        if (voiceRoom.isTemplate) {
            this.voiceRooms.push(voiceRoom);
        }
    }

    getGuildVoiceRooms(guild_id) {
        return this.voiceRooms.filter(vr => vr.guild_id == guild_id);
    }

    findVoiceRoom(guild_id, room_id) {
        let room = this.voiceRooms.find(vr => vr.room_id == room_id && vr.guild_id == guild_id);
        if (!room) {
            room = this.getTemplate(guild_id, room_id);
        }
        return room;
    }

    getTemplate(guild_id, room_id) {
        return {
            guild_id: guild_id,
            room_id: room_id,
            settings: {
                experience: 0,
            },
            isTemplate: true
        }
    }

    
}

module.exports = VoiceRoomExtension