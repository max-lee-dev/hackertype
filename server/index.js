const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors())

const PORT = 8000

app.get('/', function (req, res) {
        res.json("hello");
});

app.get(`/results`, function (req, res) {
        const codeArray = [];
        (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                for (let i = 1; i < 3; i++) {
                        await page.goto(`https://walkccc.me/LeetCode/problems/000${i}/`);
                        const grabCode = await page.evaluate(() => 
                                Array.from(document.querySelectorAll('.code #__code_2'), (e) => ({
                                        code: e.querySelector('code').innerText,
                                }))
                        );
                        codeArray.push(grabCode)
                }
                res.json(codeArray)
                await browser.close();
        })().catch(err => console.log(err));
});
        

app.listen(PORT, () => console.log(`server running on port ${PORT}`));