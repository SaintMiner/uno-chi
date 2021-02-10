const Extension = require('../core/classes/extension');

const DatabaseExtension = require('./database-extension');
const GuildExtension = require('./guild-extension');

const TestExtension = require('./test-extension');
const TestExtensionCopy = require('./test-extension copy');

module.exports = [
    {extension: DatabaseExtension},
    {extension: GuildExtension},
    
    {extension: TestExtension},
    {extension: TestExtensionCopy},
];