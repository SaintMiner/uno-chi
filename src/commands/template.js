const Command = require('../classes/command.js');

class RollCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'useless'
        });
    }

}

module.exports = RollCommand;