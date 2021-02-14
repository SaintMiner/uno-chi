let set = require('@commands/set');

function setChannel(message, args) {
    const guildExtension = core.getExtension('GuildExtension');
    let guild = core.findGuild(message.guild.id);
    let alert = args.alert ? args.alert[0] : null;
    let roulette = args.roulette ? args.roulette[0] : null;
    console.log(roulette);
    if (alert) {
        if (!message.guild.channels.resolve(alert)) return;
        guild.channels.alert = alert;
    }
    
    if (roulette) {
        if (!message.guild.channels.resolve(roulette)) return;
        guild.channels.roulette = roulette;
    }

    guildExtension.saveLocal(guild);
    guildExtension.save(guild);
}

const channel = {
    slug: 'channel',
    description: 'String',
    category: 'String',

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: setChannel,
    childrens: [],
}

set.childrens.push(channel);

module.exports = set;