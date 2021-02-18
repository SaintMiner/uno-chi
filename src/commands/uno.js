const { MessageEmbed } = require('discord.js');

function uno(message) {
    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setThumbnail(core.client.user.avatarURL())
        .setTitle(`UnoCard`)
        .setTimestamp();

    embed.addField('UnoCore version', core.configuration.core_version, true);
    embed.addField('Launched at', core.launchedAt, true);

    message.channel.send(embed);
}

const command = {
    slug: 'uno',
    execute: uno
}

module.exports = command;