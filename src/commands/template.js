const Command = require('../classes/command.js');

class RollCommand extends Command {

    constructor() {
        super({
            slug: 'useless'
        });
    }

}

module.exports = RollCommand;