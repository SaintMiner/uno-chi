module.exports = {
    name: 'Guilds',
    table_name: 'guilds',
    fields:{
        guild_id        : "text",
        channels: {
            type: "map",
            typeDef: "<varchar, varchar>"
        },
        settings: {
            type: "map",
            typeDef: "<varchar, varchar>"
        },
        extensions: {
            type: "list",
            typeDef: "<varchar>"
        }
    },
    key:["guild_id"]
};