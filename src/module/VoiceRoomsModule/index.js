const Module = require('@core/classes/module');

class VoiceRoomModule extends Module {
    constructor() {
        super(2);
        this.voiceRoomsModel = require('./Models/VoiceRoomModel');
        this.voiceRooms = [];
    }

    init() {
        this.loadVoiceRooms();
        core.getGuildVoiceRooms = (guild_id) => this.getGuildVoiceRooms(guild_id);
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

module.exports = VoiceRoomModule