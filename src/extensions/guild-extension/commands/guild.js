let set = require('./set');
let channel = require('./channel');

function setLanguage(message, args, overage) {
    const guildExtension = core.getExtension('GuildExtension');

    let languages = ['ru', 'en'];
    let choosed = overage[0];
    let guild = guildExtension.findGuild(message.guild.id);

    if (!languages.includes(choosed)) return message.channel.send(`Available languages: ${languages}`);
    
    guild.settings.language = choosed;

    guildExtension.saveLocal(guild);
    guildExtension.save(guild);

    core.sendSuccessful(message);
}

const language = {
    slug: 'language',
    permissions: ['ADMINISTRATOR'],
    execute: setLanguage
}

set.childrens.push(channel);
set.childrens.push(language);

const command = {
    slug: 'guild',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: ['ADMINISTRATOR'],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: null,
    childrens: [ set ],
}

module.exports = command;