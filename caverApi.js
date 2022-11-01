require("dotenv").config();
const Caver = require("caver-js");

const endpoint = process.env.KLAY_ENDPOINT;

module.exports = {
  getBlockNumber: async () => {
    const caver = new Caver(endpoint);

    const blocknumber = await caver.klay.getBlockNumber();
    console.log(blocknumber);
  },

  getAccount: async (account) => {
    const caver = new Caver(endpoint);

    try {
      const res = await caver.klay.getAccount(account);
      return true;
    } catch (error) {
      console.log("Address invaild error!!");
      return false;
    }
  },
};
