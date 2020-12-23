const Command = require('../classes/command.js');

class TemplateCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'set', //how command can be executed
            permissions: ['ADMINISTRATOR'], //discord server permissions
            systemAdmin: false, //only system administrators can launch this command
        });
    }

    executeCustom(message, args) {
        switch(args[0]) {
            case 'voice':
                let roomSettings = args[3];
                let voiceChannel = {
                    room_id: args[1],
                    experience: args[2],
                    guild_id: message.guild.id,
                    support_weekday_double: false,
                    owner_id: args[4],
                };
                if (isNaN(voiceChannel.experience)) {
                    this.dropError(message, 'Command: `set voice <room_id> <hours> -<settings> <owner_id>`');
                }
                if (roomSettings) {
                    if (/-\w*/g.test(roomSettings)) {
                        console.log(roomSettings);
                    }
                }
            break;
        }
    }
}

module.exports = TemplateCommand;