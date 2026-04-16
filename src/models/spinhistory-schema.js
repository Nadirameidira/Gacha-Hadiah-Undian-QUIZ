module.exports = (db) =>
  db.model(
    'SpinHistory',
    db.Schema({
      uid: { type: String, required: true },
      name: { type: String, required: true },
      time: { type: Date, default: Date.now },
      isWin: { type: Boolean, default: false },
      prize: {
        prizeId: { type: Number },
        prizeName: { type: String },
      },
    })
  );
