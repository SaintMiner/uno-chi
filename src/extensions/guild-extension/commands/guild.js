let set = require('./set');
let channel = require('./channel');

set.childrens.push(channel);

const command = {
    slug: 'guild',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: null,
    childrens: [ set ],
}

module.exports = command;