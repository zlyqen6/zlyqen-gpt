const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const token = process.env.token

module.exports = async (client) => {

  const rest = new REST({ version: "10" }).setToken(token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }

    console.log(`${client.user.tag} Aktif!`);
const { ActivityType } = require('discord.js')

client.user.setPresence({ 
    activities: [{ 
        name: 'zlyqenx', 
        type: ActivityType.Streaming, 
        url: 'https://twitch.tv/zlyqenx' 
    }], 
    status: 'online' 
});


}