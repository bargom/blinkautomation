"use strict";

const BlinkApi = require('node-blink-security');

class Blink {
    constructor() {

    }

    async takePhoto(token, network, camera) {
        const blinkApi = new BlinkApi({
            _username: "none",
            _password: "none",
            _token: token,
            _network_id: network,
            _region_id: "prde" //prde for eu, prod for other
        });
        return blinkApi.setupSystem()
            .then(() => {
                let cameras = blinkApi.getCameras();
                console.log(`These are the cameras: ${JSON.stringify(cameras)}`);
                return cameras[camera].snapPicture();
            }, (error) => {
                console.log(error);
            });
    }
}

module.exports = Blink;
