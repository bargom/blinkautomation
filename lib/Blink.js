"use strict";

const BlinkApi = require('node-blink-security');
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const ses = new AWS.SES();

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
            .then(async () => {
                let cameraId = Object.values(blinkApi.cameras).find(c=>c._name===camera)._id;
                let myCamera = blinkApi.cameras[cameraId];
                console.log(`This is my camera: ${JSON.stringify(myCamera)}`);
                let snapResult = await myCamera.snapPicture();
                console.log(snapResult);
                let imageData = await myCamera.fetchImageData();
                console.log(imageData);
                return imageData;
                //return myCamera.thumbnail;
            }, (error) => {
                console.log(error);
            });
    }

    async uploadToS3(buffer) {
        return new Promise((resolve, reject) => {
            let key = "blink/" + Date.now() + ".jpg";
            let data = {
                Bucket: "barisbucket",
                Key: key,
                Body: buffer,
                ContentType: 'image/jpg',
                ACL: 'public-read'
            };
            s3.putObject(data, function(err, data){
                if (err) {
                    console.log(err);
                    console.log('Error uploading data: ', data);
                    return reject(err);
                } else {
                    console.log('succesfully uploaded the image!');
                }
                return resolve("https://barisbucket.s3.eu-central-1.amazonaws.com/" + key);
            });
        })
    };

    async sendEmail(buffer, toEmail, subject, filename) {
        let ses_mail = "From: 'AWS SES Attchament Configuration' <" + process.env.SOURCE_EMAIL + ">\n";
        ses_mail += `To: ${toEmail}\n`;
        ses_mail += `Subject: ${subject}\n`;
        ses_mail += "MIME-Version: 1.0\n";
        ses_mail += "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
        ses_mail += "--NextPart\n";
        ses_mail += "Content-Type: text/html\n\n";
        ses_mail += "Your image is ready as attached.\n\n";
        ses_mail += "--NextPart\n";
        ses_mail += `Content-Type: application/octet-stream; name="${filename}"\n`;
        ses_mail += "Content-Transfer-Encoding: base64\n";
        ses_mail += "Content-Disposition: attachment\n\n";
        ses_mail += buffer.toString("base64").replace(/([^\0]{76})/g, "$1\n") + "\n\n";
        ses_mail += "--NextPart--";

        var params = {
            RawMessage: {Data: ses_mail},
            Source: "'AWS SES Attchament Configuration' <" + process.env.SOURCE_EMAIL + ">'"
        };

        console.log(params);

        return ses.sendRawEmail(params).promise().then(
            data => {
                console.log(data);
                return data;
            }).catch(
            err => {
                console.error(err.message);
                throw err;
            });
    }
}

module.exports = Blink;
