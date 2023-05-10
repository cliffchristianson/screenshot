const cors = require('cors');
const express = require("express");
const fs = require('fs');
const sharp = require('sharp');
const { exec } = require("child_process");
const { CANCELLED } = require('dns');
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
    console.log( __dirname );
});