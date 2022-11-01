const TelegramBot = require("node-telegram-bot-api");
const mongoDBApi = require("./mongoDBApi.js");
const caverApi = require("./caverApi.js");
const donkey = require("./Donkey.js");

const token = process.env.TELEGRAM_TOKEN;
const BORROW_RATE_ALARM_LEVEL = 80;
const CHECK_INTERVAL = 1000 * 60; //* 10;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

mongoDBApi.connect();

// bot.sendMessage(1843351909, "섭섭하네요 ^^");

const checkLiquidity = async (address) => {
  try {
    const availableLiquidity = await donkey.getAccountLiquidityAvailable(
      address
    );
    const myBorrowLiquidity = await donkey.getMyBorrowLiquidity(address);
    const usedBorrowBalance = await donkey.getUsedBorrowBalance(address);

    let borrowRate;
    if (myBorrowLiquidity === 0) {
      borrowRate = 0;
    } else {
      borrowRate = ((usedBorrowBalance / myBorrowLiquidity) * 100).toFixed(2);
    }

    return {
      availableLiquidity,
      myBorrowLiquidity,
      usedBorrowBalance,
      borrowRate,
    };
  } catch (error) {
    console.log("checkLiquidity error", error);
    return false;
  }
};

const checkUserInfos = async () => {
  try {
    const userDatas = await mongoDBApi.findAll("user");
    for (const index in userDatas) {
      const address = userDatas[index].address[0];
      const chatId = userDatas[index].chatId;

      const info = await checkLiquidity(address);
      if (info === false) {
        console.log("Info receive fail");
        return;
      } else {
        if (info.borrowRate > BORROW_RATE_ALARM_LEVEL) {
          console.log(info);
          bot.sendMessage(
            chatId,
            `!!담보 사용비율 80% 초과 !!\n\n내 대출 한도 : ${info.myBorrowLiquidity}원\n사용한 대출 한도 : ${info.usedBorrowBalance}원\n남은 대출 한도 : ${info.availableLiquidity}원\n담보 사용 비율 : ${info.borrowRate}%\n\n담보사용비율: 사용한 대출한도/ 내 대출 한도. 100%되면 청산 시작`
          );
        }
      }
    }
  } catch (error) {
    console.log("checkUserInfos error", error);
  }
};

donkey.getPrices();
// checkUserInfos();

setInterval(() => {
  checkUserInfos();
}, CHECK_INTERVAL);

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  //   bot.sendMessage(chatId, "1");
  bot.sendMessage(chatId, resp);
  bot.sendMessage(chatId, "1");
});

bot.onText(/\/add (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const address = match[1]; // the captured "whatever"

  const query = { chatId: chatId };

  const userData = await mongoDBApi.getData("user", query);
  if (userData) {
    bot.sendMessage(
      chatId,
      "Can not register address. You already have address : " +
        userData.address[0]
    );
    return;
  }

  const res = await caverApi.getAccount(address);
  if (res) {
    const userDoc = {
      chatId,
      address: [address],
    };

    mongoDBApi.insertDoc("user", userDoc);
    bot.sendMessage(chatId, "klayAlarmbot registered the address : " + address);
  } else {
    bot.sendMessage(chatId, "Invalid address. Can not register address.");
  }
});

bot.onText(/\/delete/, async (msg, match) => {
  const chatId = msg.chat.id;
  // const address = match[1]; // the captured "whatever"

  const query = { chatId: chatId };

  const userData = await mongoDBApi.getData("user", query);
  if (userData) {
    const userDoc = {
      chatId,
    };

    mongoDBApi.deleteDoc("user", userDoc);

    bot.sendMessage(chatId, "delete address complete.");
    return;
  } else {
    bot.sendMessage(
      chatId,
      "Can not delete address. You don't have address : "
    );
  }
});

bot.onText(/\/info/, async (msg, match) => {
  const chatId = msg.chat.id;
  // const address = match[1]; // the captured "whatever"

  const query = { chatId: chatId };

  const userData = await mongoDBApi.getData("user", query);
  if (userData) {
    const address = userData.address[0];

    const info = await checkLiquidity(address);

    bot.sendMessage(
      chatId,
      `내 지갑 : ${address}\n\n내 대출 한도 : ${info.myBorrowLiquidity}원\n사용한 대출 한도 : ${info.usedBorrowBalance}원\n남은 대출 한도 : ${info.availableLiquidity}원\n담보 사용 비율 : ${info.borrowRate}%\n\n담보사용비율: 사용한 대출한도/ 내 대출 한도. 100%되면 청산 시작`
    );
    return;
  } else {
    bot.sendMessage(chatId, "Can not get info. You should register address ");
  }
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  const helpMsg =
    "님 안녕하세요 환영합니다.\nmesher 청산 알람 봇(Beta)입니다.\n\n본 프로그램은 개인적으로 만든 프로젝트로 유지보수를 보장하지 않습니다.\nMesher 랜딩 프로토콜의 청산알람의 필요성을 느껴 만들었습니다.\n알람과 자산내역이 정확하지 않을 수 있습니다.\n백원단위는 버림하였습니다.\n\n명령어리스트\n/help : 명령어 리스트\n/add 지갑주소 :  지갑주소 추가 telegram 계정당 1개 추가가능\n (ex add 0xad32..sds) \n/delete : 등록된 지갑 삭제\n/info : 지갑정보 및 등록된 지갑의 mesher 예치 자산 총 대출 내역\n\n문의 메일 주소: noh891012@gmail.com";
  if (msg.text === "/start")
    bot.sendMessage(chatId, msg.chat.first_name + helpMsg);

  if (msg.text === "/help")
    bot.sendMessage(chatId, msg.chat.first_name + helpMsg);

  //bot.sendMessage(chatId, "명령어를 입력해보세요\n /echo message");

  // send a message to the chat acknowledging receipt of their message
  //bot.sendMessage(chatId, "Received your message");
  // bot.sendMessage(chatId, msg.text);
});
