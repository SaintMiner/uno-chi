module.exports = {
    name: 'VoiceRoles',
    table_name: 'voice_roles',
    fields:{
        guild_id: "text",
        add_roles: {
            type: "list",
            typeDef: "<varchar>"
        },
        remove_roles: {
            type: "list",
            typeDef: "<varchar>"
        },
        settings: {
            type: "map",
            typeDef: "<varchar, varchar>"
        },
        level : "int"  
    },
    key:["guild_id", "level"]
};