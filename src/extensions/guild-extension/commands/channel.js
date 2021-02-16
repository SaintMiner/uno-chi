let guild = require('./guild');
let set = require('./set');

function action() {
    console.log('some action');
}

const command = {
    slug: 'channel',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: action,
    childrens: [],
}

set.childrens.push(command);
guild.childrens.push(set);

module.exports = guild;