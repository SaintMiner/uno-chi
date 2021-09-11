const { show, update, transaction } = require('../rest.js');

async function addVoicePoints(message, args, overage) {
    // const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    let who = message.mentions.members.first();
    let voicePointsAmount = overage[1];

    if (!who) return core.sendLocalizedError(message, `WHO_MUST_BE_SPECIFIED`);
    if (isNaN(voicePointsAmount)) return core.sendLocalizedError(message, `ADD_VOICEPOINTS_AMOUNT_MUST_BE_SPECIFIED`);
    
    // let profile = voiceProfileExtension.findVoiceProfile(who.id, message.guild.id);
    let profile = await show(message.guild.id, who.id);

    if (!profile) return core.sendLocalizedError(message, `VOICE_PROFILE_NOT_FOUND`);

    // profile.voicepoints += Math.round(voicePointsAmount);
    await transaction({
        from: "self",
        to: {
            user_id: profile.user_id,
            guild_id: profile.guild_id,
        },
        amount: Math.round(voicePointsAmount),
        reason: "Voice add voicepoints",
    });

    core.sendSuccessful(message);
}

async function addVoiceXp(message, args, overage) {
    // const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    let who = message.mentions.members.first();
    let xpAmount = overage[1];

    if (!who) return core.sendLocalizedError(message, `WHO_MUST_BE_SPECIFIED`);
    if (isNaN(xpAmount)) return core.sendLocalizedError(message, `ADD_EXPERIENCE_AMOUNT_MUST_BE_SPECIFIED`);

    // let profile = voiceProfileExtension.findVoiceProfile(who.id, message.guild.id);
    let profile = await show(message.guild.id, who.id);

    if (!profile) return core.sendLocalizedError(message, `VOICE_PROFILE_NOT_FOUND`);

    profile.experience += Math.round(xpAmount);
    update(profile);

    core.sendSuccessful(message);
}

function stopper(message) {
    message.channel.send("temporary disabled :3 MNE LENJ");
}

let voicepoints = {
    permissions: ['ADMINISTRATOR'],
    slug: 'voicepoints',
    execute: addVoicePoints,
}

let voicexp = {
    permissions: ['ADMINISTRATOR'],
    slug: 'voicexp',
    execute: addVoiceXp,
}

let command = {
    permissions: ['ADMINISTRATOR'],
    slug: 'add',
    // execute: stopper
    childrens: [ voicexp, voicepoints ],
}

module.exports = command;