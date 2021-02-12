function action(message) {
    let member = message.mentions.users.first();
    if (!member) {
        member = message.author;
    }

    console.log(message.guild.id);
    console.log(member.id);
}

const command = {
    slug: 'info',
    description: 'String',
    category: 'String',

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: action,
    childrens: [],
}

module.exports = command;
