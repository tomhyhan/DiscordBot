const Discord = require('discord.js');
const config = require('./config.json');
const fetch = require('node-fetch');

const client = new Discord.Client();

const prefix = '!';

client.on('message', async function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  // command parsar
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  let subCommand = args.shift();

  console.log(command, subCommand);

  if (command === 'pd') {
    let studying = true;
    let count = 1;
    if (subCommand === 'start') {
      while (studying) {
        message.reply('study time 🚀');
        await sleep(1500000);
        message.reply('break time 🙌');
        let res = await fetch('https://api.kanye.rest');
        let quote = await res.json();
        console.log(quote.quote);
        message.reply(`Kanye West: ${quote.quote}`);
        await sleep(300000);
        if (count < 4) {
          message.reply(`Pomodoro round ${count}`);
          studying = await collectMessage(message);
        }

        if (!studying) {
          message.reply('Pomodoro ended early 😥');
        }

        if (count === 4) {
          message.reply('Pomodoro cycle has ended with 4 cycles 🤗🤗');
          studying = false;
        }
        count++;
      }
    }
  }
});

client.login(config.BOT_TOKEN);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function collectMessage(message) {
  return new Promise((resolve) => {
    let filter = (msg) => msg.author.id === message.author.id;
    message.channel
      .send(`Are you done with studying \`YES\` / \`NO\``)
      .then(() => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time'],
          })
          .then((message) => {
            message = message.first();
            if (
              message.content.toUpperCase() == 'YES' ||
              message.content.toUpperCase() == 'Y'
            ) {
              resolve(false);
            } else if (
              message.content.toUpperCase() == 'NO' ||
              message.content.toUpperCase() == 'N'
            ) {
              resolve(true);
            } else {
              message.channel.send(`Terminated: Invalid Response`);
            }
          })
          .catch((collected) => {
            message.channel.send('Timeout');
          });
      });
  });
}
