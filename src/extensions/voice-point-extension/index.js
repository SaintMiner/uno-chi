const Extension = require('@core/classes/extension');

class VoicePointExtension extends Extension {
    commands() {
        return [
            require('./commands/pray')
        ]
    }
}

module.exports = VoicePointExtension;