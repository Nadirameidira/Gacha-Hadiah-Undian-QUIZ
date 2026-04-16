const {
  DailyLimit,
  PrizeQuota,
  SpinHistory,
  Winner,
} = require('../../../models');

async function getDaily(id, date) {
  return DailyLimit.findOne({ uid: id, date });
}

async function updateDaily(id, date, data) {
  return DailyLimit.findOneAndUpdate(
    { uid: id, date },
    { $inc: { count: 1 }, $push: { logs: data } },
    { upsert: true, new: true }
  );
}

async function getAllPrizes() {
  return PrizeQuota.find({});
}

async function getPrize(prizeId) {
  return PrizeQuota.findOne({ prizeId });
}

async function reduceQuota(prizeId, newQuota) {
  return PrizeQuota.findOneAndUpdate(
    { prizeId },
    { left: newQuota },
    { new: true }
  );
}

async function addWinner(id, name, prize) {
  return Winner.create({
    uid: id,
    name,
    prizeId: prize.id,
    prizeName: prize.name,
  });
}

async function addSpinLog(id, name, isWin, prize = null) {
  return SpinHistory.create({
    uid: id,
    name,
    isWin,
    prize: prize
      ? {
          prizeId: prize.id,
          prizeName: prize.name,
        }
      : null,
  });
}

async function getHistory(id) {
  return SpinHistory.find({ uid: id }).sort({ time: -1 });
}

async function getAllWinners() {
  return Winner.find({}).sort({ wonAt: -1 });
}

async function getWinnersByPrize(prizeId) {
  return Winner.find({ prizeId }).sort({ wonAt: -1 });
}

async function initQuota() {
  const prizes = [
    { prizeId: 1, prizeName: 'Emas 10 gram', max: 1 },
    { prizeId: 2, prizeName: 'Smartphone X5', max: 5 },
    { prizeId: 3, prizeName: 'Smartwatch Y10', max: 10 },
    { prizeId: 4, prizeName: 'Voucher Rp100.000', max: 100 },
    { prizeId: 5, prizeName: 'Pulsa Rp50.000', max: 500 },
  ];

  const updateOperations = prizes.map((prize) =>
    PrizeQuota.findOneAndUpdate(
      { prizeId: prize.prizeId },
      {
        prizeName: prize.prizeName,
        max: prize.max,
        left: prize.max,
      },
      { upsert: true }
    )
  );

  await Promise.all(updateOperations);
}

module.exports = {
  getDaily,
  updateDaily,
  getAllPrizes,
  getPrize,
  reduceQuota,
  addWinner,
  addSpinLog,
  getHistory,
  getAllWinners,
  getWinnersByPrize,
  initQuota,
};

// 0066
