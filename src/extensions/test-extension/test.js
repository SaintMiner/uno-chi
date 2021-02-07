function action() {
    console.log('test');
}

const command = {
    slug: 'test',
    category: 'String',
    category: 'String',

    usages: ['Array', 'of', 'Strings'],
    aliases: ['Array', 'of', 'Strings'],
    permissions: ['Array', 'of', 'Strings'],
    whiteListedUsers: ['Array', 'of', 'Strings'],

    isHidden: false,
    isPrivate: false,

    execute: action,
    childrens: [],
}

module.exports = command;