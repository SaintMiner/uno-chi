module.exports = {
    name: 'VoiceRoles',
    table_name: 'voice_roles',
    fields:{
        guild_id    : "text",
        role_id     : {
            type: "list",
            typeDef: "<varchar>"
        },
        level       : "int"  
    },
    key:["guild_id", "level"]
};