const Command = require('../classes/command.js');

const random = require('random');
const seedrandom = require('seedrandom');

class PrayCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'pray',
            description: 'COMMAND_PRAY_DESCRIPTION',
            category: 'Misc',
            aliases: [],
            usages: ['pray'],
            permissions: [],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });
    }

    executeCustom(message, args) {
        let voice_profile = this.client.storage["voice_profiles"]
            .find(voice_profile => voice_profile.guild_id == message.guild.id && voice_profile.user_id == message.author.id);
        if (voice_profile) {
            random.use(seedrandom(`nleebsu-${new Date().getTime()}`));
            let pray = random.int(0, 500);
            let now = new Date();
            let userTimezoneOffset = now.getTimezoneOffset() * 60000;
            now = new Date(now - userTimezoneOffset);
            let last_pray_date = new Date(voice_profile.pray_date);
            if (new Date(last_pray_date).setHours(0, 0, 0, 0) != new Date(now).setHours(0, 0, 0, 0)) {
                if (voice_profile.pray_date) {
                    const diffTime = Math.abs(now - last_pray_date);
                    const diffDays = diffTime / (1000 * 60 * 60 * 24); 
                    if (diffDays <= 2) {
                        voice_profile.pray_date = now.getTime();
                        voice_profile.pray_streak++;
                    } else if (diffDays > 2) {
                        voice_profile.pray_date = now.getTime();
                        voice_profile.pray_streak = 1;
                    }
                } else {
                    voice_profile.pray_date = now.getTime();
                    voice_profile.pray_streak = 1;
                    if (message.author.id == "379778712868225042") {
                        this.dropError(message, 'Знаешь я крайне польщена, что другой бог молится мне...');
                    }
                }
                voice_profile.voicepoint += (pray + voice_profile.pray_streak*10);
                return this.dropError(message, `Держи ${pray} и ${voice_profile.pray_streak*10} за ежедневные молитвы!`);
            } else {
                return this.dropError(message, 'Ты сегодня уже получил своё.');
            }
        } else {
            this.dropError(message, 'Извини я тебя не услышала. Когда станешь частью системы можем поговорить');
        }
    }
}

module.exports = PrayCommand;