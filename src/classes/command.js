class Command {
    constructor(client, settings) {
        this.client = client;
        this.settings = settings;
    }

    execute(message, args) {
        if (this.settings.systemAdmin) {
            if (!this.client.system_administrators.find(sa => sa == message.author.id)) {
                return this.dropError(message, 'Only system administrators can call this command');
            }
        }
        if (this.settings.permissions) {
            try {
                if (!message.member.hasPermission('ADMINISTRATOR')) {
                    this.settings.permissions.forEach(permission => {
                        if (!message.member.hasPermission(permission)) {
                            console.log(message.member.hasPermission(permission));
                            throw this.dropError(message, "You don't have permissions to call this command!");
                        }
                    });
                }
            } catch (e) {
                return e;
            }
        }
        this.executeCustom(message, args);
    }

    executeCustom(message, args) {
        message.channel.send('The useless command');
    }

    dropError(message, errorText) {
        message.channel.send(errorText);
    }
}

module.exports = Command;