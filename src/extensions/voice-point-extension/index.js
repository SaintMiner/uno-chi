const Extension = require('@core/classes/extension');

class VoicePointExtension extends Extension {
    commands() {
        return [
            require('./commands/pray'),
            require('./commands/give')
        ]
    }
}

module.exports = VoicePointExtension;