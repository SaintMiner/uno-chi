const Extension = require('@core/classes/extension');
const { error } = require('pretty-console-logs');

const setVoiceRoles = require('./commands/set-voice-roles');

class VoiceRoleExtension extends Extension {
    constructor() {
        super();
        this.voiceRolesModel = require('./models/voice-role-model');
        this.voiceRoles = [];
        this.loadVoiceRoles();
    }

    commands() {
        return [
            setVoiceRoles,
        ]
    }

    async loadVoiceRoles() {
        this.voiceRolesModel = core.getConnection().loadSchema('VoiceRolesModel', this.voiceRolesModel);
        await this.voiceRolesModel.syncDBAsync().catch(err => {throw err});
        await this.fetchVoiceRoles();
    }

    async fetchVoiceRoles() {
        await this.voiceRolesModel.findAsync({}, {raw: true}).then(result => this.voiceRoles = result);
    }

    saveLocal(voiceRole) {
        if (voiceRole.template) {
            this.voiceRoles.push(voiceRole);
        }
    }

    async save(voiceRole) {
        let record = new this.voiceRolesModel(voiceRole);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));
    }

    getTemplate(guild_id = '', level = 0, add_roles = [], remove_roles = []) {
        return {
            guild_id: guild_id,
            level: level,
            add_roles: add_roles,
            remove_roles: remove_roles
        };
    }

    getGuildVoiceRoles(guild_id) {
        return this.voiceRoles.filter(vr => vr.guild_id == guild_id);
    }

    findVoiceRole(guild_id, level) {
        let record = this.voiceRoles.find(vr => vr.guild_id == guild_id && vr.level == level);
        if (!record) {
            record = this.getTemplate(guild_id, level);
        }
        return record;
    }

    async processUserByLevel(member, level) {
        let guildRoles = this.getGuildVoiceRoles(member.guild.id);
        let levelRoles = guildRoles.find(vr => vr.level == level);
        
        if (levelRoles) {
            for await (const role of levelRoles.add_roles) {
                await member.guild.roles.fetch(role).then(r => member.roles.add(r));
            }
            for await (const role of levelRoles.remove_roles) {
                await member.guild.roles.fetch(role).then(r => member.roles.remove(r));
            }
        }
    }

    
}

module.exports = VoiceRoleExtension;