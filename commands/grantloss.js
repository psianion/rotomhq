const mongoose = require("mongoose");
// const botconfig = require("../botconfig.json");

//Connect to db
mongoose.connect(process.env.mongoPass, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//MODELS
const Data = require("../models/data.js");

module.exports.run = async (bot, message, args) => {
  let user = message.mentions.users.first() || bot.users.cache.get(args[0]);
  if (message.author.id != ("271234466993799180" || "540838426484801536"))
    return message.reply("you're not an admin, are you boy?");
  if (!user) return message.reply("Sorry, that user is not registered yet!");

  Data.findOne(
    {
      userID: message.author.id,
    },
    (err, authorData) => {
      if (err) console.log(err);
      if (!authorData) {
        return message.reply("Cannot grant you losses! Come back later!");
      } else {
        Data.findOne(
          {
            userID: user.id,
          },
          (err, userData) => {
            if (err) console.log(err);

            if (!args[1])
              return message.reply(
                "Just how many losses would you want to grant this trainer?"
              );

            if (args[1] != Math.floor(args[1]))
              return message.reply(
                "Oof! Enter only whole numbers there boiy! You can't lose half a match!"
              );

            if (!userData) {
              const newData = new Data({
                name: bot.users.cache.get(user.id).username,
                userID: user.id,
                lb: "all",
                creds: 0,
                wins: 0,
                losses: parseInt(args[1]),
                leaderlosses: 0,
                leaderwins: 0,
              });
              newData.save().catch((err) => console.log(err));
            } else {
              userData.losses += parseInt(args[1]);
              userData.save().catch((err) => console.log(err));
            }

            return message.channel.send(
              `${message.author}, you just granted ${user} with ${args[1]} losses!`
            );
          }
        );
      }
    }
  );
};

module.exports.help = {
  name: "grantloss",
  aliases: ["gl"],
};
