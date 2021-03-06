const Command = require('../classes/command.js');

class TemplateCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'vpadd',
            description: 'COMMAND_VPADD_DESCRIPTION',
            category: 'Administration',
            aliases: [],
            usages: ['uno'],
            permissions: ['ADMINISTRATOR'],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });
    }

    executeCustom(message, args) {
        let who = message.mentions.members.first();
        if (Number.isNaN(args[1]) || !args[1]) {
            // this.commandVaddHelp(message);
            return ;
        }
        if (!who) {
            return this.dropError(message, 'Его нет');
        }
        let who_profile = this.client.storage['voice_profiles']
            .find(vp => vp.user_id == who.user.id && vp.guild_id == message.guild.id);
        if (!who_profile) {
            return this.dropError(message, 'Его нет в системе');
        } else {
            who_profile.voicepoint += +args[1];
            return this.dropError(message, 'Добавилено!');
        }
    }
}

module.exports = TemplateCommand;