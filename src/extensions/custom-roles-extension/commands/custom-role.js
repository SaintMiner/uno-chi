function createCustomRole(message, args, overage) {
    const CustomRolesExtension = core.getExtension('CustomRolesExtension');
    
    let role_id = overage[0];

    if (!role_id) return core.sendLocalizedError(message, `ROLE_ID_MUST_BE_DEFINED`);
    if (!message.guild.roles.resolve(role_id)) return core.sendLocalizedError(message, `ROLE_DOES_NOT_EXISTS`);

    
    let customRole = CustomRolesExtension.findCustomRole(message.guild.id, role_id);
    
    if (args.hasOwnProperty('baking')) {
        customRole.settings.baking = 'true';
    }

    if (args.hasOwnProperty('farmer')) {
        customRole.settings.farmer = 'true';
    }

    CustomRolesExtension.save(customRole);

    core.sendSuccessful(message);
}

function removeCustomRole(message, args, overage) {
    const CustomRolesExtension = core.getExtension('CustomRolesExtension');

    let role_id = overage[0];

    if (!role_id) return core.sendLocalizedError(message, `ROLE_ID_MUST_BE_DEFINED`);

    let customRole = CustomRolesExtension.findCustomRole(message.guild.id, role_id);

    if (customRole.isTemplate) return core.sendLocalizedError(message, `CUSTOM_ROLE_DOES_NOT_EXISTS`);

    let index = CustomRolesExtension.customRoles.indexOf(customRole);
    if (index > -1) {
        CustomRolesExtension.customRoles.splice(index, 1);
    }

    CustomRolesExtension.delete(customRole);

    core.sendSuccessful(message);
}

const croleRemove = {
    slug: 'remove',
    permissions: ['ADMINISTRATOR'],
    execute: removeCustomRole
}

const croleCreate = {
    slug: 'create',
    permissions: ['ADMINISTRATOR'],
    execute: createCustomRole
}

const crole = {
    slug: 'crole',
    permissions: ['ADMINISTRATOR'],
    childrens: [ croleCreate, croleRemove ]
}

const command = {
    slug: 'guild',
    permissions: ['ADMINISTRATOR'],
    childrens: [ crole ]
}

module.exports = command;
