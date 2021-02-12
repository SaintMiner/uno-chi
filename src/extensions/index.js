const Extension = require('../core/classes/extension');

const DatabaseExtension = require('./database-extension');
const GuildExtension = require('./guild-extension');
const VoiceProfileExtension = require('./voice-profile-extension');

module.exports = [
    {extension: DatabaseExtension},
    {extension: GuildExtension},
    {extension: VoiceProfileExtension},
];