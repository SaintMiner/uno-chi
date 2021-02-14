const Extension = require('@core/classes/extension');
const { info, warn, error, log } = require('pretty-console-logs');


class GambleExtension extends Extension {
    constructor() {
        super();
        
    }

    commands() {
        return [
            
        ]
    }

}

module.exports = GambleExtension