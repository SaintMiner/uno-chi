const Extension = require('@core/classes/extension');
const { info, warn, error, log } = require('pretty-console-logs');

class VoiceProfileExtension extends Extension {
    constructor() {
        super();
        this.voiceProfilesModel = require('./models/voice-profile-model');
        this.voiceProfiles = [];
        
        this.loadVoiceProfiles();
        core.findVoiceProfile = (user_id, guild_id) => this.findVoiceProfile(user_id, guild_id);
    }

    commands() {
        return [
            require('./commands/info'),
            require('./commands/top'),
        ];
    }

    async loadVoiceProfiles() {
        this.voiceProfilesModel = core.getConnection().loadSchema('VoiceProfilesModel', this.voiceProfilesModel);
        await this.voiceProfilesModel.syncDBAsync().catch(err => {throw err});
        await this.fetchVoiceProfiles();
    }

    async fetchVoiceProfiles() {
        await this.voiceProfilesModel.findAsync({}, {raw: true}).then(result => {
            this.voiceProfiles = result.map(profile => {
                if (!profile.time_spents) profile.time_spents = {};
                return profile;
            });
        });
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
            time_spents: {global: 0},
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

module.exports = VoiceProfileExtension