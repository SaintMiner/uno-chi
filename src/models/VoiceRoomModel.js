module.exports = {
    name: 'VoiceRooms',
    table_name: 'voice_rooms',
    fields:{
        room_id : "text",
        guild_id : "text",
        experience : "int",
        support_weekday_double : {
            type : "boolean",
            default : false,
        },
        owner_id : "text"
    },
    key:["room_id", "guild_id"]
};