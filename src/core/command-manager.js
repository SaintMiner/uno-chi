const Basic = require('./classes/basic');

class CommandManager extends Basic {

    commands = [];
    
    initialize() {
        core.client.on('message', async message => {
            if (!message.guild) return;
            if (message.author.bot) return;
            if (!message.content.startsWith(core.configuration.prefix)) return;

                let commandment = message.content
                .toLowerCase()
                .slice(core.configuration.prefix.length)
                .trim()
                .split(/ +/g)
                .filter(part => !!part);
            
            if (!commandment.length) return;
            
            let instruction = this.getExecutionInstruction(message.content);
            this.callCommand(message, instruction);
        });
    }

    addCommand(command) {
        this.commands.push(command);
    }

    callCommand(message, instruction, parent = null) {
        let slug = instruction.commandment[0];
        instruction.commandment = instruction.commandment.slice(1);
        let command = null;

        if (instruction.commandment[0]) {            
            command = this.commands.find(command => command.slug == slug) || {childrens: []};
            return this.callCommand(message, instruction, command);
        } else if (parent) {
            command = parent.childrens.find(command => command.slug == slug);            
        } else {
            command = this.commands.find(command => command.slug == slug);
        }

        if (command) {            
            command.execute(message, instruction.args);
        }
    }

    getExecutionInstruction(string) {
        let args = {};
        let argumentPrefix = '-';

        let parts = string.toLowerCase()
            .slice(core.configuration.prefix.length)
            .trim()
            .split(/ +/g)
            .filter(part => !!part);
            
        let argumentsIndex = parts.findIndex(part => part.startsWith(argumentPrefix));

        if (argumentsIndex > -1) {
            let rawArguments = parts.splice(argumentsIndex);
            let selectedAttribute = null;
            rawArguments.forEach(arg => {
                if (arg.startsWith(argumentPrefix)) {
                    selectedAttribute = arg.substring(1);
                    args[selectedAttribute] = [];
                } else if (selectedAttribute) {
                    args[selectedAttribute].push(arg);
                }
            });            
        }

        return {commandment: parts, args};
    }
}

module.exports = CommandManager;