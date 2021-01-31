const Module = require('@core/classes/module');

class VoiceProfileModule extends Module {
    constructor() {
        super(2);
        this.voiceProfilesModel = require('./Models/VoiceProfileModel');
        this.voiceProfiles = [];
    }

    init() {
        this.loadVoiceProfiles();
    }

    async loadVoiceProfiles() {
        this.voiceProfilesModel = core.getConnection().loadSchema('VoiceProfilesModel', this.voiceProfilesModel);
        await this.voiceProfilesModel.syncDBAsync().catch(err => {throw err});
        await this.fetchVoiceProfiles();
        console.log(this.voiceProfiles);
    }

    async fetchVoiceProfiles() {
        await this.voiceProfilesModel.findAsync({}, {raw: true}).then(result => this.voiceProfiles = result);
    }

    findVoiceProfile(user_id) {
        return this.voiceProfiles.find(vp => vp.user_id == user_id);
    }

    async saveGuild(voiceProfile) {
        let record = new this.voiceProfilesModel(voiceProfile);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
        await this.fetchVoiceProfiles();
    }

    
}

module.exports = VoiceProfileModule