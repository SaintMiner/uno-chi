const Basic = require('./basic');


class Extension extends Basic {

    isPublic = true;

    initialize() {}

    commands() {
        return [];
    }
    
}

module.exports = Extension;