let set = require('@commands/set');

function setChannel(message, args) {
    const guildExtension = core.getExtension('GuildExtension');
    let guild = core.findGuild(message.guild.id);
    let alert = args.alert ? args.alert[0] : null;
    let roulette = args.roulette ? args.roulette[0] : null;
    
    if (alert) {
        core.client.channels.fetch(alert).then(c => {
            guild.channels.alert = alert;
        });
    }

    if (roulette) {
        core.client.channels.fetch(roulette).then(c => {
            guild.channels.roulette = roulette;
        });
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