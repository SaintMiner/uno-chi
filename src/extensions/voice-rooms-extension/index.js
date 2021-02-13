const Extension = require('@core/classes/extension');

class VoiceRoomExtension extends Extension {
    constructor() {
        super();
        this.voiceRoomsModel = require('./models/voice-room-model');
        this.voiceRooms = [];
        this.loadVoiceRooms();        
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
        await this.fetchVoiceRooms();
    }

    getGuildVoiceRooms(guild_id) {
        return this.voiceRooms.filter(vr => vr.guild_id == guild_id);
    }

    
}

module.exports = VoiceRoomExtension