const mongoose = require('mongoose');
const { Schema } = mongoose;

const StatisticsSchema = new Schema({
    urlCode: { type: String },
    country: { type: String },
    city: { type: String },
    latlong: { type: Array },
    ip: { type: String },
    device: { type: String },
    date: { type: Date, default: Date.now },
});

StatisticsSchema.index({ urlCode: 1 });

mongoose.model('Statistics', StatisticsSchema);
