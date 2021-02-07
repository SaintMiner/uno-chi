const { info } = require('pretty-console-logs');

class Basic {
    
    constructor (name = this.constructor.name) {
        this.name = name;
        
        info(`[${name}] Initialising...`);
    }
}

module.exports = Basic;