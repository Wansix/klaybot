const donkeyApi = require("./donkeyApi.js");

let tokenPriceInfos = [];

function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    var ch = String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    if (ch >= "A") {
      str += ch;
    }
  }
  return str;
}

module.exports = {
  getUsedBorrowBalance: async (address) => {
    return await donkeyApi.getTokenMetaDataList(address).then((result) => {
      //   console.log("dTokenMetaDataListAuth", result);
      let borrowedBalance = 0;
      for (var index in result) {
        const decimal = result[index].dTokenInfo.underlyingDecimals;
        const balance =
          result[index].accountInfo.myBorrowedBalance.toString(10) /
          10 ** decimal;
        if (balance === 0) {
          continue;
        }

        const price = tokenPriceInfos[index].price;
        const liquidity = price * balance;

        borrowedBalance += liquidity;
        borrowedBalance = borrowedBalance / 1000;
        borrowedBalance = parseInt(borrowedBalance);
        borrowedBalance = borrowedBalance * 1000;
      }

      return borrowedBalance.toFixed(0);
    });
  },

  getMyBorrowLiquidity: async (address) => {
    return await donkeyApi.getTokenMetaDataList(address).then((result) => {
      //   console.log("dTokenMetaDataListAuth", result);
      let myBorrowLiquidity = 0;
      for (var index in result) {
        const decimal = result[index].dTokenInfo.underlyingDecimals;
        const balance =
          result[index].accountInfo.mySuppliedBalance.toString(10) /
          10 ** decimal;

        // result[index].accountInfo.myBorrowedBalance.toString(10) /
        // 10 ** decimal;
        if (balance === 0) {
          continue;
        }

        const collateralFactor =
          result[index].dTokenInfo.collateralFactor.substr(0, 2) / 100;

        const price = tokenPriceInfos[index].price;
        const liquidity = price * balance * collateralFactor;

        myBorrowLiquidity += liquidity;
        myBorrowLiquidity = myBorrowLiquidity / 1000;
        myBorrowLiquidity = parseInt(myBorrowLiquidity);
        myBorrowLiquidity = myBorrowLiquidity * 1000;
      }

      return myBorrowLiquidity.toFixed(0);
    });
  },

  getPrices: async () => {
    await donkeyApi.getPrices().then((result) => {
      const tokenPriceArr = [];
      for (var index in result[0]) {
        const symbolHex = result[0][index];
        const price = result[1][index];
        const symbol = hex_to_ascii(symbolHex);
        const tokenPriceInfo = { name: symbol, price: price };

        tokenPriceArr.push(tokenPriceInfo);
      }

      tokenPriceInfos = tokenPriceArr;
      console.log("get Prices:", tokenPriceInfos);
    });
  },

  getAccountLiquidityAvailable: async (address) => {
    return await donkeyApi
      .getAccountLiquidityAvailable(address)
      .then((result) => {
        let liquidity = (result[1].toString(10) / 10 ** 18).toFixed(0);
        // console.log("getAccountLiquidityAvailable : ", liquidity);
        liquidity = liquidity / 1000;
        liquidity = parseInt(liquidity);
        liquidity = liquidity * 1000;
        return liquidity;
      });
  },
};
