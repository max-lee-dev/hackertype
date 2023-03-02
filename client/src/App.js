import './App.css'
import {useState, useRef, useEffect} from 'react'
import React from 'react'
import Timer from './components/Timer.js'
import javaCode from './components/javaCode.json'
import testJavaCode from './components/testJavaCode.json'
import pyCode from './components/pyCode.json'



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
  const [choseWord, setChoseWord] = useState(false)

  // -- this is really scuffed but its needed for the indents LMFAO
  function randomCode() {
    console.log(choseWord)
    
    setChoseWord(true)
    let randInt = (Math.floor(Math.random() * (3)))
    
    // ["a","b","c","d","e","f"]
    const arr = ["a","b","c","d","e","f"]
    console.log(randInt)
    let selectedCode = arr[randInt]
    console.log(selectedCode)
    return selectedCode 
  }
  const [rawCode, setRawCode] = useState('das') // useState(randomCode) makes it call on every key press



  
  
  const [wordBank, setNewWordBank] = useState(getWordBank(rawCode))
  const [indentChars, setIndentChars] = useState(calculateIndentChars())
  const [whiteSpace, setWhiteSpace] = useState(calculateWhitespace())
  // --
  

  
  const [finished, setFinished] = useState(false)

  function Restart() {
    
    setUserInput('')
    setActiveWordIndex(0)
    setStartCounting(false)
    setCorrectWordArray([])
    setFinished(false)
    setChoseWord(false)
    console.log("post: " + rawCode)
    setNewWordBank(getWordBank(rawCode))
    setWhiteSpace(calculateWhitespace())
    setIndentChars(calculateIndentChars())
  }
  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
      
    }
  }, [startCounting]);

  function Word(props) { // if this doesnt work put it back and try using React.memo
    console.log("pre: " + rawCode)
    setRawCode(randomCode())
    const { text, active, correct} = props
    const hasReturn = text.includes('\n')
    
    if (correct === true) {
            if (active) {
                    if (hasReturn) return <span className = 'currentCorrect displayText'>{text} <br/></span>
                    return <span className="currentCorrect displayText">{text} </span>
            } else {
                    if (hasReturn) return <span className="correct displayText">{text} <br/></span>
                    return <span className="correct displayText">{text} </span>
            }
    }
    if (correct === false) {
            if (active) {
                    if (hasReturn) return <span className="currentIncorrect displayText">{text} <br/></span>
                    return <span className ="currentIncorrect displayText">{text} </span>
            } else {
                    if (hasReturn) return <span className="incorrect displayText">{text} <br/></span>
                    return <span className ="incorrect displayText">{text} </span>
            }
            
    }

    if (active) {
            if (hasReturn) return <span className = "displayText" style = {{ fontWeight: active ? 'bold' : 'lighter'}}>{text} <br/></span>
            return <span className = "displayText" style = {{ fontWeight: active ? 'bold' : 'lighter'}}>{text} </span>
    }
    if (hasReturn)return <span className = "displayText">{text}<br/></span>
    return <span className = "displayText">{text} </span>
  }
  // eslint-disable-next-line
  Word = React.memo(Word)

  function calculateIndentChars() {
    const ans = []
    const characters = rawCode.split('')
    let indent = false;
    characters.map((char, i) => {
      if (char === '\n') {
        indent = true;
      } else if (indent && (char !== ' ' && char !== '\n')) {
        indent = false;
        ans[i] = 1;
      }
      return ''
    })
    
    return ans
  }

  function calculateWhitespace() {
    // for each word, first identify if it hasIndent
    
    const ans = []
    const map = {}
    wordBank.map((word, idx) => {
      
      if (idx === 0) return ans[idx] = 0
      if (!wordBank[idx-1].includes('\n')) return ans[idx] = 0
      
      // hasIndent
      
      if (map[word] !== undefined) {
        
        let index = rawCode.indexOf(`${word}`)
        while (indentChars[index] === undefined) {
          index = rawCode.indexOf(`${word}`, index + 1)
        }
        index--;

        let space = 0
        
        while (rawCode.charAt(index) === ' ') {
          
          space++
          index--
        }
        map[word] = index + 1
        ans[idx] = space
        return ''
        

      } else {
        
        let index = rawCode.indexOf(`${word}`)
        
        while (indentChars[index] === undefined) {
          index = rawCode.indexOf(`${word}`, index + 1)
        }
        index--;
        let space = 0
        
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
        setCorrectWordArray(data => {
          const newResult = [...data] 
          newResult[activeWordIndex] = userInput === wordBank[activeWordIndex].substring(0, wordBank[activeWordIndex].length - countReturns(wordBank[activeWordIndex]))
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
    if (value.endsWith(' ')) {
      
      setActiveWordIndex(index => index + 1)
      setUserInput('')
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
          
          <div className = 'inputContainer'>
            <div id = 'timer'>
              <Timer
                startCounting={startCounting}
                pause={finished}
                correctWords={correctWordArray.filter(Boolean).length}
                totalWords={wordBank.length}
              />
              

            </div>
            <div className = 'textContainer'>
              <div>
                {!finished && <input 
                  className = 'textInput'
                  type="text" 
                  value={userInput} 
                  onChange ={(e) => processInput(e)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  ref = {inputElement}
                />}
              </div>
            </div>
            <div className = 'text'>

              <p>{!finished && wordBank.map((word, index) => {
                let s = ''
                for (let i = 0; i < whiteSpace[index]; i++) {
                  s += '    '
                }
                return <span key={index} className = 'displayText'>{s}<Word 
                  
                  text = {word}
                  active={index === activeWordIndex}
                  correct={correctWordArray[index]}
                  
                />
                </span>
              })}</p>
              
            </div>
          </div>
        </div>
        <div id = "userInput"> 
         
          <button onClick={() => Restart()}>Restart Test</button>
          <p className = "reminder">Press Tab + Enter to Restart Test</p>
        </div>
      </div>
    </div>
  );
}

export default App;