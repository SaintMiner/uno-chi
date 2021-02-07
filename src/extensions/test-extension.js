const Extension = require('../core/classes/extension');
/** 
    @settings
    @attribute {slug} - string | How command can be executed
    @attribute {description} - string | About command in detailed help
    @attribute {category} - string | Splits in command list by category
    
    @attribute {usages} - array of string | Shows in help how to use the command - prefix in start will be added automaticaly
    @attribute {aliases} - array of strings | execute aliases
    @attribute {permissions} - array of strings | discord server permissions | https://discord.js.org/#/docs/main/stable/class/Permissions
    @attribute {whiteListedUsers} - array of strings, | list of whitelisted users id
    
    @attribute {isHidden} - boolean | Hide command from help list
    @attribute {isPrivate} - boolean | allows only .env configured admins or command whitelisted users execute this command

*/
class TestExtension extends Extension {

    commands() {
        return [
            require('./test-extension/test'),
        ]
    }

}

module.exports = TestExtension;