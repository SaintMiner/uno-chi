const Module = require('../classes/module.js');

class VoiceLevelModule extends Module {
    constructor(client) {
        super(client, {
            name: 'Voice Level'
        });
    }
}

module.exports = VoiceLevelModule;