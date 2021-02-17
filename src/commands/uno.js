const { MessageEmbed } = require('discord.js');

function uno(message) {
    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setThumbnail(core.client.user.avatarURL())
        .setTitle(`Информация обо мне`)
        .setTimestamp();

    embed.addField('Версия', core.configuration.core_version, true);
    embed.addField('Дата запуска', core.launchedAt, true);

    message.channel.send(embed);
}

const command = {
    slug: 'uno',
    execute: uno
}

module.exports = command;