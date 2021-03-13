
function startRoulette(message, args) {
    let gambleExtension = core.getExtension('GambleExtension');
    let customArgs = message.content
        .toLowerCase()
        .slice(core.configuration.prefix.length)
        .trim()
        .split(/ +/g)
        .filter(part => !!part);
        
    gambleExtension.roulette(message, customArgs.slice(1), message.author.id, message.guild.id);
}

let roulette = {
    slug: 'roulette',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: startRoulette,
    childrens: [],
    channels: ['roulette']
}

let gamble = {
    slug: 'gamble',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: null,
    childrens: [
        roulette
    ],
    channels: ['roulette']
}

module.exports = gamble;

