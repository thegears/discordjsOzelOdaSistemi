const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");

module.exports = {
  customId: "kanal-isim-degistir",
  async run({ client, int, db }) {
    let kanal = db.get(`${int.member.user.id}_kanal`);
    if (!kanal)
      return await int.reply({
        content: "Bu ses kanalı size ait değil.",
        ephemeral: true
      });
    let modal = new Modal()
      .setCustomId("kanal-isim-degistir-modal")
      .setTitle("Kanal İsim Değiştir");
    modal.addComponents(
      new MessageActionRow().addComponents(
        new TextInputComponent()
          .setCustomId("kanal-isim")
          .setLabel("Kanal ismi")
          .setStyle("SHORT")
          .setMaxLength(20)
          .setMinLength(5)
          .setRequired(true)
      )
    );
    await int.showModal(modal);
  }
};
