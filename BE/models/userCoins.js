const mongoose = require("mongoose");

let userCoins = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  btcBalance: {
    type: Number,
    default: 0,
  },
  btcTokenAddress: {
    type: String,
    default: "",
  },

  ethBalance: {
    type: Number,
    default: 0,
  },
  ethTokenAddress: {
    type: String,
    default: "",
  },

  usdtBalance: {
    type: Number,
    default: 0,
  },
  additionalCoins: {
    type: [
      {
        coinName: { type: String, required: true },
        coinSymbol: { type: String, required: true },
        balance: { type: Number, default: 0 },
        tokenAddress: { type: String, default: "" },
      }
    ],
    default: [
      { coinName: "BNB", coinSymbol: "bnb", balance: 0, tokenAddress: "" },
      { coinName: "XRP", coinSymbol: "xrp", balance: 0, tokenAddress: "" },
      { coinName: "Dogecoin", coinSymbol: "doge", balance: 0, tokenAddress: "" },
      { coinName: "Toncoin", coinSymbol: "ton", balance: 0, tokenAddress: "" },
      { coinName: "Chainlink", coinSymbol: "link", balance: 0, tokenAddress: "" },
      { coinName: "Polkadot", coinSymbol: "dot", balance: 0, tokenAddress: "" },
      { coinName: "Near Protocol", coinSymbol: "near", balance: 0, tokenAddress: "" },
      { coinName: "USD Coin", coinSymbol: "usdc", balance: 0, tokenAddress: "" },
      { coinName: "Tron", coinSymbol: "trx", balance: 0, tokenAddress: "" },
      { coinName: "Solana", coinSymbol: "sol", balance: 0, tokenAddress: "" },
      { coinName: "Euro", coinSymbol: "eur", balance: 0, tokenAddress: "" }
    ],
  },
  usdtTokenAddress: {
    type: String,
    default: "",
  },
  transactions: [
    {
      tradingStatus: {

        type: String,
        enum: ['closed', 'open', 'simple']
      },
      closedAt: {

        type: Date,
      },
      withdraw: {
        type: String,
        required: true,
        enum: ["crypto", "bank"],
      },
      selectedPayment: {
        type: String,
      },
      trxName: { type: String },
      amount: {
        type: Number,
        required: true,
      },
      txId: {
        type: String,
        required: true,
      },
      tradingTime: {
        type: String,
      },

      startDate: {
        type: Date,

      },
      lastProfitDate: {
        type: Date,

      },
      totalProfit: {
        type: Number,

      },
      isTrading: {
        type: Boolean,
        default: false
      },
      fromAddress: {
        type: String,
      },
      status: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      note: {
        type: String,
      },
      reference: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      isHidden: {
        type: Boolean,
        default: false,
      },
      dailyProfits: [
        {
          date: { type: Date, default: Date.now },
          profit: { type: Number, }
        }
      ],
      by: {
        type: String,
        default: "admin",
      },
      stakingData: {
        isStaking: { type: Boolean, default: false },
        duration: { type: Number }, // staking duration in days
        interestRate: { type: Number }, // percentage rate
        expectedReward: { type: Number }, // calculated expected reward
        actualReward: { type: Number, default: 0 }, // actual reward received
        stakingStart: { type: Date }, // when staking began
        stakingEnd: { type: Date }, // when staking completes
        isRewardDistributed: { type: Boolean, default: false },
        rewardDistributionDate: { type: Date }, // when reward was given
        stakingType: { type: String }, // e.g., 'fixed', 'flexible'
        coin: { type: String }, // coin that was staked
        status: {
          type: String,
          enum: ['active', 'completed', 'cancelled'],
          default: 'active'
        }
      },

    },
  ],

  stocks: [
    {
      stockName: {
        type: String,
        required: true,
      },
      stockSymbol: {
        type: String,
        required: true,
      },
      stockAmount: { type: Number, required: true },
      stockValue: {
        type: Number,
        required: true,
      },


    },
  ],
  stakingSettings: {
    disabledCoins: {
      type: [String],
      default: []
    },
    customRates: {
      type: Map,
      of: {
        thirtyDays: { type: Number, default: 11 },
        sixtyDays: { type: Number, default: 45 },
        ninetyDays: { type: Number, default: 123 }
      },
      default: {}
    }
  },
});

let userModel = mongoose.model("userCoin", userCoins);

module.exports = userModel;
