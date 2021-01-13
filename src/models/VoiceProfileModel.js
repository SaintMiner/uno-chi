module.exports = {
    name: 'VoiceProfiles',
    table_name: 'voice_profiles',
    fields:{
        user_id     : "text",
        guild_id    : "text",
        experience  : "int",
        level       : "int",
        voicepoint  : "int",
        time_spent  : "int",
        pray_date   : "timestamp",
        pray_streak : "int",
    },
    key:["user_id", "guild_id"]
};