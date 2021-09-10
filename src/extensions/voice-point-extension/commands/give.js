const { transaction, show } = require('../../voice-level-extension/rest');

async function give(message, args, overage) {    
    let mention = message.mentions.members.first();

    if (!mention) return core.sendLocalizedError(message, `WHO_MUST_BE_SPECIFIED`);
    if (message.author.id == mention.user.id) return core.sendLocalizedError(message, `GENIOUS`);

    // let profile = voiceProfileExtension.findVoiceProfile(message.author.id, message.guild.id);
    // let giveToProfile = voiceProfileExtension.findVoiceProfile(mention.user.id, message.guild.id);
    console.log('debugger');
    let profile = await show(message.guild.id, message.author.id);
    let giveToProfile = await show(message.guild.id, mention.user.id);
    
    let voicepoints = overage[1];

    if (!profile || !giveToProfile || !voicepoints) return core.sendLocalizedError(message, `GIVE_ARGS_ERROR`);    
    if (isNaN(voicepoints)) return core.sendLocalizedError(message, `VOICEPOINTS_MUST_BE_A_NUMBER`);
    
    voicepoints = Math.floor(voicepoints);

    if (voicepoints <= 0) return core.sendLocalizedError(message, `VOICEPOINTS_MUST_BE_GREATER_THAN_0`);
    if (profile.voicepoints < voicepoints) return core.sendLocalizedError(message, `NOT_ENOUGH_VOICEPOINTS`);

    profile.voicepoints -= voicepoints;
    giveToProfile.voicepoints += voicepoints;

    await transaction({
        from: {
            user_id: profile.user_id,
            guild_id: profile.guild_id,
        },
        to: {
            user_id: giveToProfile.user_id,
            guild_id: giveToProfile.guild_id,
        },
        amount: voicepoints,
        reason: "give",
    });

    core.sendSuccessful(message);
}

const command = {
    slug: 'give',
    execute: give,
    channels: ['command', 'roulette']
}

module.exports = command;