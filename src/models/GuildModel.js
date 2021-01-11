module.exports = {
    name: 'Guilds',
    table_name: 'guilds',
    fields:{
        guild_id        : "text",
        alert_channel_id: "text",
        roullete_channel_id: "text"
    },
    key:["guild_id"]
};