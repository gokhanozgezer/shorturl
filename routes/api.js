const router = require('express').Router();
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config');
const shortUrl = require('../middlewares/shortUrl');
const domain = config.get('shortDomain');
const ApiKey = config.get('apiKey');

router.all('*', async (req, res, next) => {
    let authorization = req.headers.authorization || null;
    if (authorization && authorization == ApiKey) {
        next();
    } else {
        return res.status(401).json({ status: false, msg: 'The requested page needs Authorization' });
    }
});

router.post('/', async (req, res) => {
    const { validityTime, longUrl } = req.body;
    let response = await shortUrl.create(longUrl, validityTime);

    if (response.error != undefined) {
        return res.status(401).json(response);
    } else {
        response['moment'] = moment;
        response['domain'] = domain;
        response['ipInfo'] = req.ipInfo;
        response['device'] = req.device.type;

        return res.status(200).json(response);
    }
});

router.get('/:code', async (req, res) => {
    const urlCode = req.params.code;
    let response = await shortUrl.statistic(urlCode);
    let statusCode = response.status ? 200 : 404;

    res.status(statusCode).json(response);
});

router.use(function (req, res, next) {
    return res.status(200).render('index');
    next();
});
module.exports = router;
