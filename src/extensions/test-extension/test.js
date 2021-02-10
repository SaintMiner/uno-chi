function action(message) {
    message.channel.send('pong!');
}

const command = {
    slug: 'ping',
    description: 'String',
    category: 'String',

    usages: ['Array', 'of', 'Strings'],
    aliases: ['Array', 'of', 'Strings'],
    permissions: ['Array', 'of', 'Strings'],
    whiteListedUsers: ['Array', 'of', 'Strings'],

    isHidden: false,
    isPrivate: false,

    execute: action,
    childrens: [
        require('./super'),
    ],
}

module.exports = command;