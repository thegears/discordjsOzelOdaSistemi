const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Collection,
  MessageSelectMenu,
  Modal,
  TextInputComponent,
  showModal
} = require("discord.js");
const config = require("./config.json");
const { readdirSync } = require("fs");
const client = new Client({
  intents: 32767
});
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase({
  databasePath: "./db.json"
});
client.login(config.token);
// Buton Etkileşimleri
client.buttonInteractions = new Collection();
readdirSync("./buttonInteractions/").forEach(f => {
  let cmd = require(`./buttonInteractions/${f}`);
  client.buttonInteractions.set(cmd.customId, cmd);
});
// Buton Etkileşimleri
// Modal Etkileşimleri
client.modalInteractions = new Collection();
readdirSync("./modalInteractions/").forEach(f => {
  let cmd = require(`./modalInteractions/${f}`);
  client.modalInteractions.set(cmd.customId, cmd);
});
// Modal Etkileşimleri
// Slash Etkileşimleri
client.slashInteractions = new Collection();
let globalSlashCommands = [];
readdirSync("./slashInteractions/").forEach(f => {
  let cmd = require(`./slashInteractions/${f}`);
  client.slashInteractions.set(cmd.name, cmd);
  globalSlashCommands.push(cmd.command);
});
// Slash Etkileşimleri
// Events'ları çekelim
readdirSync("./events/").forEach(f => {
  let event = require(`./events/${f}`);
  client.on(`${event.name}`, (...args) => {
    event.run(...args, db, config);
  });
});
// Events'ları çekelim
// Slash Global Komutlar Ekleyelim
let rest = new REST({
  version: "9"
}).setToken(config.token);
client.on("ready", async () => {
  let row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("kanal-olustur")
      .setLabel("Kanal oluştur")
      .setStyle("SUCCESS")
  );
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("Kanal oluştur")
    .setDescription(
      "Kendinize özel bir ses kanalı oluşturursunuz. Bu ses kanalının bilgilerini isteediğiniz gibi düzenlersiniz."
    )
    .setTimestamp();
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: globalSlashCommands
    });
    console.log("Global komutlar güncellendi.");
  } catch (error) {
    console.error(error);
  }
});
// Slash Global Komutlar Ekleyelim
client.on("interactionCreate", async int => {
  if (int.isCommand())
    client.slashInteractions.get(int.commandName)?.run({
      client,
      int,
      db,
      config
    });
  else if (int.isModalSubmit())
    client.modalInteractions.get(int.customId)?.run({
      client,
      int,
      db,
      config
    });
  else if (int.isButton())
    client.buttonInteractions.get(int.customId)?.run({
      client,
      int,
      db,
      config
    });
});
