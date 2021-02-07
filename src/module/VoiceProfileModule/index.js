const Module = require('@core/classes/module');
const { info, warn, error, log } = require('pretty-console-logs');

class VoiceProfileModule extends Module {
    constructor() {
        super(2);
        this.voiceProfilesModel = require('./Models/VoiceProfileModel');
        this.voiceProfiles = [];
    }

    init() {
        this.loadVoiceProfiles();
        core.findVoiceProfile = (user_id) => this.findVoiceProfile(user_id);
    }

    commands() {
        return require('./commands');
    }

    async loadVoiceProfiles() {
        this.voiceProfilesModel = core.getConnection().loadSchema('VoiceProfilesModel', this.voiceProfilesModel);
        await this.voiceProfilesModel.syncDBAsync().catch(err => {throw err});
        await this.fetchVoiceProfiles();
    }

    async fetchVoiceProfiles() {
        await this.voiceProfilesModel.findAsync({}, {raw: true}).then(result => this.voiceProfiles = result);
    }

    findVoiceProfile(user_id, guild_id) {
        return this.voiceProfiles.find(vp => vp.user_id == user_id && vp.guild_id == guild_id);
    }

    getVoiceProfileTemplate() {
        return {
            user_id: null,
            guild_id: null,
            experience: 0,
            level: 1,
            pray_date: null,
            pray_streak: 0,
            time_spents: [],
            voicepoints: 0
        }
    }

    async save(voiceProfile) {
        let record = new this.voiceProfilesModel(voiceProfile);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));        
    }

    saveAll() {
        info(`[${this.name}] Saving voice profiles (${moment().format('DD.MM.YYYY HH:mm:ss')})`);
        this.voiceProfiles.forEach(profile => this.save(profile));
    }

    
}

module.exports = VoiceProfileModule