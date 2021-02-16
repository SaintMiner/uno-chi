let add = require('./add');
let room = require('./room');
let level = require('./level');

let command = {
    slug: 'voice',    
    childrens: [ add, room, level ],
}

module.exports = command;