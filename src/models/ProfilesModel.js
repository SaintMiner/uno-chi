module.exports = {
    name: 'Profiles',
    table_name: 'profiles',
    fields:{
        user_id     : "text",
        guild_id    : "text",
        experience  : "int",
        level       : "int",
        voicepoint  : "int"
    },
    key:["user_id", "guild_id"]
};