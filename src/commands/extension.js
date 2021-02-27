const extensions = require("../extensions");

function extension(message, args, overage) {
    let guild_id = overage[0];
    let add = args.add;
    let remove = args.remove;
    if (!guild_id) return core.sendLocalizedError(message, `GUILD_ID_MUST_BE_DEFINED`);
    
    let guild = core.findGuild(guild_id);

    if (guild.template) return core.sendLocalizedError(message, `GUILD_NOT_FOUND`);

    if (Array.isArray(add)) {
        add.forEach(ext => {
            guild.extensions[ext] = {};
            guild.extensions[ext].is_active = 'true';
            guild.extensions[ext].has = 'true';
        });    
    }

    if (Array.isArray(remove)) {
        remove.forEach(ext => {
            delete guild.extensions[ext];
        });
    }
    
    console.log(guild);
    

    
    core.sendSuccessful(message);
}

const command = {
    slug: 'extension',
    execute: extension,
    isPrivate: true,
}

module.exports = command;