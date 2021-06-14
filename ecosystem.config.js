module.exports = {
  apps : [{
    script: './src/bot.js',
    watch: false,
    env: {
    DISCORDJS_BOT_TOKEN: process.env.DISCORDJS_BOT_TOKEN,
    },
  }],
};
