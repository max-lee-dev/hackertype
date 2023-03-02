const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs');

app.use(cors())

const PORT = 8000

app.get('/', function (req, res) {
        res.json("hello");
});
const why = 1;
console.log("a")
const codeArray = [];
(async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        for (let i = 1; i < 500; i++) {
                console.log(i)
                let number = i + ""
                let numberZeros = 4 - number.length;
                number = ''
                for (let j = 0; j < numberZeros; j++) {
                        number += '0'
                }
                number += i + ''
                console.log(number)
                await page.goto(`https://walkccc.me/LeetCode/problems/${number}/`);
                
                const grabCode = await page.evaluate(() => 
                Array.from(document.querySelectorAll('.md-container'), (e) => ({
                        id: e.querySelector('h1 a').innerText,
                        code: e.querySelector('#__code_3 code').innerText,
                }))
                ).catch(err => console.log(err));
                console.log(grabCode)
                codeArray.push(grabCode);
        }
        fs.writeFile('pyCode.json', JSON.stringify(codeArray), err => {
                if (err) throw err;
                console.log('File saved');
        })
        await browser.close();
})().catch(err => console.log(err));

        

app.listen(PORT, () => console.log(`server running on port ${PORT}`));