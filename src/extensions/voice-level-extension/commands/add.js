function addVoicePoints(message, args, overage) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    let who = message.mentions.members.first();
    let voicePointsAmount = overage[1];

    if (!who || isNaN(voicePointsAmount)) return;

    let profile = voiceProfileExtension.findVoiceProfile(who.id, message.guild.id);

    if (!profile) return;

    profile.voicepoints += Math.round(voicePointsAmount);
}

function addVoiceXp(message, args, overage) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    let who = message.mentions.members.first();
    let xpAmount = overage[1];

    if (!who || isNaN(xpAmount)) return;

    let profile = voiceProfileExtension.findVoiceProfile(who.id, message.guild.id);

    if (!profile) return;

    profile.experience += Math.round(xpAmount);
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
    childrens: [ voicexp, voicepoints ],
}

module.exports = command;