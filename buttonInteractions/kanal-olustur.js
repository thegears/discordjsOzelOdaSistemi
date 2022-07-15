const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");

module.exports = {
  customId: "kanal-olustur",
  async run({ client, int, db }) {
    let modal = new Modal()
      .setCustomId("kanal-olustur-modal")
      .setTitle("Kanal oluştur");
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
