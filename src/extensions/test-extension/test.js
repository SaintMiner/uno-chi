function action() {
    console.log('test');
}

const command = {
    slug: 'test',
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