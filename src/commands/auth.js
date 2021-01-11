const Command = require('../classes/command.js');

class TemplateCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'auth', //how command can be executed
            permissions: [], //discord server permissions
            systemAdmin: false, //only system administrators can launch this command
        });
        this.rouletteWebsocketModule = this.client.modules.find(m => m.name == 'RouletteWebsocket');
    }

    executeCustom(message, args) {
        let code = Math.random().toString(36).substring(2, 18).toUpperCase();

        if (!this.validateAuth(message)) return;
        // message.author.send(`${message.guild.name}: \`${code}\``);
        this.rouletteWebsocketModule.players.push({
            code: code,
            user_id: message.author.id,
            guild_id: message.guild.id,
        });
        console.log(this.rouletteWebsocketModule.players);
    }

    validateAuth(message) {
        let voice_profile = this.client.storage['voice_profiles']
            .find(profile => profile.user_id == message.author.id && profile.guild_id == message.guild.id);
        
        if (!voice_profile) {
            this.dropError(message, 'Для начала стань частью системы...');
            return;
        }
        let player = this.rouletteWebsocketModule.players.find(player => player.user_id == voice_profile.user_id && player.guild_id == voice_profile.guild_id);
        if (player) {
            this.dropError(message, 'Ты уже получил код!');
            return;
        }

        return true;
    }
}

module.exports = TemplateCommand;