let set = require('@commands/set');

function setVoice(message, args, overage) {
    
}

let voice = {
    slug: 'voice',
    description: null,
    category: null,

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: setVoice,
    childrens: [],
}

set.childrens.push(voice);

module.exports.voice = voice;
module.exports.set = set;