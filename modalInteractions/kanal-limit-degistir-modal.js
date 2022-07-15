const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  customId: "kanal-limit-degistir-modal",
  async run({ client, int, db, config }) {
    let limit = int.fields.getTextInputValue("kanal-limit");
    if (isNaN(limit))
      return await int.reply({
        content: "Lütfen bir sayı girin.",
        ephemeral: true
      });
    let kanal = await db.get(`${int.member.user.id}_kanal`);

    client.channels.cache.get(kanal.ses).setUserLimit(limit);

    await int.reply({
      content: "Değiştirildi",
      ephemeral: true
    });
  }
};
