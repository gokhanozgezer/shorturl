const shortid = require('shortid');
const randomstring = require('randomstring');
module.exports = {
    generate: function () {
        return shortid.generate();
    },
    rangenearate: function (length) {
        return randomstring.generate(length);
    },
};
