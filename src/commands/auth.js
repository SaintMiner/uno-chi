const Command = require('../classes/command.js');

class TemplateCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'vadd',
            description: 'COMMAND_AUTH_DESCRIPTION',
            category: 'Games',
            aliases: [],
            usages: ['auth'],
            permissions: [],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });
        this.rouletteWebsocketModule = this.client.modules.find(m => m.name == 'RouletteWebsocket');
    }

    executeCustom(message, args) {
        let code = Math.random().toString(36).substring(2, 18).toUpperCase();
        let voice_profile = this.client.getVoiceProfile(message.author.id, message.guild.id);
        if (!this.validateAuth(message, voice_profile)) return;
        // message.channel.send(`${message.guild.name}: \`${code}\``);
        message.author.send(`${message.guild.name}: \`${code}\``);
        this.rouletteWebsocketModule.players.push({
            code: code,
            user_id: message.author.id,
            guild_id: message.guild.id,
            voice_profile: voice_profile
        });
    }

    validateAuth(message, voice_profile) {
        
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