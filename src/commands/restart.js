const Command = require('../classes/command.js');

class RestartCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'restart',
            description: 'COMMAND_RESTART_DESCRIPTION',
            category: 'System',
            aliases: [],
            usages: ['pray'],
            permissions: ['ADMINISTRATOR'],
            whiteListedUsers: [],
            isHidden: true,
            isPrivate: true,
        });
    }

    executeCustom() {
        return;
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

module.exports = RestartCommand;