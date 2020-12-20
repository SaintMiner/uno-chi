class Command {
    constructor(settings) {
        this.settings = settings;
    }

    execute(message) {
        message.channel.send('The useless command');
    }

    dropError(message, errorText) {
        message.channel.send(errorText);
    }
}

module.exports = Command;