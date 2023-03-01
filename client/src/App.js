import './App.css'
import {useState, useRef, useEffect} from 'react'
import React from 'react'
import Timer from './components/Timer.js'
import javaCode from './components/javaCode.json'
import Word from './components/Word.js'



// figure out how to get new text every reload

// remove comments, when i find a // remopve that ENTIRE line not just thaT word

function countReturns(text) {
  let count = 0,
    i = 0;
  while (true) {
    const r = text.indexOf('\n', i);
    if (r !== -1) [count, i] = [count + 1, r + 1];
    else return count;
  }
}
function randomCode() {
  const randInt = (Math.floor(Math.random() * (javaCode.length)) + 1)
  let selectedCode
  javaCode[randInt].map(code => {
    selectedCode = code.code
    
    return ''
  })
  return selectedCode 
}





function getWordBank (pickedCode)  {
  const codeWords = pickedCode.split(' ')
  const finalCode = []
  codeWords.map(word => {
    if (word !== '') finalCode.push(word)
    return console.log()
  })
  return finalCode
}



function App() {
  
  const inputElement = useRef(null);
  const [userInput, setUserInput] = useState('')
  const [startCounting, setStartCounting] = useState(false)
  const [correctWordArray, setCorrectWordArray] = useState([])
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [curIdx, setCurIdx] = useState(0)

  // -- this is really scuffed but its needed for the indents LMFAO
  const [rawCode, setRawCode] = useState(randomCode())
  const [wordBank, setNewWordBank] = useState(getWordBank(rawCode))
  const [whiteSpace, setWhiteSpace] = useState(calculateWhitespace())
  // --
  

  
  const [finished, setFinished] = useState(false)

  function Restart() {
    setUserInput('')
    setActiveWordIndex(0)
    setStartCounting(false)
    setCorrectWordArray([])
    setCurIdx(0)
    setFinished(false)
    setRawCode(randomCode())
    setNewWordBank(getWordBank(rawCode))
    setWhiteSpace(calculateWhitespace())
  }
  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
      
    }
  }, [startCounting]);

  function calculateWhitespace() {
    // for each word, first identify if it hasIndent
    
    const ans = []
    const map = {}
    wordBank.map((word, idx) => {
      
      if (idx === 0) return ans[idx] = 0
      if (!wordBank[idx-1].includes('\n')) return ans[idx] = 0
      
      // hasIndent
      
      if (map[word] !== undefined) {
        
        let index = rawCode.indexOf(`  ${word} `) - 1
        let space = 0
        
        while (rawCode.charAt(index) === ' ') {
          
          space++
          index--
        }
        if (word === 'carry') console.log(rawCode.substring(index -5, index + 10))
        map[word] = index + 1
        ans[idx] = space
        return ''
        

      } else {
        
        let index = rawCode.indexOf(`  ${word} `, map[word]) - 1
        let space = 0
        if (idx === 41) console.log(word)
        
        while (rawCode.charAt(index) === ' ') {
          space++
          index--
        }
        map[word] = index + 1
        
        ans[idx] = space
        return ''
      }

    })
    return ans;
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputElement.current.type === document.activeElement.type) {
      if (wordBank[activeWordIndex].substring(wordBank[activeWordIndex].length - 1) === "\n") {
        console.log("is it ")
        setCorrectWordArray(data => {
          const newResult = [...data] 
          newResult[activeWordIndex] = userInput === wordBank[activeWordIndex].substring(0, wordBank[activeWordIndex].length - countReturns(wordBank[activeWordIndex]))
          console.log("corr: " + wordBank[activeWordIndex])
          return newResult
  
        })
        
        setUserInput('')
        setActiveWordIndex(input => input + 1)
      }
    }
  }
  
  function processInput(e) {
    setStartCounting(true)
    
    const value = e.target.value;
    setStartCounting(true)
    if (value.endsWith(' ')) {
      
      setActiveWordIndex(index => index + 1)
      setUserInput('')
      setCurIdx(val => val + value.length)
      setCorrectWordArray(data => {
        const word = value.trim()
        const newResult = [...data] 
        newResult[activeWordIndex] = word === wordBank[activeWordIndex]
        return newResult

      })
      if (activeWordIndex === wordBank.length - 1) { 
        setFinished(true)
        return
      }
    } else {
      setUserInput(value)
      
  
      // live feedback
      setCorrectWordArray(data => {
        const newResult = [...data]   
        newResult[activeWordIndex] = value === wordBank[activeWordIndex].substring(0, value.length)
        return newResult

      })
    }
    
  }

  

  return (
    <div className = 'body'>
      <div className = 'container'>
        <div className = 'title'><h1> some name </h1></div>
        <div className = 'content'>
          
          <div id = 'timer'>
            <Timer
              startCounting={startCounting}
              pause={finished}
              correctWords={correctWordArray.filter(Boolean).length}
              totalWords={wordBank.length}
            />
            

          </div>
          <div className = 'text'>

            <p>{!finished && wordBank.map((word, index) => {
              let s = ''
              for (let i = 0; i < whiteSpace[index]; i++) {
                s += '   '
              }
              return <span className = 'displayText'>{s}<Word 
                key ={index}
                text = {word}
                active={index === activeWordIndex}
                wordBank={wordBank}
                rawCode={rawCode}
                myIndex={index}
                curIdx={curIdx}
                correct={correctWordArray[index]}
                
              />
              </span>
            })}</p>
            
          </div>
          
        </div>
        <div id = "userInput"> 
          {!finished && <input 
              type="text" 
              value={userInput} 
              onChange ={(e) => processInput(e)}
              onKeyDown={handleKeyDown}
              autoFocus
              ref = {inputElement}
            />}
          <button onClick={() => Restart()}>Restart Test</button>
          <p className = "reminder">Press Tab + Enter to Restart Test</p>
        </div>
      </div>
    </div>
  );
}

export default App;