const cors = require('cors');
const express = require("express");
const fs = require('fs');
const sharp = require('sharp');
const { exec } = require("child_process");
const { CANCELLED } = require('dns');
const OBSWebSocket = require('obs-websocket-js').default;

const app = express();
const DBG = 1;
var game = "";
var call = "";

app.use(express.static(__dirname));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "200mb"}));
app.get("/", (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.post('/', (request, response) => {
    //console.log(request.body.img);
    var str = request.body.img;
    var base64Data = str.split(';base64,').pop();
    if( DBG ) console.log(base64Data.substring(0,100));
    const imageBuffer = Buffer.from(base64Data, "base64");
    
    fs.writeFileSync("outputImage.png", imageBuffer, 'base64', function(err) {
        if( DBG ) console.log("Cliff here with error=");
        if( DBG ) console.log(err);
    }); 
    
    sharp( "outputImage.png" ).extract({
        left: 630, 
        top: 200,
        width:350,
        height: 350
    }).toFile("interestRegion.jpg");
    
    sharp( "outputImage.png" ).extract({
        left: 880, 
        top: 550,
        width:60,
        height: 75
    }).toFile("interestRegion2.jpg");


    exec("tesseract interestRegion.jpg call --psm 9", (error, stdout, stderr) => {
        if(error){
            if( DBG ) console.log(`error: ${error.message}`);
        }
        if (stderr){
            if( DBG ) console.log(`stderr: ${stderr}`);
        }
    });
    
    exec("tesseract interestRegion2.jpg game --psm 8", (error, stdout, stderr) => {
        if(error){
            if( DBG ) console.log(`error: ${error.message}`);
        }
        if (stderr){
            if( DBG ) console.log(`stderr: ${stderr}`);
        }
    });

    fs.readFile( __dirname + '/game.txt', 'utf8', (err, data) => {
        if( err ) {
            if( DBG ) console.error("Error reading File");
            if( DBG ) console.error( err )
        }
        game = data;
        game = game.replace("\n", "");
        
        if( DBG ) console.log ("game = " + game);
    })
    fs.readFile( __dirname + '/call.txt', 'utf8', (err, data) => {
        if( err ) {
            if( DBG ) console.error("Error reading File");
            if( DBG ) console.error( err )
        }
        call = data;
        call = call.replace("\n", "");
        if( DBG ) console.log ("call = " + call);
    })
    var param = {
        "game": game
        , "call": call
    }
    response.json( param );
})

app.listen(3000, ()=> {
    console.log("listening on port 3000");
    if( DBG ) console.log( __dirname );
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
            processScreenShot( data.imageData );
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
        
        sharp( "outputImage.png" ).extract({
            left: 630, 
            top: 200,
            width:350,
            height: 350
        }).toFile("interestRegion.jpg");
        
        sharp( "outputImage.png" ).extract({
            left: 880, 
            top: 550,
            width:60,
            height: 75
        }).toFile("interestRegion2.jpg");


        exec("tesseract interestRegion.jpg call --psm 9", (error, stdout, stderr) => {
            if(error){
                if( DBG ) console.log(`error: ${error.message}`);
            }
            if (stderr){
                if( DBG ) console.log(`stderr: ${stderr}`);
            }
        });
        
        exec("tesseract interestRegion2.jpg game --psm 8", (error, stdout, stderr) => {
            if(error){
                if( DBG ) console.log(`error: ${error.message}`);
            }
            if (stderr){
                if( DBG ) console.log(`stderr: ${stderr}`);
            }
        });

        fs.readFile( __dirname + '/game.txt', 'utf8', (err, data) => {
            if( err ) {
                if( DBG ) console.error("Error reading File");
                if( DBG ) console.error( err )
            }
            game = data;
            game = game.replace("\n", "");
            
            if( DBG ) console.log ("game = " + game);
        })
        fs.readFile( __dirname + '/call.txt', 'utf8', (err, data) => {
            if( err ) {
                if( DBG ) console.error("Error reading File");
                if( DBG ) console.error( err )
            }
            call = data;
            call = call.replace("\n", "");
            if( DBG ) console.log ("call = " + call);
        })
        var param = {
            "game": game
            , "call": call
        }
        //response.json( param );
    }
});
