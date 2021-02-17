const Extension = require('@core/classes/extension');
const { info, warn, error, log } = require('pretty-console-logs');

class VoicePointExtension extends Extension {
    commands() {
        return [
            require('./commands/pray')
        ]
    }
}

module.exports = VoicePointExtension;