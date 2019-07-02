'use strict';

console.log('Loading lambda function...');

const Blink = require('./lib/Blink');

exports.takePhoto = async (event, context, callback) => {
    try {
        const blink = new Blink();
        let body = await blink.takePhoto(event.token, event.network, event.camera);
        return callback(null, body);
    } catch (err) {
        return callback(err);
    }
};