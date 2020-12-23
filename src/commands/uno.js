const Command = require('../classes/command.js');

class UnoCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'uno', //how command can be executed
            permissions: [], //discord server permissions
            systemAdmin: false, //only system administrators can launch this command
        });
    }

    executeCustom(message, args) {
        message.channel.send('Поможет, если сможет...');
    }
}

module.exports = UnoCommand;