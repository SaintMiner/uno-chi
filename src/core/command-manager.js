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
                .split(/ +/g);

            this.callCommand(message, commandment);
        });
    }

    addCommand(command) {
        this.commands.push(command);
    }

    callCommand(message, commandment, queue = []) {
        let slug = commandment[0];
        let command = null;

        if (commandment[1]) {
            queue.push(slug);
            this.callCommand(message, commandment.slice(1), queue);
        } else {
            
            if (queue.length) {
                command = this.commands.find(command => command.slug == queue[0]);
                queue.slice(1).forEach(q => {
                    let temp = command.childrens.find(children => children.slug == q)
                    if (temp) command = temp;
                });
                command = command.childrens.find(children => children.slug == slug);                
            } else {
                command = this.commands.find(command => command.slug == slug);
                // console.log(slug);
            }
            // console.log(command);
            command.execute(message);
        }
    }
}

module.exports = CommandManager;