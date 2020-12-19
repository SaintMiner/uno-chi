class Command {
    constructor(settings) {
        this.settings = settings;
    }

    execute(message) {
        message.channel.send('The useless command');
    }
}

module.exports = Command;