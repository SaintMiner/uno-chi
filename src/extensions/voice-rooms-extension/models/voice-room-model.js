module.exports = {
    name: 'VoiceRooms',
    table_name: 'voice_rooms',
    fields:{
        room_id : "text",
        guild_id : "text",        
        settings: {
            type: "map",
            typeDef: "<varchar, varchar>"
        },
    },
    key:["room_id", "guild_id"]
};