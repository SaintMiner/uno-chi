const Basic = require('./classes/basic');
const Command = require('./classes/command');

class CommandBuilder extends Basic{

    build(commands) {
        if (!Array.isArray(commands)) return;
        
        let list = [];

        commands.forEach(command => {
            console.log(command);
            console.log(new Command(command));
            
        });
    }

}

module.exports = CommandBuilder;