const Extension = require('@core/classes/extension');

class TextProfileExtension extends Extension {
    constructor() {
        super();
        this.textProfilesModel = require('./models/text-profile-model');
        this.textProfiles = [];
        this.loadTextProfiles();
    }

    async loadTextProfiles() {
        this.textProfilesModel = core.getConnection().loadSchema('TextProfilesModel', this.textProfilesModel);
        await this.textProfilesModel.syncDBAsync().catch(err => {throw err});
        await this.fetchTextProfiles();
    }

    async fetchTextProfiles() {
        await this.textProfilesModel.findAsync({}, {raw: true}).then(result => this.textProfiles = result);
    }

    findTextProfile(user_id) {
        return this.textProfiles.find(tp => tp.user_id == user_id);
    }

    async save(textProfile) {
        let record = new this.textProfilesModel(textProfile);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
        await this.fetchTextProfiles();
    }

    
}

module.exports = TextProfileExtension;