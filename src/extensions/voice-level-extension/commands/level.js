function createLevel(message, args) {
    const VoiceRoleExtension = core.getExtension('VoiceRoleExtension');
    
    if (!args.level) return;
    if (isNaN(args.level)) return;
    
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

    if (isNaN(level)) return;

    let levelRoles = VoiceRoleExtension.findVoiceRole(message.guild.id, level);
    if (levelRoles.isTemplate) return;

    VoiceRoleExtension.delete(levelRoles);

}

let remove = {
    slug: 'remove',
    execute: removeLevel,
}

let create = {
    slug: 'create',
    execute: createLevel,
}

let command = {
    slug: 'level',
    childrens: [ create, remove ],
}

module.exports = command;