<h2>Screenshot OCR</h2>
This small program will take a screenshot of a webpage and extract text from regions of the screenshot.

Javascript client with node/express backend

Tesseract does the OCR and sharp generates the regions of interests from the screenshot

html2canvas gets the screenshot from the DOM

sharp gets the regions of interest

<h2>Installation</h2>

<ol>

<li>First install Tesseract OCR 
https://tesseract-ocr.github.io/tessdoc/Installation.html

If using windows, make sure to add Tesseract OCR to your path (Step 3 below)
https://ironsoftware.com/csharp/ocr/blog/ocr-tools/tesseract-ocr-windows/
</li>
<li>npm install</li>

<li>node server.js</li>

<li>In a browser open localhost:3000</li>

<li>To get the broader internet, you can do something like

delete this line from index.html
&lt;img class="image" src="/test_image.jpg" /&gt;

add replace with
<iframe src="full url here"></iframe>

To read lines of text change the tesseract psm (page segmentation mode)

--psm 9

to some other setting (9 is to read text inside of a circle for example)

for more details on page segementation modes see
https://pyimagesearch.com/2021/11/15/tesseract-page-segmentation-modes-psms-explained-how-to-improve-your-ocr-accuracy/
</li>
</ol>
