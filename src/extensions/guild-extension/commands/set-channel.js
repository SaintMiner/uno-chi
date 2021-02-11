function setChannel(message, args) {
    let guild = core.findGuild(message.guild.id);
    console.log(guild);
    if (args.alert) {
        guild.channels.alert = args.alert[0];
    }

    if (args.roulette) {
        guild.channels.alert = args.roulette[0];
    }

    console.log(guild);
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