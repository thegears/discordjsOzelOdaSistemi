module.exports = {
  name: "voiceStateUpdate",
  async run(oVS, nVS, db, config) {
    if (!oVS.channelId && nVS.channelId) {
      let banlar = (await db.get(`${nVS.channelId}_banlar`)) || [];
      if (banlar.includes(nVS.id)) {
        oVS.guild.members.cache.get(oVS.id).voice.disconnect();
      }
    } else {
      if (!oVS.channelId) return;
      let kanal = oVS.guild.channels.cache.get(oVS.channelId);
      let sahip = db.get(`${oVS.channelId}_sahip`);
      let dbkanal = db.get(`${sahip}_kanal`);

      if (kanal.parentId == config["kategori-id"]) {
        if (kanal?.members.map(r => r).length == 0) {
          setTimeout(() => {
            if (
              oVS.guild.channels.cache.get(oVS.channelId)?.members.map(r => r)
                .length == 0
            ) {
              kanal.delete();
              oVS.guild.channels.cache.get(dbkanal.yazi).delete();
              db.delete(`${sahip}_kanal`);
              db.delete(`${oVS.channelId}_sahip`);
            }
          }, 30000);
        }
      }
    }
  }
};
