let room = require('./room');
let level = require('./level');

let command = {
    slug: 'voice',    
    childrens: [ room, level ],
}

module.exports = command;