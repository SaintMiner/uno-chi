const { show } = require('../../voice-level-extension/rest');
async function execute(message, args) {
    let code = Math.random().toString(36).substring(2, 18).toUpperCase();
    // let voice_profile = core.findVoiceProfile(message.author.id, message.guild.id);
    let voice_profile = await show(message.guild.id, message.author.id);
    if (!validateAuth(message, voice_profile)) return;
    // message.channel.send(`${message.guild.name}: \`${code}\``);
    message.author.send(`${message.guild.name}: \`${code}\``);
    core.getExtension('RouletteWebsocket').players.push({
        code: code,
        user_id: message.author.id,
        guild_id: message.guild.id,
        voice_profile: voice_profile
    });
}

function validateAuth(message, voice_profile) {
    
    if (!voice_profile) {
        core.sendLocalizedError(message, `BECOME_A_MEMBER_OF_SYSTEM`);
        return;
    }
    let player = core.getExtension('RouletteWebsocket').players.find(player => player.user_id == voice_profile.user_id && player.guild_id == voice_profile.guild_id);
    if (player) {
        core.sendLocalizedError(message, `CODE_WAS_RECEIVE`);
        return;
    }

    return true;
}

let auth = {
    slug: 'auth',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: execute,
    childrens: [],
}

module.exports = auth;