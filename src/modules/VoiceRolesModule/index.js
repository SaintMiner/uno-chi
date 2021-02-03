const Module = require('@core/classes/module');

class VoiceRoleModule extends Module {
    constructor() {
        super(2);
        this.voiceRolesModel = require('./Models/VoiceRoleModel');
        this.voiceRoles = [];
    }

    init() {
        this.loadVoiceRoles();
        core.getGuildVoiceRoles = (guild_id) => this.getGuildVoiceRoles(guild_id);
    }

    async loadVoiceRoles() {
        this.voiceRolesModel = core.getConnection().loadSchema('VoiceRolesModel', this.voiceRolesModel);
        await this.voiceRolesModel.syncDBAsync().catch(err => {throw err});
        await this.fetchVoiceRoles();
    }

    async fetchVoiceRoles() {
        await this.voiceRolesModel.findAsync({}, {raw: true}).then(result => this.voiceRoles = result);
    }

    async save(voiceRole) {
        let record = new this.voiceRolesModel(voiceRole);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
        await this.fetchVoiceRoles();
    }

    getGuildVoiceRoles(guild_id) {
        return this.voiceRoles.filter(vr => vr.guild_id == guild_id);
    }

    processUserByLevel(member, level) {
        let guildRoles = this.getGuildVoiceRoles(member.guild.id);
        let levelRoles = guildRoles.filter(vr => vr.level == level);
        console.log(levelRoles);
        console.log(member.guild.id);
    }

    
}

module.exports = VoiceRoleModule