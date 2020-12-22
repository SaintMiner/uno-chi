module.exports = {
    name: 'VoiceRoles',
    table_name: 'voice_roles',
    fields:{
        guild_id    : "text",
        role_id     : "text",
        level       : "int"
    },
    key:["guild_id", "role_id"]
};