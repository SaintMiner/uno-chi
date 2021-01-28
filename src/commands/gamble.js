const Command = require('../classes/command.js');
const { MessageEmbed } = require('discord.js');

const random = require('random');
const seedrandom = require('seedrandom');

class GambleCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'gamble',
            description: 'COMMAND_GAMBLE_DESCRIPTION',
            category: 'Games',
            aliases: [],
            usages: ['gamble roulette <place> <bet>'],
            permissions: [],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });
        
        this.rouletteData = require('../json/roulette.json');
        this.multipliers = this.rouletteData.multipliers;
        this.places = Object.keys(this.multipliers);
        this.commandHelp = `\`>gamble roulette [${this.places.join('|').replace('number', 'number[0-36]')}] [ставка]\``;
        this.bets = [];

        this.rouletteLaunched = false;
        this.rouletteCooldown = false;
        this.rouletteStarted = false;
        this.rouletteSecondsBeforeLauch = 16;
        this.rouletteLaunchTime = this.rouletteSecondsBeforeLauch * 1000;
        this.rouletteCooldownTime = 10 * 1000;
        this.rouletteWheel = null;
    }

    executeCustom(message, args) {
        switch(args[0]) {
            case 'roulette':
                this.roulette(message, args, message.author.id, message.guild.id);
            break;
            default: 
                this.dropError(message, 'Available games: `roulette`')
            break;
        }
    }

    roulette(message, args, user_id, guild_id) {
        let voice_profile = this.client.getVoiceProfile(user_id, guild_id);
        if (!voice_profile) return this.dropError(message, 'Ты кто?');
        if (!this.validateRouletteBet(message, args, voice_profile)) return 'Validation error';
        
        if (!this.rouletteLaunched) {
            if (message) this.dropError(message, `Рулетка будет запущена через ${this.rouletteSecondsBeforeLauch} секунд`);
            this.rouletteLaunched = true;
            this.bets = [];
            this.rouletteWheel = setTimeout(() => {
                this.startRoulette(message, args)
                this.rouletteLaunched = false;
            }, this.rouletteLaunchTime);
        }

        
        voice_profile.voicepoint -= args[2];
        

        this.bets.push({
            guild_id: guild_id,
            user_id: user_id,
            place: args[1],
            bet: args[2]
        });
        let table = this.bets.map(bet => { return {bet: bet.place, user_id: bet.user_id}});
        return [...new Set(table)];
    };

    startRoulette(message, args) {
        random.use(seedrandom(`nleebsu-${new Date().getTime()}`));
        let number = random.int(0, 36);
        this.client.modules
            .find(m => m.name == 'RouletteWebsocket').sendStartRoulette(number);
        let isZero = false;
        let isDoubleZero = false;
        let isEven = false;
        if (!number) {
            isZero = true;
            if (random.int(0, 1)) {
                isDoubleZero = true;
            }
        } else {
            if (!(number % 2)) {
                isEven = true;
            }
        }
        let result = this.rouletteData[`${number}`];
        let winners = [];
        // console.log(result);

        winners = winners.concat(this.bets.filter(bet => bet.place == number));
        winners.forEach(bet => bet.place = "number");
        result.sectors.forEach(sector => {
            winners = winners.concat(this.bets.filter(bet => bet.place == sector));
        });
        winners = winners.concat(this.bets.filter(bet => bet.place == result.color));

        if (!isZero) {
            if (isEven) {
                winners = winners.concat(this.bets.filter(bet => bet.place == 'even'));
            } else {
                winners = winners.concat(this.bets.filter(bet => bet.place == 'odd'));
            }
        }
        
        
        let guilds = [...new Set(this.bets.map(bet => bet.guild_id))];
        
        let colorSquare;
        switch (result.color) {
            case 'red': colorSquare = '🟥'; break;
            case 'black': colorSquare = '⬛'; break;
            case 'green': colorSquare = '🟩'; break;
        }
        guilds.forEach(checkingGuild => {
            this.client.guilds.fetch(checkingGuild).then(guild => {
                if (guild) {
                    const currentGuild = this.client.storage['guilds'].find(g => g.guild_id == guild.id);
                    if (currentGuild.roullete_channel_id) {
                        this.client.channels.fetch(currentGuild.roullete_channel_id).then(async c => {
                            if (c) {
                                c.send(`Выпало: \`${colorSquare} ${number} [${result.sectors.join(' ')}]\``);
                                const guildWinners = winners.filter(winner => winner.guild_id == guild.id);
                                if (guildWinners.length) {
                                    let info = new MessageEmbed()
                                        .setColor("#580ad6")
                                        .setTitle(`Победные ставки`)
                                        .setTimestamp();
                                    for await (const profile of guildWinners) {
                                        let voice_profile = this.client.storage['voice_profiles']
                                            .find(voice_profile => voice_profile.guild_id == profile.guild_id && voice_profile.user_id == profile.user_id);
                                        let prize = profile.bet * this.multipliers[profile.place];
                                        voice_profile.voicepoint += prize;
                                        await guild.members.fetch(profile.user_id).then(m => {
                                            info.addField(`${m.user.tag}`, `Поставил: \`${profile.bet}\` Получил: \`${prize}\``);
                                        });
                                    }
                                    c.send(info);
                                } else {
                                    c.send('Победителей нет)');
                                }
                            }
                        }).catch(e => console.error);
                    }
                }
            }).catch(e => console.error);   
        });
    }

    validateRouletteBet(message, args, voice_profile) {
        let bet = +args[2];
        let place = args[1];
        if (!place || !bet) {
            this.dropError(message, 'Укажи место ставки и ставку!');
            this.dropError(message, this.commandHelp);
            return;
        }

        if (!Number.isInteger(bet)) {
            this.dropError(message, 'Ставка только целое число!');
            return;
        }

        if ( (Number.isNaN(+place) && !this.places.includes(place)) || +place < 0 || +place > 36) {
            this.dropError(message, 'Такое место недоступно на столе!');
            this.dropError(message, this.commandHelp);
            return;
        }

        if (bet < 1) {
            this.dropError(message, 'Ставка не меньше 1!');
            return;
        }
        
        if (voice_profile.voicepoint == 0) {
            this.dropError(message, 'У тебя ничего не осталось o/');
            return;
        }

        if (voice_profile.voicepoint < bet) {
            this.dropError(message, 'Не хватает, ставь меньше!');
            return;
        }
        
        return true;
    }
    
}

module.exports = GambleCommand;