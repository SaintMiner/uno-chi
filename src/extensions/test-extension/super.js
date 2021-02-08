function superPuper(message, args) {
    console.log(args);
    console.log('p100 super!');
}

function superTest() {
    console.log('super puper!!');
}

const command = {
    slug: 'super',
    description: 'String',
    category: 'String',

    usages: ['Array', 'of', 'Strings'],
    aliases: ['Array', 'of', 'Strings'],
    permissions: ['Array', 'of', 'Strings'],
    whiteListedUsers: ['Array', 'of', 'Strings'],

    isHidden: false,
    isPrivate: false,

    execute: superPuper,
    childrens: [
        require('./test'),
        {
            slug: 'puper',
            description: 'String',
            category: 'String',

            usages: ['Array', 'of', 'Strings'],
            aliases: ['Array', 'of', 'Strings'],
            permissions: ['Array', 'of', 'Strings'],
            whiteListedUsers: ['Array', 'of', 'Strings'],

            isHidden: false,
            isPrivate: false,

            execute: superTest,
            childrens: [
                require('./test'),
            ]
        }
    ],
}

module.exports = command;