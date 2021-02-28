module.exports = {
    name: 'CustomRoles',
    table_name: 'custom_roles',
    fields:{
        guild_id: "text",
        role_id: "text",
        settings: {
            type: "map",
            typeDef: "<varchar, varchar>"
        },        
    },
    key:["guild_id", "role_id"]
};