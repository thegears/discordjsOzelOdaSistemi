const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");

module.exports = {
  customId: "kanal-sil",
  async run({ client, int, db }) {
    let kanal = db.get(`${int.member.user.id}_kanal`);
    if (!kanal)
      return await int.reply({
        content: "Bu ses kanalı size ait değil.",
        ephemeral: true
      });
    await client.channels.cache.get(kanal.ses).delete();
    await client.channels.cache.get(kanal.yazi).delete();

    db.delete(`${kanal.ses}_sahip`);
    db.delete(`${int.member.user.id}_kanal`);
  }
};
