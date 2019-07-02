'use strict';

console.log('Loading lambda function...');

const Blink = require('./lib/Blink');

exports.takePhoto = async (event, context, callback) => {
    try {
        console.log(`takePhoto event: ${JSON.stringify(event)}`);
        const blink = new Blink();
        let buffer = await blink.takePhoto(event.token, event.network, event.camera);
        //let result = await blink.uploadToS3(buffer);
        //console.log(result);
        let emailResult = await blink.sendEmail(buffer, event.email, `Image from Blink for ${event.network}/${event.camera}`, `${event.camera}.jpg`);
        console.log(emailResult);
        return callback(null, emailResult);
    } catch (err) {
        return callback(err);
    }
};