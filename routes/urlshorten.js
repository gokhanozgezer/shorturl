const router = require('express').Router();
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config');
const shortUrl = require('../middlewares/shortUrl');
const domain = config.get('shortDomain');

router.get('/:code', async (req, res) => {
    let response = await shortUrl.addView(req);

    if (response.error != undefined) {
        let statusCode = 400 + response.error;
        return res.status(statusCode).render('error', response);
    } else if (response.longUrl != undefined) {
        res.redirect(response.longUrl);
    }
});

router.get('/statistic/:code', async (req, res) => {
    const urlCode = req.params.code;
    let response = await shortUrl.statistic(urlCode);
    let statusCode = response.status ? 200 : 404;
    let renderPage = response.status ? 'statistic' : 'error';

    res.status(statusCode).render(renderPage, response);
});

router.post('/', async (req, res, next) => {
    const { longUrl } = req.body;
    let response = await shortUrl.create(longUrl);

    if (response.error != undefined) {
        return res.status(401).render('error', response);
    } else {
        response['moment'] = moment;
        response['domain'] = domain;
        response['ipInfo'] = req.ipInfo;
        response['device'] = req.device.type;

        return res.status(200).render('index', response);
    }
});

router.use(function (req, res, next) {
    return res.status(200).render('index');
    next();
});
module.exports = router;
