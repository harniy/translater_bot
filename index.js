const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const config = require('./config.json')


let userText = ''

// bot token
const token = config.token

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text
    const userLeng = msg.from.language_code
    if (text === '/start') {
        return bot.sendMessage(chatId, 'Приветствую! Просто введите текст и я его переведу! Доступны больше 100 различных языков 🇺🇦 🇫🇷 🇩🇪 🇨🇳 🇯🇵 🇺🇸 🇮🇹 ~~~ ')
    }
    if (text !== '/start'){
       defineLanguage(text, userLeng, chatId)
    }
    if(text.length === 2){
        let mainText = userText
        let translateLang = text

        translateString(mainText, translateLang, chatId)
    }
    if(text.match(/[0-9]/) && text.length < 3){
        bot.sendMessage(chatId, 'Вы ввели цифты, а нужны буквы, например uk, en, fr')
    }
});

function defineLanguage(text, userLeng, chatId) {
    const options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/Detect',
        params: {'api-version': '3.0'},
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': '5004efafb9msh4bc462359e588c3p145a3cjsn5a13394dc6ae',
          'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [{Text: String(text) }]
      };
      
      axios.request(options).then(function (response) {

         if (response.data[0].language === userLeng){
             userText = text
            getLenguage(chatId)
         } 
         if (response.data[0].language !== userLeng && userText === '' && text.length > 2) {
            translateString(text, userLeng, chatId)
         }
      }).catch(function (error) {
          console.error(error);
      });
}

function getLenguage(chatId){
    bot.sendMessage(chatId, 'Введите код страны, на язык которой вы хотите перевести! Например: uk 🇺🇦 (Украинский), ru 🇷🇺 (Русский), de 🇩🇪 (Немецкий), en 🇺🇸 (Английский), fr 🇫🇷 (Французский) и т.д.! ~~~ Более поднобно можете ознакомиься на сайте Википедии https://ru.wikipedia.org/wiki/ISO_3166-1 ')
}

function translateString(str, leng, chatId) {
    const options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {'api-version': '3.0', to: String(leng), textType: 'plain', profanityAction: 'NoAction'},
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': '5004efafb9msh4bc462359e588c3p145a3cjsn5a13394dc6ae',
          'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [{Text: String(str)}]
      };
      
      axios.request(options).then(function (response) {
          const text = response.data[0].translations[0].text
          setTranslate(text, leng, chatId)
      }).catch(function (error) {
          console.error(error);
      });
}

function setTranslate(text, leng = null, chatId) {
    userText = ''
   return bot.sendMessage(chatId, text)
}