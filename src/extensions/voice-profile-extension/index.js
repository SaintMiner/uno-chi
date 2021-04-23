const Extension = require('@core/classes/extension');
const { info, warn, error, log } = require('pretty-console-logs');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

class VoiceProfileExtension extends Extension {
    constructor() {
        super();
        this.voiceProfilesModel = require('./models/voice-profile-model');
        this.voiceProfiles = [];
        
        this.loadVoiceProfiles();
        core.findVoiceProfile = (user_id, guild_id) => this.findVoiceProfile(user_id, guild_id);

        this.backupInterval = 24 * 60 * 60 * 1000;

        setInterval(() => {
            this.backup();;
        }, this.backupInterval);
    }

    commands() {
        return [
            require('./commands/info'),
            require('./commands/top'),
            require('./commands/backup'),
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

    backup() {
        info(`[${this.name}] Backup voice profiles (${moment().format('DD.MM.YYYY HH:mm:ss')})`)
        let data = JSON.stringify(this.voiceProfiles);
        let filePath = `backups/voice_profile_${moment().format('YYYY_MM_DD_hhmmss')}_backup.json`;        
        if (!fs.existsSync(path.resolve('backups'))) {
            fs.mkdirSync(path.resolve('backups'));
        }
        fs.writeFileSync(path.resolve(filePath), data);
    }

    
}

module.exports = VoiceProfileExtension