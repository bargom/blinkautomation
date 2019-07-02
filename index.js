"use strict";

const BlinkApi = require('node-blink-security');

class Blink {
    constructor() {

    }

    async takePhoto(token, network, camera) {
        const blinkApi = new BlinkApi("none", "none", {
            _token: token,
            _network_id: network,
            _region_id: "prde" //prde for eu, prod for other
        });
        return blinkApi.setupSystem(network)
            .then(() => {
                //console.dir(blinkApi);
                let cameras = blinkApi.cameras;
                console.log(`These are the cameras: ${JSON.stringify(cameras)}`);
                let myCamera = cameras[Object.values(cameras).find(c=>c._name===camera)._id];
                let snapResult = myCamera.snapPicture();
                console.log(snapResult);
                //return myCamera.fetchImageData();
                return myCamera.thumbnail;
            }, (error) => {
                console.log(error);
            });
    }
}

module.exports = Blink;
