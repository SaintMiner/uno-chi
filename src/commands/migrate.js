const Command = require('../classes/command.js');

class RollCommand extends Command {

    constructor() {
        super({
            slug: 'migrate'
        });
    }

    execute(message, args, modules) {
        console.log(modules.find(m => m.name == "Commands").client.profiles);
    }

}

module.exports = RollCommand;