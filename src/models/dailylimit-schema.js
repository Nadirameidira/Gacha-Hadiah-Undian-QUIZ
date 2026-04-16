module.exports = (db) =>
  db.model(
    'DailyLimit',
    db.Schema({
      uid: { type: String, required: true },
      date: { type: String, required: true },
      count: { type: Number, default: 0 },
      logs: [
        {
          time: { type: Date, default: Date.now },
          prize: { type: Object, default: null },
          win: { type: Boolean, default: false },
        },
      ],
    })
  );
