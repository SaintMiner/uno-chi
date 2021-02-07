const Module = require('@core/classes/module');

class TextProfileModule extends Module {
    constructor() {
        super(2);
        this.textProfilesModel = require('./Models/TextProfileModel');
        this.textProfiles = [];
    }

    init() {
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

module.exports = TextProfileModule