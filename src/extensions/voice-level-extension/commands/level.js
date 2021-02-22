const { MessageEmbed } = require("discord.js");

function viewLevels(message) {
    const voiceRoleExtension = core.getExtension('VoiceRoleExtension');
    let guildLevels = voiceRoleExtension.voiceRoles.filter(role => role.guild_id == message.guild.id);    
    let embed = new MessageEmbed().setColor("#580ad6")
    if (!guildLevels.length) {
        embed.setDescription('No levels yet');
    } else {        
        guildLevels.forEach(level => {

            let addRoles = `add:`;
            if (level.add_roles) {
                level.add_roles.forEach(addRole => {
                    let role = message.guild.roles.resolve(addRole);
                    if (!role) return;
                    addRoles += ` ${role.name}`;
                });
                
            }
            
            let removeRoles = `remove:`;
            if (level.remove_roles) {
                level.remove_roles.forEach(removeRole => {
                    let role = message.guild.roles.resolve(removeRole);
                    if (!role) return;
                    removeRoles += ` ${role.name}`;
                });
            }

            embed.addField(`${level.level} level`, addRoles+'\n'+removeRoles);
        })
    }
    

    message.channel.send(embed);
}

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

    core.sendSuccessful(message);
}

function removeLevel(message, args, overage) {
    const VoiceRoleExtension = core.getExtension('VoiceRoleExtension');
    let level = overage[0]

    if (isNaN(level)) return core.sendLocalizedError(message, `LEVEL_MUST_BE_NUMBER`);

    let levelRoles = VoiceRoleExtension.findVoiceRole(message.guild.id, level);
    if (levelRoles.isTemplate) return core.sendLocalizedError(message, `LEVEL_NOT_FOUND`);

    let roleIndex = VoiceRoleExtension.voiceRoles.indexOf(levelRoles);
    if (roleIndex > -1) {
        VoiceRoleExtension.voiceRoles.splice(roleIndex, 1);
    }
    VoiceRoleExtension.delete(levelRoles);

    core.sendSuccessful(message);

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
    execute: viewLevels,
    childrens: [ create, remove ],
}

module.exports = command;