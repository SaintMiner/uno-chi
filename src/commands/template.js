const Command = require('../classes/command.js');

class RollCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'useless', //how command can be executed
            permissions: [], //discord server permissions
            systemAdmin: false, //only system administrators can launch this command
        });
    }

}

module.exports = RollCommand;