const Command = require('../classes/command.js');

class RollCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'restart', //how command can be executed
            permissions: ['ADMINISTRATOR'], //discord server permissions
            systemAdmin: true, //only system administrators can launch this command
        });
    }

    executeCustom() {
        process.on("exit", function () {
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached : true,
                stdio: "inherit"
            });
        });
        process.exit();
    }

}

module.exports = RollCommand;