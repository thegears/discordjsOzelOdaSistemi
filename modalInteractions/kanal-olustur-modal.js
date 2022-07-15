const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  customId: "kanal-olustur-modal",
  async run({ client, int, db, config }) {
    let kanalIsim = int.fields.getTextInputValue("kanal-isim");
    if (db.get(`${int.member.user.id}_kanal`))
      return await int.reply({
        content:
          "Zaten bir kanalınız var. Tekrar oluşturmak için mevcut kanalınızı silin.",
        ephemeral: true
      });

    let sesKanal = await int.guild.channels.create(`${kanalIsim}`, {
      type: "GUILD_VOICE",
      parent: config["kategori-id"]
    });

    let yaziKanal = await int.guild.channels.create(
      `${int.member.user.username}`,
      {
        parent: config["kategori-id"],
        permissionOverwrites: [
          {
            id: int.guild.roles.everyone,
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
          },
          {
            id: int.member.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
          }
        ]
      }
    );

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("kanal-sil")
        .setLabel("Kanalı sil")
        .setStyle("DANGER"),
      new MessageButton()
        .setCustomId("kanal-isim-degistir")
        .setLabel("Kanalın ismini değiştir")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("kanal-limit-degistir")
        .setLabel("Kanalın limitini değiştir")
        .setStyle("SUCCESS")
    );
    let embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Kanal oluşturuldu")
      .setDescription(
        `${kanalIsim} adında ses kanalın oluşturuldu. Ve bu yazı kanalı sadece sana özel. Aşağıdaki butonlarla ses kanalını düzenleyebilirsin. \n\n**/ban** > Bir Kullanıcıyı Odanızdan Banlarsınız\n**/unban** > Bir Kullanıcının Odanızdan Banını Kaldırırsanız\n**/sahipliyi-aktar** > Kurduğunuz Odanın Sahipliğini Başka Birine Devredersiniz`
      )
      .setTimestamp();

    yaziKanal.send({
      embeds: [embed],
      components: [row]
    });

    db.set(`${int.member.user.id}_kanal`, {
      ses: sesKanal.id,
      yazi: yaziKanal.id
    });
    db.set(`${sesKanal.id}_sahip`, int.member.user.id);
    int.reply({
      content: `Kanal oluşturuldu, <#${sesKanal.id}>`,
      ephemeral: true
    });
  }
};
