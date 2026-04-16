const gachaRepository = require('./gacha-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');

const MAX_SPIN = 5;

const prizeList = [
  { id: 1, name: 'Emas 10 gram', rate: 0.001 },
  { id: 2, name: 'Smartphone X5', rate: 0.005 },
  { id: 3, name: 'Smartwatch Y10', rate: 0.01 },
  { id: 4, name: 'Voucher Rp100.000', rate: 0.1 },
  { id: 5, name: 'Pulsa Rp50.000', rate: 0.2 },
  { id: null, name: 'Zonk', rate: 0.684 },
];

function pickPrize() {
  const rand = Math.random();

  let cumulative = 0;
  const selected = prizeList.find((item) => {
    cumulative += item.rate;
    return rand <= cumulative;
  });

  return selected || prizeList[prizeList.length - 1];
}

function maskName(name) {
  const patterns = [
    // Pattern buat yang: J*** D**
    () => {
      if (name.includes(' ')) {
        const parts = name.split(' ');
        const first = parts[0][0] + '*'.repeat(parts[0].length - 1);
        const last = parts[1][0] + '*'.repeat(parts[1].length - 1);
        return `${first} ${last}`;
      }
      return name[0] + '*'.repeat(name.length - 1);
    },
    // Pattern untuk: *oh* D*e
    () => {
      if (name.length > 2) {
        const chars = name.split('');
        return chars
          .map((char, index) => {
            if (
              index !== 1 &&
              index !== name.length - 2 &&
              Math.random() > 0.5
            ) {
              return '*';
            }
            return char;
          })
          .join('');
      }
      return name[0] + '*'.repeat(name.length - 1);
    },
    // Pattern buat yang: J*** Doe
    () => {
      if (name.includes(' ')) {
        const parts = name.split(' ');
        const masked = `${parts[0][0] + '*'.repeat(parts[0].length - 1)} ${parts[1]}`;
        return masked;
      }
      return name[0] + '*'.repeat(name.length - 1);
    },
  ];

  const randomPattern = Math.floor(Math.random() * patterns.length);
  return patterns[randomPattern]();
}

async function doSpin(id, name) {
  const today = new Date().toISOString().split('T')[0];

  const userDaily = await gachaRepository.getDaily(id, today);
  if (userDaily && userDaily.count >= MAX_SPIN) {
    throw errorResponder(
      errorTypes.FORBIDDEN,
      'eum, lets stopeu gambling. besok lagiw yah'
    );
  }

  const picked = pickPrize();

  let result = {
    win: false,
    prize: null,
    message: 'Yah zonk, coba lagi!',
  };

  if (picked.id !== null) {
    const quota = await gachaRepository.getPrize(picked.id);

    if (quota && quota.left > 0) {
      const newQuota = quota.left - 1;
      await gachaRepository.reduceQuota(picked.id, newQuota);
      await gachaRepository.addWinner(id, name, picked);

      result = {
        win: true,
        prize: {
          id: picked.id,
          name: picked.name,
        },
        message: `UWAWWW GG GEMING ${picked.name}, SELAMAT YA`,
      };
    } else {
      result.message =
        'Eum- etto, ehe, hadiahnya udah abis.. jadi eum- lain waktu lagi ya';
    }
  }

  await gachaRepository.addSpinLog(id, name, result.win, result.prize);
  await gachaRepository.updateDaily(id, today, {
    time: new Date(),
    prize: result.prize,
    win: result.win,
  });

  return result;
}

async function getHistory(id) {
  const logs = await gachaRepository.getHistory(id);
  return logs.map((log) => ({
    time: log.time,
    win: log.isWin,
    prize: log.prize,
    message: log.isWin
      ? `Mendapatkan ${log.prize?.prizeName} `
      : 'NETNOT ZONK, coba lagi',
  }));
}

async function getRemainingQuota() {
  const prizes = await gachaRepository.getAllPrizes();
  return prizes.map((p) => ({
    id: p.prizeId,
    name: p.prizeName,
    total: p.max,
    remaining: p.left,
    taken: p.max - p.left,
  }));
}

async function getWinners(filterId = null) {
  let winners;
  if (filterId) {
    const id = parseInt(filterId, 10);
    winners = await gachaRepository.getWinnersByPrize(id);
  } else {
    winners = await gachaRepository.getAllWinners();
  }

  return winners.map((w) => ({
    id: w.id,
    maskedName: maskName(w.name),
    prizeId: w.prizeId,
    prizeName: w.prizeName,
    wonAt: w.wonAt,
  }));
}

async function init() {
  await gachaRepository.initQuota();
}

module.exports = {
  doSpin,
  getHistory,
  getRemainingQuota,
  getWinners,
  init,
};

// 0066
