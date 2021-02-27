const { MessageEmbed } = require('discord.js');

function uno(message) {
    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setThumbnail(core.client.user.avatarURL())
        .setTitle(`UnoCard`)
        .setTimestamp();

    let nedius = 'nedius#4768';
    let saintminer = 'SaintMiner#1159';
    let milkPony = 'Pony#9620';
    let bakers = `${milkPony}\n${saintminer}\n${nedius}`;

    embed.addField('UnoCore version', core.configuration.core_version, true);
    embed.addField('Launched at', core.launchedAt, true);
    embed.addField('Baked by', bakers, true);

    embed.addField('Serve on', `${core.client.guilds.cache.size} servers`, true);

    message.channel.send(embed);
}

const command = {
    slug: 'uno',
    execute: uno
}

module.exports = command;