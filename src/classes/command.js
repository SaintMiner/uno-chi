class Command {
    constructor(client, settings) {
        this.client = client;
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