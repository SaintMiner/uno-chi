const Module = require('../classes/module.js');

class TemplateModule extends Module {
    constructor(client) {
        super(client, {
            name: 'Template'
        });
    }
}

module.exports = TemplateModule;