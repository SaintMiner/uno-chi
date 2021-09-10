const { info, error } = require('pretty-console-logs');

exports.index = () => {

}

exports.create = async (guild_id, user_id) => {
    let profile = null;
    let data = {};
    info(`creating profile guild: ${guild_id} user: ${user_id}`);

    await core.api.post(`/profile/${guild_id}/${user_id}`, data)
        .then(({ data }) => {
            profile = data;
            profile.isNew = true;
        });

    return profile;
}

exports.show = async (guild_id, user_id) => {
    let profile = null;
    let params = {};
    await core.api.get(`/profile/${guild_id}/${user_id}`, {params})
    .then(({ data }) => {
        profile = data;
    }).catch(async err => {
        if (err?.response?.status == 404) {            
            profile = await this.create(guild_id, user_id);
        } else {
            console.error(err);
        }
    });    
    return {        
        user_id: profile.user_id,
        guild_id: profile.guild_id,
        pray: profile.pray,
        time_spents: profile.timespent,
        experience: profile.experience,
        voicepoints: profile.voicepoints,
        level: profile.level
    }
}

exports.update = (data) => {
    data.timespent = data.time_spents;        
    core.api.patch(`/profile/${data.guild_id}/${data.user_id}`, data).then(response => {
        // console.log(response.data);
    });
}

exports.addExperience = (guild_id, user_id, experience) => {
    let data = {
        "experience": experience,        
    };
    core.api.patch(`/profile/${guild_id}/${user_id}/add`, data);
}

exports.add = (guild_id, user_id, data) => {
    core.api.patch(`/profile/${guild_id}/${user_id}/add`, data);
}

exports.levelTop = async (guild_id) => {
    let top = [];
    top = await core.api.get(`/profile/${guild_id}/level-top`);
    return top.data ?? [];
}

exports.timeTop = async (guild_id) => {
    let top = [];
    top = await core.api.get(`/profile/${guild_id}/time-top`);
    return top.data ?? [];
}

exports.pointsTop = async (guild_id) => {
    let top = [];
    top = await core.api.get(`/profile/${guild_id}/points-top`);
    return top.data ?? [];
}

exports.transaction = (params) => {
    core.api.post('transaction', params).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.log(error.response);
    });
}