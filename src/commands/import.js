const Command = require('../classes/command.js');

class TemplateCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'importold', //how command can be executed
            permissions: [], //discord server permissions
            systemAdmin: true, //only system administrators can launch this command
        });
    }

    executeCustom(message, args) {
        return this.dropError(message, 'Всё... Выключено!');;
        let old_profiles = require('../../profiles.json');
        let voiceProfileModel = this.client.models.find(m => m._properties.name == 'VoiceProfiles');
        let new_profiles = old_profiles.map(profile => {
            let data = {
                user_id: profile.user,
                guild_id: '240492317679550465',
                experience: profile.xp,
                level: profile.level,
                time_spent: 10000,
                voicepoint: profile.voicePoint ? profile.voicePoint+100 : 100
            }
            return data
        });
        new_profiles.forEach(profile => {
            let model = new voiceProfileModel(profile);
            model.save(function(err){
                if(err) console.log(err);
            });
        });
    }
}

module.exports = TemplateCommand;