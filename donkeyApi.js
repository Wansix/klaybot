require("dotenv").config();
const Caver = require("caver-js");
const priceViewABI = require("./abi/Donkey/PriceOracleView.json");
const donkeyABI = require("./abi/Donkey/DonkeyView.json");
const dTokenABI = require("./abi/Donkey/DToken.json");
const controllerABI = require("./abi/Donkey/Controller.json");

const priceOracleContractAddress = "0x2299dcfdec881f8b5169b7033b4bd2a6b337655f";
const donkeyViewContractAddress = "0xAe921bC9d0091Cf2235EbCD3A5850854291Ad94A";
const dTokenContractAddress = "0xC820e7b1EC1077Da8667149632A1A41a506cA690"; // dksp
const controllerContractAddress = "0x35dc04eE1D6E600C0d13B21FdfB5C83D022CEF25";

const endpoint = process.env.KLAY_ENDPOINT;

module.exports = {
  test: (address) => {
    console.log("donkeyApi test!!");

    const caver = new Caver(endpoint);

    const priceViewContract = new caver.klay.Contract(
      priceViewABI.abi,
      priceOracleContractAddress
    );
  },
  getTokenMetaDataList: (address) => {
    const caver = new Caver(endpoint);

    const viewContract = new caver.klay.Contract(
      donkeyABI,
      donkeyViewContractAddress
    );

    return viewContract.methods
      .dTokenMetaDataListAuth(address)
      .call()
      .then((result) => {
        //console.log("dTokenMetaDataListAuth", result);
        return result;
      });
  },

  getAccountLiquidityAvailable: (address) => {
    const caver = new Caver(endpoint);

    const controllerContract = new caver.klay.Contract(
      controllerABI.abi,
      controllerContractAddress
    );

    return controllerContract.methods
      .getAccountLiquidity(address, 1)
      .call()
      .then((result) => {
        return result;
        //console.log("account Liquidity : ", result);
      });
  },

  getPrices: () => {
    const caver = new Caver(endpoint);

    const priceViewContract = new caver.klay.Contract(
      priceViewABI.abi,
      priceOracleContractAddress
    );

    return priceViewContract.methods
      .getPrices()
      .call()
      .then((result) => {
        return result;
        // return result[1]; //result [1] : prices
      });
  },
};

// controllerContract.methods
// .getAllMarkets()
// .call()
// .then((result) => {
//   console.log("All markets : ", result);
// });

// controllerContract.methods
// .markets("0xC820e7b1EC1077Da8667149632A1A41a506cA690")
// .call()
// .then((result) => {
//   console.log("markets : ", result);
// });

// viewContract.methods
//   .getDTokenInfo("0xC820e7b1EC1077Da8667149632A1A41a506cA690")
//   .call()
//   .then((result) => {
//     console.log("getDtokenInfo", result);
//   });

// viewContract.methods
//   .getAccountInfo(
//     "0xC820e7b1EC1077Da8667149632A1A41a506cA690",
//     window.klaytn.selectedAddress
//   )
//   .call()
//   .then((result) => {
//     console.log("getAccountInfo", result);
//   });

// viewContract.methods
//   .dTokenMetaDataList()
//   .call()
//   .then((result) => {
//     console.log("dTokenMetaDataList", result);
//   });

// priceViewContract.methods
//   .getPrice(
//     "0x4b4c415900000000000000000000000000000000000000000000000000000000"
//   )
//   .call()
//   .then((result) => {
//     console.log("getPrice : ", result);
//   });

// controllerContract.methods
//   .accountAssets("0x4109DF03370eE7A155F61551beAA70f11d2A900b", 0)
//   .call()
//   .then((result) => {
//     console.log("accountAssets : ", result);
//   });
