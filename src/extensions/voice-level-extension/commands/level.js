function createLevel(message, args) {
    const VoiceRoleExtension = core.getExtension('VoiceRoleExtension');
    
    if (!args.level) return core.sendLocalizedError(message, `LEVEL_MUST_BE_SPECIFIED`);
    if (isNaN(args.level)) return core.sendLocalizedError(message, `LEVEL_MUST_BE_NUMBER`);
    
    let level = +args.level[0];
    let levelRoles = VoiceRoleExtension.findVoiceRole(message.guild.id, level);

    levelRoles.add_roles = args.add || [];
    levelRoles.remove_roles = args.remove || [];

    VoiceRoleExtension.save(levelRoles);
    VoiceRoleExtension.saveLocal(levelRoles);
}

function removeLevel(message, args, overage) {
    const VoiceRoleExtension = core.getExtension('VoiceRoleExtension');
    let level = overage[0]

    if (isNaN(level)) return core.sendLocalizedError(message, `LEVEL_MUST_BE_NUMBER`);

    let levelRoles = VoiceRoleExtension.findVoiceRole(message.guild.id, level);
    if (levelRoles.isTemplate) return core.sendLocalizedError(message, `LEVEL_NOT_FOUND`);

    VoiceRoleExtension.delete(levelRoles);

}

let remove = {
    permissions: ['ADMINISTRATOR'],
    slug: 'remove',
    execute: removeLevel,
}

let create = {
    permissions: ['ADMINISTRATOR'],
    slug: 'create',
    execute: createLevel,
}

let command = {
    permissions: ['ADMINISTRATOR'],
    slug: 'level',
    childrens: [ create, remove ],
}

module.exports = command;