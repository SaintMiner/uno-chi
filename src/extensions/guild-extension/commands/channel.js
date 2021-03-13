function action(message, args, overage) {
    const guildExtension = core.getExtension('GuildExtension');

    let guild = core.findGuild(message.guild.id);
    let alert = args.alert ? args.alert[0] : null;
    let roulette = args.roulette ? args.roulette[0] : null;
    let command = args.command ? args.command[0] : null;    

    if (alert) {
        if (alert == '0') {
            guild.channels.alert = '0';
        } else {
            let channel = message.guild.channels.resolve(alert);
            
            if (!channel) return core.sendLocalizedError(message, `CHANNEL_NOT_FOUND`);
            if (channel.type != 'text') return core.sendLocalizedError(message, `CHANNEL_MUST_BE_TEXT`);
            
            guild.channels.alert = alert;
            guild.settings.is_active = 'true';
        }
    }
    
    if (roulette) {
        if (roulette == '0') {
            guild.channels.roulette = '0';
        } else {
            let channel = message.guild.channels.resolve(roulette);

            if (!channel) return core.sendLocalizedError(message, `CHANNEL_NOT_FOUND`);
            if (channel.type != 'text') return core.sendLocalizedError(message, `CHANNEL_MUST_BE_TEXT`);
            
            guild.channels.roulette = roulette;
        }
    }

    if (command) {
        if (command == '0') {
            guild.channels.command = '0';
        } else {
            let channel = message.guild.channels.resolve(command);

            if (!channel) return core.sendLocalizedError(message, `CHANNEL_NOT_FOUND`);
            if (channel.type != 'text') return core.sendLocalizedError(message, `CHANNEL_MUST_BE_TEXT`);
            
            guild.channels.command = command;
        }
    }
    

    guildExtension.saveLocal(guild);
    guildExtension.save(guild);

    core.sendSuccessful(message);
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