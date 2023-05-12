const cors = require('cors'); // npm install cors
const express = require("express"); // npm install express
const fs = require('fs');
const sharp = require('sharp'); // npm install sharp
const { exec } = require("child_process");
const { CANCELLED } = require('dns'); // do we need this?
const OBSWebSocket = require('obs-websocket-js').default;

const app = express();
const DBG = 1;
var call1 = "";
var call2 = "";
var call3 = "";
var call4 = "";
var call5 = "";
var win1 = "";
var win2 = "";

app.use(express.static(__dirname));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "200mb"}));

app.listen(3000, ()=> {
    console.log("listening on port 3000");
    console.log( __dirname );
    const obs = new OBSWebSocket();

    obs.connect('ws://192.168.1.19:4455', 'PassW0rd!')
    .then((data)=> {
        if( DBG ) console.log("obs is connected");
        if( DBG ) console.log(data);
        
    }).catch(err => {
        if( DBG ) console.error('failed to connect to obs', err);
    });
    
    
    obs.on('Identified', (data) => {
        if( DBG ) console.log("Cliff here in Identified");
        if( DBG ) console.log(data);
        /*
        obs.call('GetVersion').then((data) => {
            console.log("Cliff here in getVersion");
            console.log(data);
        });
        
        obs.call('GetSceneList').then((data) => {
            console.log("Cliff here in get scene list");
            console.log(data);
        });
        */
        getScreenShot();
    });
    const getScreenShot = function() {
        obs.call( 'GetSourceScreenshot', {
            'sourceName': 'Display Capture'
            , 'imageFormat': 'jpg'
        } ).then((data) => {
            if( DBG ) console.log("Cliff here with getsourcescreenshot=");
            if( DBG ) console.log(data.imageData.substring(0,100));
            // processScreenShot( data.imageData );
        });
    }
    const processScreenShot = function( imageData ) {
        var str = imageData;
        var base64Data = str.split(';base64,').pop();
        if( DBG ) console.log(base64Data.substring(0,100));
        const imageBuffer = Buffer.from(base64Data, "base64");

        fs.writeFileSync("outputImage.png", imageBuffer, 'base64', function(err) {
            if( DBG ) console.log("Cliff here with error=");
            if( DBG ) console.log(err);
        }); 
/*          left: 1200, 
            top: 242,
            width: 100,
            height: 62
*/
        
        // open screenshot image and create a region of interest
        sharp( "outputImage.png" ).extract({
            left: 782, 
            top: 125,
            width:30,
            height: 27
        })
        .resize({
            width:300,
            height: 280
        })
        .greyscale()
        .negate()
        .threshold(128)
        .toFile("interestRegion_1.jpg");
        
        sharp( "outputImage.png" ).extract({
            left: 898, 
            top: 125,
            width:30,
            height: 27
        })
        .resize({
            width:300,
            height: 280
        })
        .greyscale()
        .negate()
        .threshold(128)
        .toFile("interestRegion_2.jpg");

        sharp( "outputImage.png" ).extract({
            left: 1013, 
            top: 125,
            width:30,
            height: 27
        })
        .resize({
            width:300,
            height: 280
        })
        .greyscale()
        .negate()
        .threshold(128)
        .toFile("interestRegion_3.jpg");

        sharp( "outputImage.png" ).extract({
            left: 1127, 
            top: 125,
            width:30,
            height: 27
        })
        .resize({
            width:300,
            height: 280
        })
        .greyscale()
        .negate()
        .threshold(128)
        .toFile("interestRegion_4.jpg");
        
        
        // psm 9 is for a circle, I think we want psm 8 for all of these
        setTimeout(function() { 
            tesseractIR("call1.txt",  "interestRegion_1.jpg");
            setTimeout(function() { 
                tesseractIR("call2.txt",  "interestRegion_2.jpg");
                setTimeout(function() { 
                    tesseractIR("call3.txt",  "interestRegion_3.jpg");
                    setTimeout(function() { 
                        tesseractIR("call4.txt",  "interestRegion_4.jpg");
                        setTimeout(function() { 
                            readResults( "call1.txt");
                            readResults( "call2.txt");
                            readResults( "call3.txt");
                            readResults( "call4.txt");
                        }, 1500);
                    }, 75);
                }, 75);
            }, 75);
        }, 75);
    }
    const readResults = function( textFile ){
        fs.readFile( __dirname + '/' + textFile, 'utf8', (err, data) => {
            if( err ) {
                if( DBG ) console.error("Error reading File");
                if( DBG ) console.error( err )
            } else {
                console.log(data)
                var results = data;
                results = results.replace("\n", "");
                if( DBG ) console.log ("results = " + results);
            }
        })
    }
    const tesseractIR = function( textFile, interestImage) {
        fs.stat(__dirname + "/" + textFile, function (err, stats) {
            if(err)
                console.error(err)
            else {
                fs.unlinkSync(__dirname + "/" + textFile);
            }
        });
        exec("tesseract " + interestImage + " " + textFile.replace('.txt', '') + " --oem 1 --psm 8 -c tessedit_char_whitelist=0123456789", (error, stdout, stderr) => {
            if(error){
                if( DBG ) console.log(`error: ${error.message}`);
            }
            else if (stderr){
                if( DBG ) console.log(`stderr: ${stderr}`);
            } else {
                
            }
        });
    }
});
