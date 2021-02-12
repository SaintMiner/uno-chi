function setChannel(message, args) {
    const guildExtension = core.getExtension('GuildExtension');
    let guild = core.findGuild(message.guild.id);
    console.log(guildExtension);
    console.log(guild);
    core.client.channels.fetch(args.alert[0]).then(c => {
        if (args.alert) {
            guild.channels.alert = args.alert[0];
        }

        if (args.roulette) {
            guild.channels.alert = args.roulette[0];
        }

        guildExtension.saveLocal(guild);
        guildExtension.save(guild);
    });
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

const set = {
    slug: 'set',
    description: 'String',
    category: 'String',

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: null,
    childrens: [
        channel
    ],
}

module.exports = set;