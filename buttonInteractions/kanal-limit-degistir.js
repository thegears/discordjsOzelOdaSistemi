const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");

module.exports = {
  customId: "kanal-limit-degistir",
  async run({ client, int, db }) {
    let kanal = db.get(`${int.member.user.id}_kanal`);
    if (!kanal)
      return await int.reply({
        content: "Bu ses kanalı size ait değil.",
        ephemeral: true
      });
    let modal = new Modal()
      .setCustomId("kanal-limit-degistir-modal")
      .setTitle("Kanal Limit Değiştir");
    modal.addComponents(
      new MessageActionRow().addComponents(
        new TextInputComponent()
          .setCustomId("kanal-limit")
          .setLabel("Kanal limit")
          .setStyle("SHORT")
          .setMaxLength(2)
          .setMinLength(1)
          .setRequired(true)
      )
    );
    await int.showModal(modal);
  }
};
