const Extension = require('../core/classes/extension');
const TestExtension = require('./test-extension');
const TestExtensionCopy = require('./test-extension copy');

module.exports = [
    {extension: TestExtension},
    {extension: TestExtensionCopy},
];