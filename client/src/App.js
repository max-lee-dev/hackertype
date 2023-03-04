import './App.css'
import {useState, useRef, useEffect} from 'react'
import React from 'react'
import Timer from './components/Timer.js'
import javaCode from './components/javaCode.json'
import testJavaCode from './components/testJavaCode.json'
import pyCode from './components/pyCode.json'
import cppCode from './components/cppCode.json'



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










function App() {
  
  const inputElement = useRef(null);
  const [userInput, setUserInput] = useState('')
  const [startCounting, setStartCounting] = useState(false)
  const [correctWordArray, setCorrectWordArray] = useState([])
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [leetcodeTitle, setLeetcodeTitle] = useState('')

  // -- this is really scuffed but its needed for the indents LMFAO
  



  
  
  const [wordBank, setNewWordBank] = useState([])
  const [whiteSpace, setWhiteSpace] = useState([])
  const [language, setLanguage] = useState('javaCode')
  const [newUser, setNewUser] = useState(true)
  // --
  

  
  const [finished, setFinished] = useState(false)
  
  function Restart(codingLanguage) {
    setLanguage(codingLanguage)
    setNewUser(false)
    setUserInput('')
    setActiveWordIndex(0)
    setStartCounting(false)
    setCorrectWordArray([])
    setFinished(false)
    //
    Reset(codingLanguage)
  }
  function randomCode(codingLanguage) {
    let codeLang
    if (codingLanguage === 'cpp') codeLang = cppCode // C++ CRASHING RN PROB CAUSE COMMENTS (theyt end in smth sus)
    else if (codingLanguage === 'java') codeLang = javaCode
    else if (codingLanguage === 'python') codeLang = pyCode
    let randInt = (Math.floor(Math.random() * (codeLang.length)))
    let selectedCode = ''
    let codeTitle = ''
    
    let pulledCode = codeLang[randInt]
    while (pulledCode === null) {
      randInt = (Math.floor(Math.random() * (codeLang.length)))
      pulledCode = codeLang[randInt]
    }
    pulledCode.map((codeInfo) => {
      selectedCode = codeInfo.code
      codeTitle = codeInfo.id
    })
    // 
    setLeetcodeTitle(codeTitle)
    return selectedCode 
  }

  function Reset(codingLanguage) {
    let funcRawCode = randomCode(codingLanguage)
    let funcWordBank = []
    let funcIndentChars = []
    let funcWhiteSpace = []

    // wordbank
    const codeWords = funcRawCode.split(' ')
    const finalCode = []
    codeWords.map(word => {
      if (word !== '') finalCode.push(word)
      return console.log()
    })
    funcWordBank = finalCode
    ///////////////

    // indent chars
    const ans = []
    const characters = funcRawCode.split('')
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
    
    funcIndentChars = ans
    //////////

    // white space

    const whiteSpaceAns = []
    const map = {}
    funcWordBank.map((word, idx) => {
      
      if (idx === 0) return ans[idx] = 0
      if (!funcWordBank[idx-1].includes('\n')) return ans[idx] = 0
      
      // hasIndent
      
      if (map[word] !== undefined) {
        
        let index = funcRawCode.indexOf(`${word}`)
        while (funcIndentChars[index] === undefined) {
          index = funcRawCode.indexOf(`${word}`, index + 1)
        }
        index--;

        let space = 0
        
        while (funcRawCode.charAt(index) === ' ') {
          
          space++
          index--
        }
        map[word] = index + 1
        whiteSpaceAns[idx] = space
        return ''
        

      } else {
        
        let index = funcRawCode.indexOf(`${word}`)
        while (funcIndentChars[index] === undefined) {
          index = funcRawCode.indexOf(`${word}`, index + 1)
        }
        index--;
        let space = 0
        
        while (funcRawCode.charAt(index) === ' ') {
          space++
          index--
        }
        map[word] = index + 1
        
        whiteSpaceAns[idx] = space
        return ''
      }

    })
    funcWhiteSpace = whiteSpaceAns;

    
    setNewWordBank(funcWordBank)
    setWhiteSpace(funcWhiteSpace)
  }

  
  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
      
    }
  }, [startCounting]);

  function Word(props) { // if this doesnt work put it back and try using React.memo
    
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

  


  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputElement.current.type === document.activeElement.type) {
      if (wordBank[activeWordIndex].substring(wordBank[activeWordIndex].length - 1) === "\n") {
        setCorrectWordArray(data => {
          const newResult = [...data] 
          newResult[activeWordIndex] = userInput === wordBank[activeWordIndex].substring(0, wordBank[activeWordIndex].length - countReturns(wordBank[activeWordIndex]))
          return newResult
  
        })
        if (activeWordIndex === wordBank.length - 1) { 
        
          setFinished(true)
          return
        }
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
        <button onClick={() => Restart('cpp')}>C++</button>
        <button onClick={() => Restart('java')}>Java</button>
        <button onClick={() => Restart('python')}>Python</button>
          <div className = 'inputContainer'>
            <div className = 'leetcodeTitle'>
              {finished && <p>{leetcodeTitle}</p>}
            </div>
            <div id = 'timer'>
              
              <Timer
                codeID={leetcodeTitle}
                startCounting={startCounting}
                pause={finished}
                correctWords={correctWordArray.filter(Boolean).length}
                totalWords={wordBank.length}
              />
              

            </div>
            <div className = 'textContainer'>
              <div>
                {!newUser && !finished && <input 
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
                if (language === 'python' || index !== word.length) {
                  for (let i = 0; i < whiteSpace[index]; i++) {
                    
                    s += '    '
                  }
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
         
          {!newUser && <button onClick={() => Restart(language)}>Restart Test</button>}
          {!newUser && <p className = "reminder">Press Tab + Enter to Restart Test</p>}
          
        </div>
      </div>
    </div>
  );
}

export default App;