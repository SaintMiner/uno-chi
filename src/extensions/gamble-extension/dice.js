const { MessageEmbed } = require('discord.js');
const random = require('random');
const seedrandom = require('seedrandom');
const { error } = require('pretty-console-logs');


var diceGames = {};

function dice(message, args, overage) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');

    let bet = +overage[0];
    let profile = voiceProfileExtension.findVoiceProfile(message.author.id, message.guild.id);
    
    random.use(seedrandom(`nleebsu-${new Date().getTime()}`));

    if (isNaN(bet)) return core.sendLocalizedError(message, `BET_MUST_BE_A_NUMBER`);
    if (bet < 100) return core.sendLocalizedError(message, `MINIMAL_BET_100`);
    if (!profile) return core.sendLocalizedError(message, `YOU_DONT_HAVE_PROFILE`);
    if (profile.voicepoints < bet) return core.sendLocalizedError(message, `NOT_ENOUGH_VOICEPOINTS`);

    let game = getGuildDiceGame(message.guild.id);
    if (!game) {
        game = startDiceGame(message.guild.id);        
    }

    let player = game.players.find(player => player.user_id == message.author.id);
    profile.voicepoints -= +bet;
    if (player) {
        player.bet += +bet;
    } else {
        game.players.push({
            user_id: message.author.id,
            bet: +bet,
            profile: profile,
            dices: rollDice()
        });
    }
    
}

function getGuildDiceGame(guild_id) {
    let game = diceGames[guild_id];
    return game;
}

function startDiceGame(guild_id) {
    let game = {
        guild_id: guild_id,
        players: [],
    }
    diceGames[game.guild_id] = game;
    core.rouletteAlertGuild(game.guild_id, `Игра в кости будет запущена через 7.7 секунд`);
    setTimeout(() => {playDiceGame(game)}, 7753);
    return game;
}

async function playDiceGame(game) {
    random.use(seedrandom(`nleebsu-${new Date().getTime()}`));

    let botFirstDice = random.int(1, 6);
    let botSecondDice = random.int(1, 6);
    let botSum = botFirstDice + botSecondDice;

    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setTitle(`Результаты игры`)
        .setDescription(`Мои кубы \`${botFirstDice}\` \`${botSecondDice}\``)
        .setTimestamp();

    for await (const player of game.players) {
        await core.client.users.fetch(player.profile.user_id).then(user => {
            let text = `Выпали \`${player.dices.firstDice}\` \`${player.dices.secondDice}\`\n`;
            let playerSum = player.dices.firstDice + player.dices.secondDice;

            if (playerSum > botSum) {
                player.profile.voicepoints += player.bet * 2;
                text += `Выйграл ${player.bet} VP`;
            } else if (playerSum < botSum) {
                text += `Проиграл ${player.bet} VP`;
            } else {
                player.profile.voicepoints += player.bet;
                text += `Ничья`;
            }

            embed.addField(`${user.tag}`, text);
        }).catch(err => error(err));
    }
    
    core.rouletteAlertGuild(game.guild_id, embed);

    delete diceGames[game.guild_id];    
}

function rollDice() {
    random.use(seedrandom(`nleebsu-${new Date().getTime()}`));

    let firstDice = random.int(1, 6);
    let secondDice = random.int(1, 6);
    return {firstDice, secondDice};
}


module.exports.gambleDice = dice;