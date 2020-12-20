const Module = require('../classes/module.js');

class TextLevelModule extends Module {
    constructor(client) {
        super(client, {
            name: 'Text Level'
        });
        this.startTextLevelMonitoring();
    }

    startTextLevelMonitoring() {
        this.client.on('message', message => {
            if (message.author.id != this.client.user.id && !message.author.bot) {
                if (!message.content.startsWith(this.client.prefix)) {
                    console.log(`${message.author.username}: ${message.content}`);
                }
            }
        });
    }
}

module.exports = TextLevelModule;