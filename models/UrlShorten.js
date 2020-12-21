const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlShortenSchema = new Schema({
    longUrl: String,
    urlCode: { type: String, unique: true },
    shortUrl: String,
    validityAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

urlShortenSchema.index({ shortUrl: 1 }, { unique: true });

mongoose.model('UrlShorten', urlShortenSchema);
