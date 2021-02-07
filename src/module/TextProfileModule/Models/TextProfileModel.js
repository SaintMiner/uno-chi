module.exports = {
    name: 'TextProfiles',
    table_name: 'text_profiles',
    fields:{
        user_id         : "text",
        guild_id        : "text",
        experience      : "int",
        level           : "int",
        message_count   : "int",
    },
    key:["user_id", "guild_id"]
};