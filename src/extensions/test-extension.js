const Extension = require('../core/classes/extension');

class TestExtension extends Extension {
    
    commands() {
        return [
            require('./test-extension/test'),
        ]
    }

}

module.exports = TestExtension;