let { voice, set } = require('../../voice-level-extension/commands/set-voice');

function setRoles() {
    console.log('roles');
}

let roles = {
    slug: 'roles',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: setRoles,
    childrens: [],
}

voice.childrens.push(roles);
set.childrens.push(voice);

module.exports = set;