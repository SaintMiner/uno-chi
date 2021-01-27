const Command = require('../classes/command.js');

class TemplateCommand extends Command {

    commandVaddHelp = (message) => this.dropError(message, 'Command: `vadd <@who*> <xp*>`');

    constructor(client) {
        super(client, {
            slug: 'vadd',
            description: 'COMMAND_VADD_DESCRIPTION',
            category: 'Administration',
            aliases: [],
            usages: ['vadd <@who> <xp>'],
            permissions: ['ADMINISTRATOR'],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });
    }

    executeCustom(message, args) {
        let who = message.mentions.members.first();
        if (Number.isNaN(args[1]) || !args[1]) {
            return this.reply(this.getCommandHelp());
        }
        if (!who) {
            return this.reply('Будь добр, укажи персону');
        }

        let whoProfile = this.client.getVoiceProfile(who.user.id, message.guild.id);
        if (!whoProfile) {
            return this.reply('Указанная персона - не найдена в системе');
        } else {
            whoProfile.experience += +args[1];
            return this.reply('Добавилено!');
        }

    }
}

module.exports = TemplateCommand;