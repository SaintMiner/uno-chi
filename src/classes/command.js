// class Command {
//     constructor(client, settings) {
//         this.client = client;
//         this.settings = settings;
//     }

//     execute(message, args) {
//         if (this.settings.systemAdmin) {
//             if (!this.client.system_administrators.find(sa => sa == message.author.id)) {
//                 return this.dropError(message, 'Only system administrators can call this command');
//             }
//         }
//         if (this.settings.permissions) {
//             try {
//                 if (!message.member.hasPermission('ADMINISTRATOR')) {
//                     this.settings.permissions.forEach(permission => {
//                         if (!message.member.hasPermission(permission)) {
//                             throw this.dropError(message, "You don't have permissions to call this command!");
//                         }
//                     });
//                 }
//             } catch (e) {
//                 return e;
//             }
//         }
//         this.executeCustom(message, args);
//     }

//     executeCustom(message, args) {
//         message.channel.send('The useless command');
//     }

//     dropError(message, errorText) {
//         if (message) {
//             message.channel.send(errorText);
//         }
//     }
// }

// module.exports = Command;

class Command {
    constructor(client, settings) {
        this.client = client;
        this.settings = settings;
    }

    execute(message, args) {
        // console.log(message.author.tag, message.author.id, message.content, this.settings.onlyOwner, this.settings.whitelistedUsers, this.settings.onlyOwner || !this.settings.whitelistedUsers.find(user => user == message.author.id), message.author.id != this.client.owner || !this.settings.whitelistedUsers.find(user => user == message.author.id));
        if (this.settings.onlyOwner) {
            if (!this.settings.whitelistedUsers.find(user => user == message.author.id)) {
                if(message.author.id != this.client.owner && !this.settings.whitelistedUsers.find(user => user == message.author.id)){
                    return this.dropError(message, `You don\'t have permissions to execute this command!`);
                }
                // if (!this.client.owner.find(sa => sa == message.author.id)) {
                //     return this.dropError(message, `Only bot owner can call this command`);
                // }
            }
        }
        if (message.guild){
            if (this.settings.permissions) {
                try {
                    if (!message.member.hasPermission('ADMINISTRATOR')) {
                        this.settings.permissions.forEach(permission => {
                            if (!message.member.hasPermission(permission)) {
                                throw this.dropError(message, `You don't have permissions to execute this command!`);
                            }
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
        this.executeCustom(message, args);
    }

    executeCustom(message, args) {
        message.channel.send('The useless command');
    }

    dropError(message, errorText) {
        if(this.client.broadcastError){
            message.channel.send(errorText);
        }
    }
}

module.exports = Command;