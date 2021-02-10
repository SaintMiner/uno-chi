const Basic = require('./classes/basic');
const Command = require('./classes/command');

class CommandBuilder extends Basic{

    build(commands, extension) {
        if (!Array.isArray(commands)) return;
        
        if (extension) {
            commands = this.setExtension(commands, extension);
        }

        commands.forEach(command => core.commandManager.addCommand(new Command(command)));
        
    }

    setExtension(commands, extension) {
        let affiliated = commands.map(command => {
            command.extensions = [extension];
            if (command.childrens) {
                command.childrens = this.setExtension(command.childrens, extension);
            }
            return command;
        })
        return affiliated;
    }

    

}

module.exports = CommandBuilder;