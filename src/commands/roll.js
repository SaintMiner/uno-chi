const Command = require('../classes/command.js');

class RollCommand extends Command {

    constructor() {
        super({
            slug: 'roll'
        });
    }

    execute(message, args) {
        message.channel.send('The roll');
    }
}

module.exports = RollCommand;