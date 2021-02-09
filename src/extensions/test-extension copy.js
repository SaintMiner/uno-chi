const Extension = require('../core/classes/extension');
const TE = require("./test-extension");
class TestExtensionCopy extends TE {

    commands() {
        return [
            require('./test-extension/super'),
            require('./test-extension/test'),
        ]
    }

}

module.exports = TestExtensionCopy;