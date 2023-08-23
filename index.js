import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import { RateLimitError } from "openai";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const openai = new OpenAI();
const data = new Map();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  const content = message.content.trim();

  if (
    message.author.bot ||
    message.channel.id !== process.env.CHANNEL_ID ||
    (content !== ".sıfırla" && content.startsWith("."))
  )
    return;

  if (content === ".sıfırla") {
    data.delete(message.author.id);

    await message.reply("Önceki konuşmalarınız sıfırlandı!");
    return;
  }

  // İstek hızını kontrol etmek için bekleme süresi ekleme
  await message.channel.sendTyping();
  await new Promise(resolve => setTimeout(resolve, 2000)); // Bekleme süresi

  if (!data.has(message.author.id)) data.set(message.author.id, []);
  const userData = [...data.get(message.author.id), { role: "user", content }];
  data.set(message.author.id, userData);

  try {
    const completion = await openai.chat.completions.create({
      messages: userData,
      model: "gpt-3.5-turbo",
    });

    const answer = completion.choices[0].message;
    data.set(message.author.id, [...userData, answer]);

    // İşlem sonrası bekleme süresi ekleme
    await new Promise(resolve => setTimeout(resolve, 2000)); // Bekleme süresi

    await message.reply({
      content: answer.content,
    });
  } catch (error) {
if (error instanceof RateLimitError) {
  // Sınırlara uygun şekilde işleme veya bekleme süresi ekleme
  await new Promise(resolve => setTimeout(resolve, 60000)); // Bir dakika beklemek
  return;
} else {
  console.error("Bir hata oluştu:", error);
}
  }
});

client.login(process.env.TOKEN);