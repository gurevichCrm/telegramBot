const TelegramApi = require('node-telegram-bot-api');
const OpenAi = require('openai');
const fs = require('fs');
// const sequelize = require('./db');
// const UserModel = require('./models');

const botToken = '6798766230:AAE8H8FUwXLEiAEkrQHhkip1KYa5hF-7ZAA';
const openAiKey = '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';

const bot = new TelegramApi(botToken, {polling: true});
const openAi = new OpenAi({
  apiKey: openAiKey
});

let chatFlag = '';

const imitationSql = {
  fio: 'Серегей',
  skills: '',
  additional_skills: '',
  questions: '',
  cv: '',
  projects: '',
  otrabotka: '',
};

const start = async () => {
  /// для подключения бд postgress
  // try {
  //     await sequelize.authenticate()
  //     await sequelize.sync()
  // } catch (e) {
  //     console.log('Подключение к бд сломалось', e)
  // }

  bot.setMyCommands([
      {command: '/start', description: 'Начальное приветствие'},
      {command: '/sbor_info', description: 'Сбор информации'},
      {command: '/talk_chat_gpt', description: 'Общение с chatGpt'},
      // {command: '/download_csv', description: 'Скачать данные из sql'},
  ])

  bot.on('message', async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;

      try {
          if (text === '/start') {
              // await UserModel.create({chatId})
              chatFlag = '';
              await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
              return bot.sendMessage(chatId, `Этот бот может использоваться для сбора данных и записи данных в sql, также можно ипользовать chatGpt для ответов на любой вопрос`);
          }

          /////// начало сбора информации
          if (text  === '/sbor_info') {
            chatFlag = 'sbor_fio';
            await bot.sendMessage(chatId, `Сейчас я задам вам несколько вопросов, ответьте на них`);
            return bot.sendMessage(chatId, `Напишите ваше ФИО`);
          }if (text && chatFlag === 'sbor_fio') {
            chatFlag = 'sbor_skills';
            // const userInfo = await UserModel.findOne({chatId});
            // userInfo.fio = text;
            imitationSql.fio = text;
            return bot.sendMessage(chatId, `Опишите ваши основные навыки/специализацию`);
          }if (text && chatFlag === 'sbor_fio') {
            chatFlag = 'sbor_skills';
            // const userInfo = await UserModel.findOne({chatId});
            // userInfo.skills = text;
            imitationSql.skills = text;
            return bot.sendMessage(chatId, `Опишите ваши основные навыки/специализацию`);
          }if (text && chatFlag === 'sbor_skills') {
            // const userInfo = await UserModel.findOne({chatId});
            // userInfo.additional_skills = text;
            imitationSql.additional_skills = text;
            chatFlag = 'sbor_additional_skills';
            return bot.sendMessage(chatId, `Опишите ваши дополнительные навыки`);
          }if (text && chatFlag === 'sbor_additional_skills') {
            // const userInfo = await UserModel.findOne({chatId});
            // userInfo.questions = text;
            imitationSql.questions = text;
            chatFlag = 'sbor_questions';
            return bot.sendMessage(chatId, `По каким вопросам к вам можно обращаться, и с решением каких вопросов полезно вам?`);
          }if (text && chatFlag === 'sbor_questions') {
            // const userInfo = await UserModel.findOne({chatId});
            // userInfo.cv = text;
            imitationSql.cv = text;
            chatFlag = 'sbor_cv';
            return bot.sendMessage(chatId, `Отправьте ссылку на ваше резюме`);
          }if (text && chatFlag === 'sbor_cv') {
            // const userInfo = await UserModel.findOne({chatId});
            // userInfo.projects = text;
            imitationSql.projects = text;
            chatFlag = 'sbor_projects';
            return bot.sendMessage(chatId, `Опишите ваши проекты/достижения`);
          }if (text && chatFlag === 'sbor_projects') {
            // const userInfo = await UserModel.findOne({chatId});
            // userInfo.otrabotka = text;
            imitationSql.otrabotka = text;
            chatFlag = 'sbor_otrabotka';
            return bot.sendMessage(chatId, `Укажите для будущего подтверждения отработки. Например вашу должность и чем вы занимались`);
          }if (text && chatFlag === 'sbor_otrabotka') {
            chatFlag = '';
            return bot.sendMessage(chatId, `Спасибо опрос окончен`);
          }
          //// конец сбора информации


          //// начало chatGpt
          if (text === '/talk_chat_gpt') {
            chatFlag = 'talk_chat_gpt';
            return bot.sendMessage(chatId, `Задавайте вопросы, вам ответит chatGpt!`);
          }if (text && chatFlag === 'talk_chat_gpt') {
            const chatGptResponse = await openAi.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [{role: 'user', content: text ?? ''}]
            });
            return bot.sendMessage(chatId, chatGptResponse.choices[0].message.content);
          }
          //// конец chatGpt

          // if (text === '/download_csv') {
          //   // const userInfo = Object.values(imitationSql).join('\n');
          //   return bot.sendDocument(chatId, `${userInfo}`);
          // }
          return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
      } catch (e) {
          return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
      }

  })
}

start();
