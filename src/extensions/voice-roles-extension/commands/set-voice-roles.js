
let { voice, set } = require('../../voice-level-extension/commands/set-voice');

function setRoles(message, args) {
    let voiceRoleExtension = core.getExtension('VoiceRoleExtension');
    if (args.level) {
        if (isNaN(args.level[0])) return;

        let voiceRole = voiceRoleExtension.findVoiceRole(message.guild.id, +args.level[0]);
        
        if (!voiceRole) return;        
        voiceRole.add_roles = args.add ? args.add : [];
        voiceRole.add_roles = voiceRole.add_roles.filter(role => {
            return !!message.guild.roles.resolve(role);
        });
        voiceRole.remove_roles = args.remove ? args.remove : [];        
        voiceRole.remove_roles = voiceRole.remove_roles.filter(role => {
            return !!message.guild.roles.resolve(role);
        });
        voiceRoleExtension.save(voiceRole);
        voiceRoleExtension.saveLocal(voiceRole);
        message.channel.send(":white_check_mark:");
    }
}

let roles = {
    slug: 'roles',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: ['ADMINISTRATOR'],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: setRoles,
    childrens: [],
}

voice.childrens.push(roles);
set.childrens.push(voice);

module.exports = set;