const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const axios = require('axios');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 8).toLowerCase() == '!pokemon') {
        const args = message.substring(1).split(' ');
        
        apiCall(args[1].toLowerCase(), channelID, userID, Number(args[1]));     
     }
});

function apiCall(string, channelID, userID, isNumeric){
    axios.get('https://pokeapi.co/api/v2/pokemon/' + string)
        .then(res => {
            bot.sendMessage({
                to: channelID,
                message: (isNumeric ? capitalizeFirstLetter(res.data.name) : res.data.id)  + " <@" + userID + ">",
            });
        })
        .catch(err => {
            bot.sendMessage({
                to: channelID,
                message: err.response.statusText  + " <@" + userID + ">",
            });
    });
}


function capitalizeFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}
