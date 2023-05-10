<h2>Screenshot OCR</h2>
This small program automates taking a screenshot of a webpage and extracting text from regions of the screenshot.

Useful for parsing text from camera streams, tracking website errors, and other nifty uses.

Javascript client with node/express backend

Tesseract does the OCR and sharp generates the regions of interests from the screenshot

html2canvas gets the screenshot from the DOM

<h2>Installation</h2>

<ol>

<li>First install Tesseract OCR 
https://tesseract-ocr.github.io/tessdoc/Installation.html

If using windows, make sure to add Tesseract OCR to your path (Step 3 below)
https://ironsoftware.com/csharp/ocr/blog/ocr-tools/tesseract-ocr-windows/
</li>
<li>Clone this repo and run 
npm install
</li>

<li>Next run
node server.js
</li>

<li>In a browser open localhost:3000</li>

<li>To get the broader internet, you can do something like

delete this line from index.html
&lt;img class="image" src="/test_image.jpg" /&gt;

add replace with
<iframe src="full url here"></iframe>
</li>
<li>To read lines of text change the tesseract psm (page segmentation mode)

--psm 9

to some other setting (9 is to read text inside of a circle for example)

for more details on page segementation modes see
https://pyimagesearch.com/2021/11/15/tesseract-page-segmentation-modes-psms-explained-how-to-improve-your-ocr-accuracy/
</li>
<li>To change the regions of interest, in server.js change
    
    
    sharp( "outputImage.png" ).extract({
        left: 630, 
        top: 200,
        width:350,
        height: 350
    }).toFile("interestRegion.jpg");
    
    
to your desired location and size
</li>
<li>To extract the text from the sample image, you must run on windows using C:\javascript\screenshot as your directory.  It must run on a 1920x1080 screen at 100% zoom.  Of course you can install anywhere and use any sample image or website or whatever you would like</li>
</ol>