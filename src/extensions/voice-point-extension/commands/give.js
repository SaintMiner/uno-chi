function give(message, args, overage) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');

    let mention = message.mentions.members.first();

    if (!mention) return;
    if (message.author.id == mention.user.id) return;

    let profile = voiceProfileExtension.findVoiceProfile(message.author.id, message.guild.id);
    let giveToProfile = voiceProfileExtension.findVoiceProfile(mention.user.id, message.guild.id);
    let voicepoints = overage[1];
    
    if (!profile || !giveToProfile || !voicepoints) return;    
    if (isNaN(voicepoints)) return;
    
    voicepoints = Math.floor(voicepoints);

    if (voicepoints <= 0) return;
    if (profile.voicepoints < voicepoints) return;

    profile.voicepoints -= voicepoints;
    giveToProfile.voicepoints += voicepoints;
}

const command = {
    slug: 'give',
    execute: give
}

module.exports = command;