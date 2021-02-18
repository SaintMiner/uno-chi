function give(message, args, overage) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');

    let mention = message.mentions.members.first();

    if (!mention) return core.sendLocalizedError(message, `WHO_MUST_BE_SPECIFIED`);
    if (message.author.id == mention.user.id) return core.sendLocalizedError(message, `GENIOUS`);

    let profile = voiceProfileExtension.findVoiceProfile(message.author.id, message.guild.id);
    let giveToProfile = voiceProfileExtension.findVoiceProfile(mention.user.id, message.guild.id);
    let voicepoints = overage[1];

    if (!profile || !giveToProfile || !voicepoints) return core.sendLocalizedError(message, `GIVE_ARGS_ERROR`);    
    if (isNaN(voicepoints)) return core.sendLocalizedError(message, `VOICEPOINTS_MUST_BE_A_NUMBER`);
    
    voicepoints = Math.floor(voicepoints);

    if (voicepoints <= 0) return core.sendLocalizedError(message, `VOICEPOINTS_MUST_BE_GREATER_THAN_0`);
    if (profile.voicepoints < voicepoints) return core.sendLocalizedError(message, `NOT_ENOUGH_VOICEPOINTS`);

    profile.voicepoints -= voicepoints;
    giveToProfile.voicepoints += voicepoints;
}

const command = {
    slug: 'give',
    execute: give
}

module.exports = command;