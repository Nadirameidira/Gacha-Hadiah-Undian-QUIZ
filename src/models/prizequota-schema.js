module.exports = (db) =>
  db.model(
    'PrizeQuota',
    db.Schema({
      prizeId: { type: Number, required: true, unique: true },
      prizeName: { type: String, required: true },
      max: { type: Number, required: true },
      left: { type: Number, required: true },
    })
  );
