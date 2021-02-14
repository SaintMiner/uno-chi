const Extension = require('../core/classes/extension');

const DatabaseExtension = require('./database-extension');
const GuildExtension = require('./guild-extension');
const VoiceProfileExtension = require('./voice-profile-extension');
const VoiceLevelExtension = require('./voice-level-extension');
const VoiceRolesExtension = require('./voice-roles-extension');
const VoiceRoomExtension = require('./voice-rooms-extension');
const TextProfileExtension = require('./text-profile-extension');

module.exports = [
    {extension: DatabaseExtension},
    {extension: GuildExtension},
    {extension: TextProfileExtension},
    {extension: VoiceProfileExtension},
    {extension: VoiceRoomExtension},
    {extension: VoiceRolesExtension},
    {extension: VoiceLevelExtension},
];