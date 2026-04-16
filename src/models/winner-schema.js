module.exports = (db) =>
  db.model(
    'Winner',
    db.Schema({
      uid: { type: String, required: true },
      name: { type: String, required: true },
      prizeId: { type: Number, required: true },
      prizeName: { type: String, required: true },
      wonAt: { type: Date, default: Date.now },
    })
  );
