const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs');

app.use(cors())

const PORT = 8000


const why = 1;
console.log("a")
// read javascriptCode.json
let codeArray = fs.readFileSync('javascriptCode.json');
codeArray = JSON.parse(codeArray);
console.log(codeArray.length);

for (let i = 1; i < 712; i) {
  for (let j = 0; j < codeArray.length; j++) {
    const id = codeArray[j][0].id.split(".")[0];
    const idNum = parseInt(id);
    const currentNum = parseInt(i++);
    // console.log("adding null at " + id);


    if (idNum === currentNum) {
      continue;
    }

    if (idNum > currentNum) {
      // we need to add a null to this spot
      console.log("adding null at " + j);
      codeArray.splice(j, 0, null);
      continue;
    }

  }
}

fs.writeFile('javascriptCode.json', JSON.stringify(codeArray), err => {
  if (err) throw err;
  console.log('File saved');
});

// (async () => {
//   const browser =
//     await puppeteer.launch({
//       headless: false,
//       defaultViewport: null,
//       args: ['--start-maximized']
//     });
//
//
//   const page = await browser.newPage();
//   for (let i = 2; i < 10; i++) {
//
//     await page.goto(`https://baffinlee.com/leetcode-javascript/page/${i}.html`);
//
//     const aTags = await page.evaluate(() => {
//         const aTags = Array.from(document.querySelectorAll('td a'));
//         return aTags.map(a => a.href);
//       }
//     );
//
//     for (let j = 0; j < aTags.length; j++) {
//       await page.goto(aTags[j]);
//       console.log(aTags[j])
//
//       const id = await page.evaluate(() => {
//         return document.querySelector('h1').innerText;
//
//       });
//       console.log(id)
//       const code = await page.evaluate(() => {
//         const code = Array.from(document.querySelectorAll('.lang-javascript'));
//         console.log(code)
//         let comments = [];
//
//         for (let i = 0; i < code.length; i++) {
//           // exclude spans that have a class of "hljs-comment"
//           comments = Array.from(code[i].querySelectorAll('span.hljs-comment'));
//
//         }
//         comments.forEach(c => c.remove());
//         console.log(code.map(c => c.innerText));
//
//         return code.map(c => c.innerText);
//       });
//
//       if (code !== undefined && code.length > 0) {
//         let realcode = code[0];
//         // for loop to keep going until we hit var
//         for (let i = 0; i < realcode.split("").length; i++) {
//           if (realcode.split("")[i] === "v" && realcode.split("")[i + 1] === "a" && realcode.split("")[i + 2] === "r") {
//             realcode = realcode.split("").splice(i).join("");
//             break;
//           }
//         }
//
//
//         const dumbassarray = [
//           {
//             id: id,
//             code: realcode
//           }
//         ]
//
//         codeArray.push(dumbassarray);
//       } else {
//         console.log('no code found');
//
//       }
//     }
//     console.log(codeArray);
//
//
//   }
//   fs.writeFile('javascriptCode.json', JSON.stringify(codeArray), err => {
//     if (err) throw err;
//     console.log('File saved');
//   })
//   await browser.close();
// })().catch(err => console.log(err));


// app.listen(PORT, () => console.log(`server running on port ${PORT}`));