const Command = require('../classes/command.js');

class TopCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'useless', //how command can be executed
            permissions: [], //discord server permissions
            systemAdmin: false, //only system administrators can launch this command
        });
    }

    executeCustom(message, args) {
        message.channel.send('The useless command');
    }
}

module.exports = TopCommand;