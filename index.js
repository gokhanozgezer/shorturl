const express = require('express');
const expressip = require('express-ip');
const device = require('express-device');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
var ejs = require('ejs');
const CronJob = require('cron').CronJob;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');
const moment = require('moment');
const _ = require('lodash');
const PORT = config.get('port');
const SECUREPORT = config.get('securePort');

//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.set('debug', false);
mongoose.connect(config.get('mongoURI'), {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

/** Create API Key */
// This code create "Api key" when you start it for the first time then you can get in the comment line.
fs.readFile('./config/default.json', 'utf8', function (err, data) {
    let obj = JSON.parse(data);
    if (!obj.apiKey) {
        const randomstring = require('randomstring');
        obj.apiKey = randomstring.generate(32);
        let json = JSON.stringify(obj, null, 2);
        fs.writeFile('./config/default.json', json, 'utf8', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Api Key : ' + obj.apiKey);
            }
        });
    }
});

require('./models/UrlShorten');
require('./models/Statistics');

const UrlShorten = mongoose.model('UrlShorten');
const Statistics = mongoose.model('Statistics');

const app = express();

app.use(expressip().getIpInfoMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(device.capture('botUserAgentDeviceType'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,x-access-token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/api/', require('./routes/api'));
app.use('/', require('./routes/urlshorten'));

// Use this cron field if you want to delete (URL and Statistic record) it within a certain time frame.
new CronJob(
    '00 00 00 * * *',
    async function () {
        const today = moment().subtract(config.get('cronDay'), 'days').toDate();
        let urlList = await UrlShorten.find({ validityAt: { $lt: today } }, { _id: false, urlCode: true });
        if (urlList.length > 0) {
            let codeList = _.map(urlList, (item) => {
                return item.urlCode;
            });

            await UrlShorten.deleteMany({ urlCode: { $in: codeList } }, () => {});
            await Statistics.deleteMany({ urlCode: { $in: codeList } }, () => {});
        }
    },
    null,
    true
);

// IF you want use HTTPS
/*const privateKey = fs.readFileSync('Certificate "PrivateKey PEM File" Location ', 'utf8');
const ca = fs.readFileSync('Certificate "Full Chain" File Location ', 'utf8');
const credentials = {
  key: privateKey,
  ca: ca
};
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(SECUREPORT, () => {
  console.log('HTTPS Server running on port ' + SECUREPORT);
});*/

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log('HTTP Server running on port ' + PORT);
});
