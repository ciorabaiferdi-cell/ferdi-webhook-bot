const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const app = express();
app.use(express.json());

// 🔹 Config bot
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const ROLE_ID = process.env.ROLE_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once("ready", () => {
  console.log("✅ Discord bot is ready");
});

client.login(DISCORD_TOKEN);

// 🔹 Webhook endpoint
app.post("/assign", async (req, res) => {
  const { user_id, start_access, expires_at } = req.body;
  console.log("📥 Received:", req.body);

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(user_id);

    await member.roles.add(ROLE_ID);
    console.log(`🎯 Role assigned to ${user_id}`);

    const expiresInMs = new Date(expires_at) - new Date();
    setTimeout(async () => {
      try {
        await member.roles.remove(ROLE_ID);
        console.log(`⏱️ Role removed from ${user_id}`);
      } catch (err) {
        console.error("❌ Error removing role:", err);
      }
    }, expiresInMs);

    res.json({ status: "assigned", user: user_id });
  } catch (err) {
    console.error("❌ Error assigning role:", err);
    res.status(500).json({ error: "Failed to assign role" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
