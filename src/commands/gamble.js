const Command = require('../classes/command.js');
const { MessageEmbed } = require('discord.js');

const random = require('random');
const seedrandom = require('seedrandom');

class TemplateCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'gamble', //how command can be executed
            permissions: [], //discord server permissions
            systemAdmin: false, //only system administrators can launch this command
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
                this.roulette(message, args);
            break;
            default: 
                this.dropError(message, 'Available games: `roulette`')
            break;
        }
    }

    async roulette(message, args) {
        let voice_profile = this.client.storage['voice_profiles']
            .find(voice_profile => voice_profile.guild_id == message.guild.id && voice_profile.user_id == message.author.id);
        if (!voice_profile) return this.dropError(message, 'Ты кто?');
        if (!this.validateRouletteBet(message, args, voice_profile)) return;
        
        if (!this.rouletteLaunched) {
            this.dropError(message, `Рулетка будет запущена через ${this.rouletteSecondsBeforeLauch} секунд`);
            this.rouletteLaunched = true;
            this.bets = [];
            this.rouletteWheel = setTimeout(() => {
                this.startRoulette(message, args)
                this.rouletteLaunched = false;
            }, this.rouletteLaunchTime);
        }

        
        voice_profile.voicepoint -= args[2];
        

        this.bets.push({
            guild_id: message.guild.id,
            user_id: message.author.id,
            place: args[1],
            bet: args[2]
        });
    };

    startRoulette(message, args) {
        random.use(seedrandom(`nleebsu-${new Date().getTime()}`));
        let number = random.int(0, 36);
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
            // console.log(sector);
            // console.log(this.multipliers[`${sector}`]);
            winners = winners.concat(this.bets.filter(bet => bet.place == sector));
        });
        // console.log(result.color);
        // console.log(this.multipliers[`${result.color}`]);
        winners = winners.concat(this.bets.filter(bet => bet.place == result.color));
        if (!isZero) {
            if (isEven) {
                // console.log('even');;
                // console.log(this.multipliers['even']);
                winners = winners.concat(this.bets.filter(bet => bet.place == 'even'));
            } else {
                // console.log('odd');
                // console.log(this.multipliers['odd']);
                winners = winners.concat(this.bets.filter(bet => bet.place == 'odd'));
            }
        }
        
        
        
        // console.log(this.bets);
        let guilds = [...new Set(this.bets.map(bet => bet.guild_id))];
        // console.log('guilds');
        // console.log(guilds);
        // console.log('winners');
        // console.log(winners);
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
            console.log(place);
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

module.exports = TemplateCommand;