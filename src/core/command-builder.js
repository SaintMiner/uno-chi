const Basic = require('./classes/basic');
const Command = require('./classes/command');

class CommandBuilder extends Basic{

    build(commands) {
        if (!Array.isArray(commands)) return;
        
        commands.forEach(command => core.commandManager.addCommand(new Command(command)));        
    }

    

}

module.exports = CommandBuilder;