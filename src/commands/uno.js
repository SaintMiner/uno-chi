const Command = require('../classes/command.js');

class UnoCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'uno',
            description: 'COMMAND_UNO_DESCRIPTION',
            category: 'Misc',
            aliases: [],
            usages: ['uno'],
            permissions: [],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });
    }

    executeCustom(message, args) {
        message.channel.send('Поможет, если сможет...');
        console.log(this.client.storage['voice_profiles']);
    }
}

module.exports = UnoCommand;