const { ChannelType } = require("discord.js");

/**
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').GuildTextBasedChannel} giveawayChannel
 * @param {number} duration
 * @param {string} prize
 * @param {number} winners
 * @param {import('discord.js').User} [host]
 * @param {string[]} [allowedRoles]
 */
module.exports = async (member, giveawayChannel, duration, prize, winners, host, allowedRoles = []) => {
  try {
    if (!host) host = member.user;
    if (!member.permissions.has("ManageMessages")) {
      return "You need to have the manage messages permissions to start giveaways.";
    }

    if (!giveawayChannel.type === ChannelType.GuildText) {
      return "You can only start giveaways in text channels.";
    }

    /**
     * @type {import("discord-giveaways").GiveawayStartOptions}
     */
    const options = {
      duration: duration,
      prize,
      winnerCount: winners,
      hostedBy: host,
      thumbnail: "https://i.imgur.com/DJuTuxs.png",
      messages: {
        giveaway: "<a:giveaway:1187291162084638800> **GIVEAWAY** <a:giveaway:1187291162084638800>",
        giveawayEnded: "<a:giveaway:1187291162084638800> **GIVEAWAY ENDED** <a:giveaway:1187291162084638800>",
        inviteToParticipate: "React with <a:giveaway:1187291162084638800> to enter",
        dropMessage: "Be the first to react with <a:giveaway:1187291162084638800> to win!",
        hostedBy: `\nHosted by: ${host.username}`,
      },
    };

    if (allowedRoles.length > 0) {
      options.exemptMembers = (member) => !member.roles.cache.find((role) => allowedRoles.includes(role.id));
    }

    await member.client.giveawaysManager.start(giveawayChannel, options);
    return `Giveaway started in ${giveawayChannel}`;
  } catch (error) {
    member.client.logger.error("Giveaway Start", error);
    return `An error occurred while starting the giveaway: ${error.message}`;
  }
};
