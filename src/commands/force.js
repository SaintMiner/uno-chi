const Command = require('../classes/command.js');

class ForceCommand extends Command {

    forcedWeedayInterval = null;

    constructor(client) {
        super(client, {
            slug: 'force',
            description: 'COMMAND_FORCE_DESCRIPTION',
            category: 'System',
            aliases: [],
            usages: ['force weekday <hours>'],
            permissions: [],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: true,
        });
    }

    executeCustom(message, args) {
        switch(args[0]) {
            case 'weekday':
                this.client.forceWeekday = true;
                let hours = +args[1] ? +args[1] : 12
                let interval = hours * 60 * 60 * 1000;
                clearInterval(this.forcedWeedayInterval);
                this.forcedWeedayInterval = setInterval(() => {
                    this.client.forceWeekday = false;
                }, interval);
                message.channel.send(`Now is weekday for ${hours}h!`);
            break;
            default: 
                this.dropError(message, 'You can force: `weekday <hours>`');
        }
    }
}

module.exports = ForceCommand;