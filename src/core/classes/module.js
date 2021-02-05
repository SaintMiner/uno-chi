const { info, warn, error, log } = require('pretty-console-logs');
class Module {

    constructor(order = Infinity) {
        this.name = this.constructor.name;
        this.order = order;
        this.commands = [];
    }

    init() {
        
    }

    initEvents() {

    }

    initCommands() {
        log(this.commands)
    }
    
}

module.exports = Module;