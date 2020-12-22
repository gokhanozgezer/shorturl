const mongoose = require('mongoose');
const validUrl = require('valid-url');
const UrlShorten = mongoose.model('UrlShorten');
const Statistics = mongoose.model('Statistics');
const config = require('config');
const shortCode = require('../middlewares/uniqueUrlCode');
const moment = require('moment');
const shortBaseUrl = config.get('shortDomain');
const today = new Date();
const domain = config.get('shortDomain');

module.exports = {
    create: async function (longUrl, validityTime) {
        const validityDay = config.get('urlDefaultValidityDay');
        const validityAt = validityTime != undefined ? moment().add(validityTime, 'days').format('x') : moment().add(validityDay, 'days').format('x');
        const urlCode = shortCode.rangenearate(5);
        if (!validUrl.isUri(longUrl.toString())) {
            return { status: false, msg: 'Invalid Original Url', error: 1 };
        }

        try {
            const item = await UrlShorten.findOne({ longUrl: longUrl, validityAt: { $gt: today } }, { _id: false, longUrl: true, shortUrl: true, urlCode: true, validityAt: true });
            if (item) {
                return {
                    longUrl: item.longUrl,
                    shortUrl: item.shortUrl,
                    urlCode: item.urlCode,
                    validityAt: item.validityAt,
                };
            } else {
                shortUrl = shortBaseUrl + '/' + urlCode;
                const item = new UrlShorten({
                    longUrl,
                    shortUrl,
                    validityAt,
                    urlCode,
                });
                await item.save();

                return {
                    longUrl: item.longUrl,
                    shortUrl: item.shortUrl,
                    urlCode: item.urlCode,
                    validityAt: item.validityAt,
                };
            }
        } catch (err) {
            return { status: false, msg: err.message, error: 1 };
        }
    },
    statistic: async function (urlCode) {
        const urlData = await UrlShorten.findOne({ urlCode: urlCode }, { _id: false, __v: false });
        if (urlData) {
            const item = await Statistics.find({ urlCode: urlCode }, { _id: false, __v: false, urlCode: false });
            if (item.length > 0) {
                let markerList = item.map((v) => {
                    return v.latlong;
                });

                let viewList = {};
                item.forEach((element) => {
                    if (viewList[element.device] == undefined) {
                        viewList[element.device] = 0;
                    }

                    viewList[element.device]++;
                });

                return { status: true, urlCode: urlCode, data: item, markerList: JSON.stringify(markerList), viewList: viewList, urlData: urlData, moment: moment, domain: domain };
            } else {
                return { status: false, msg: 'Not Found Statistic Info : ' + urlCode, error: 4 };
            }
        } else {
            return { status: false, msg: 'Invalid Url', error: 4 };
        }
    },
    addView: async function (req) {
        const urlCode = req.params.code;
        const item = await UrlShorten.findOne({ urlCode: urlCode });
        if (item) {
            const itemValidate = moment().isSameOrAfter(moment(item.validityAt));
            if (!itemValidate) {
                let ipInfo = req.ipInfo;
                const statisticData = await Statistics.findOne({ urlCode: urlCode, ip: ipInfo.ip, device: req.device.type });
                if (!statisticData) {
                    try {
                        let statistic = new Statistics({
                            urlCode: urlCode,
                            country: ipInfo.country,
                            city: ipInfo.city,
                            latlong: ipInfo.ll,
                            ip: ipInfo.ip,
                            device: req.device.type,
                        });

                        await statistic.save();
                    } catch (error) {
                        console.log(error.message);
                    }
                }
                return { status: true, longUrl: item.longUrl };
            } else {
                return { msg: 'The URL has expired', error: 0 };
            }
        } else {
            return { msg: 'Invalid Url', error: 4 };
        }
    },
};
