const Extension = require('@core/classes/extension');

class GameExtension extends Extension {
    commands() {
        return [
            require('./commands/roll')
        ]
    }
}

module.exports = GameExtension;