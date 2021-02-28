const Extension = require('@core/classes/extension');

class CustomRolesExtension extends Extension {
    
    constructor() {
        super();

        this.isPublic = false;        
        this.customRoleModel = require('./models/custom-role-model');
        this.customRoles = [];

        this.loadSchema();
    }

    commands() {
        return [
            require('./commands/custom-role')
        ]
    }

    async loadSchema() {
        this.customRoleModel = core.getConnection().loadSchema('CustomRoleModel', this.customRoleModel);
        await this.customRoleModel.syncDBAsync().catch(err => {throw err});
        await this.fetchCustomRoles();
        console.log(this.customRoles);

    }

    async fetchCustomRoles() {
        await this.customRoleModel.findAsync({}, {raw: true})
            .then(result => this.customRoles = result.map(customRole => {
                if (!customRole.settings) customRole.settings = {};

                return customRole;
            }));
    }

    saveLocal(customRole) {
        if (customRole.isTemplate) {
            customRole.isTemplate = false;
            this.customRoles.push(customRole);
        }
    }

    async saveDB(customRole) {
        let record = new this.customRoleModel(customRole);
        await record.saveAsync().catch(err => error(`[${this.name}] ${err}`));        
    }

    save(customRole) {
        this.saveLocal(customRole);
        this.saveDB(customRole);
    }

    findCustomRole(guild_id, role_id) {
        let customRole = this.customRoles.find(customRole => customRole.guild_id == guild_id && customRole.role_id == role_id);
        if (!customRole) {
            customRole = this.getTemplate(guild_id, role_id);
        }
        return customRole;
    }

    async delete(customRole) {
        await this.customRoleModel.deleteAsync({guild_id: customRole.guild_id, role_id: customRole.role_id}, (err) => {
            if(err) console.log(err);
        });
    }

    getTemplate(guild_id, role_id) {
        return {
            guild_id,
            role_id,
            settings: {},
            isTemplate: true
        }
    }


}

module.exports = CustomRolesExtension;