function action(message, args, overage) {
    const guildExtension = core.getExtension('GuildExtension');

    let guild = core.findGuild(message.guild.id);
    let alert = args.alert ? args.alert[0] : null;
    let roulette = args.roulette ? args.roulette[0] : null;

    if (alert) {
        let channel = message.guild.channels.resolve(alert);

        if (!channel) return core.sendLocalizedError(message, `CHANNEL_NOT_FOUND`);
        if (channel.type != 'text') return core.sendLocalizedError(message, `CHANNEL_MUST_BE_TEXT`);

        guild.channels.alert = alert;
    }
    
    if (roulette) {
        let channel = message.guild.channels.resolve(roulette);

        if (!channel) return core.sendLocalizedError(message, `CHANNEL_NOT_FOUND`);
        if (channel.type != 'text') return core.sendLocalizedError(message, `CHANNEL_MUST_BE_TEXT`);
        
        guild.channels.roulette = roulette;
    }

    guildExtension.saveLocal(guild);
    guildExtension.save(guild);
}

const command = {
    slug: 'channel',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: ['ADMINISTRATOR'],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: action,
    childrens: [],
}

module.exports = command;