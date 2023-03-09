import './App.css'
import {useState, useRef, useEffect} from 'react'
import React from 'react'
import Timer from './components/Timer.js'
import javaCode from './components/javaCode.json'
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
  const [renderIndex, setRenderIndex] = useState(-1)
  const [solutionRange, setSolutionRage] = useState('ALL')
  const [wordLimit, setWordLimit] = useState(50000)
  const [wordBank, setNewWordBank] = useState([])
  const [whiteSpace, setWhiteSpace] = useState([])
  const [language, setLanguage] = useState('')
  const [newUser, setNewUser] = useState(true)
  const [lastCode, setLastCode] = useState([])
  const [wordsLeft, setWordsLeft] = useState(0)
  const [error, setError] = useState('')
  const [controlPress, setControllPress] = useState(false)
  const [shiftPress, setShiftPress] = useState(false)
  const [solutionWordCount, setSolutioNwordCount] = useState(0)
  
  

  
  const [finished, setFinished] = useState(false)
  
  function Restart(codingLanguage, maxWords, retrySame) {
    console.log("NEW VAL: " + maxWords)
    let s = ''
    if (retrySame === undefined) {
      s = Reset(codingLanguage, maxWords)
      if (s !== undefined) {
        setError(s)
        return
      } else setError('')
    }
    
    
    //
    if (!newUser && retrySame !== undefined) setWordsLeft(solutionWordCount)
    setLanguage(codingLanguage)
    setRenderIndex(-1)
    setNewUser(false)
    setUserInput('')
    setActiveWordIndex(0)
    setStartCounting(false)
    setCorrectWordArray([])
    setFinished(false)
    
    
    
  }
  function randomCode(codingLanguage, solutionSize) {
    let codeLang = javaCode
    
    if (codingLanguage === 'C++') codeLang = cppCode // C++ CRASHING RN PROB CAUSE COMMENTS (theyt end in smth sus)
    else if (codingLanguage === 'Java') codeLang = javaCode // same with java
    else if (codingLanguage === 'Python') codeLang = pyCode
   
    var selectedCode = ''
    var codeTitle = ''
    
    
    
    while (true) {
      var randInt = (Math.floor(Math.random() * (codeLang.length)))
      var pulledCode = codeLang[randInt] // contains /**  in java
      pulledCode = codeLang[randInt]
      while (pulledCode === null || (solutionSize !== 1 && pulledCode === lastCode)) {
        
        randInt = (Math.floor(Math.random() * (codeLang.length)))
        pulledCode = codeLang[randInt]
        

      }
     
      // eslint-disable-next-line
      pulledCode.map((codeInfo) => {
        selectedCode = codeInfo.code
        codeTitle = codeInfo.id
        return 0
      })
      
      let numWords = selectedCode.split(' ').length
      const selectedCodeArr = selectedCode.split(' ')
      selectedCodeArr.map((word) => {
        if (word === '') numWords--;
        return ''
      })
    
      if (numWords <= wordLimit) break
    }
    // 
    setLeetcodeTitle(codeTitle)
    setLastCode(pulledCode)
    return selectedCode 
  }

  function Reset(codingLanguage, maxWords) {
   

    // solution range
    let codeLang = javaCode
    if (codingLanguage === 'C++') codeLang = cppCode // C++ CRASHING RN PROB CAUSE COMMENTS (theyt end in smth sus)
    else if (codingLanguage === 'Java') codeLang = javaCode // same with java
    else if (codingLanguage === 'Python') codeLang = pyCode
   
    if (maxWords === '' || maxWords === undefined) {
      maxWords = 50000
      setWordLimit(50000)
    }
    else setWordLimit(maxWords)
    
    
    let numSolutions = 0
    for (let i = 0; i < codeLang.length; i++) {
      let selectedCode = ''
      
      let pulledCode = codeLang[i]
      if (pulledCode === null) continue
      pulledCode.map((codeInfo) => {
        selectedCode = codeInfo.code
        return 0
      })
      // 
      const solutionArray = selectedCode.split(" ")
      let solutionSize = 0
      solutionArray.map((word) => {
        if (word !== '') solutionSize++
        return ''
      })
      if (solutionSize <= maxWords) numSolutions++
    }
    if (maxWords === '') setSolutionRage('ALL')
    else setSolutionRage(numSolutions)
    if (numSolutions === 0) {      
      return `Must have atleast 1 ${codingLanguage} solutions`
    }
    let funcRawCode = randomCode(codingLanguage, numSolutions)
    let funcWordBank = []
    let funcIndentChars = []
    let funcWhiteSpace = []
    // wordbank
    const codeWords = funcRawCode.split(' ')
    const finalCode = []
    let isCommenting = false
    codeWords.map((word, i) => {
      


      if (word === '//' || word.includes('/**') || (codingLanguage === 'Python' && word === '#')) isCommenting = true
      if (word !== '' && !isCommenting && !word.includes('*/') && codeWords[i + 1] === '//') finalCode.push(`${word}\n`) // if next one is a comment, add a pseudo return line
      else if (word !== '' && !isCommenting && !word.includes('*/')) finalCode.push(word)
      else if (word.includes('\n')) {
        isCommenting = false
      }
      
      return console.log()
    })
    funcWordBank = finalCode
    setWordsLeft(funcWordBank.length)
    console.log("HERE: ")
    console.log(solutionWordCount)
    console.log(funcWordBank.length)
    setSolutioNwordCount(funcWordBank.length)
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
        let times = 0
        let index = funcRawCode.indexOf(`${word}`, map[word])
        while ((funcIndentChars[index] === undefined || funcIndentChars[index] === 0 || funcIndentChars[index] === 2)) {
          times++
          index = funcRawCode.indexOf(`${word}`, index + 1)
          if (times === 100) break
        }
        if (times === 100) {
          console.log("POG SAVED")
          Reset(codingLanguage)
          
        }
        let ogIndex = index
        index--;

        let space = 0
        
        while (funcRawCode.charAt(index) === ' ') {
          
          space++
          index--
        }
        
        funcIndentChars[ogIndex] = 2 // done it, some edge cases idk i need this
        map[word] = ogIndex + 1
        whiteSpaceAns[idx] = space
        return ''
        

      } else {
        
        let index = funcRawCode.indexOf(`${word}`)
        let times = 0
        while ((funcIndentChars[index] === undefined || funcIndentChars[index] === 0 || funcIndentChars[index] === 2)) {
          times++
          index = funcRawCode.indexOf(`${word}`, index + 1)
          if (times === 100) {
            break
          }
        }
        if (times === 100) {
          Reset(codingLanguage)
        }
        let ogIndex = index
        index--;
        let space = 0
        
        while (funcRawCode.charAt(index) === ' ') {
          space++
          index--
        }
        
        map[word] = ogIndex + 1
        funcIndentChars[ogIndex] = 2
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
  }, [lastCode]);

  useEffect(() => {
    setWordsLeft(curr => curr - 1)
  }, [activeWordIndex])

  
  

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
    if (e.key === 'Shift') setShiftPress(true)
    else (setShiftPress(false))
    if (e.key === 'Control') setControllPress(true)
    else (setControllPress(false))


    if (e.key === 'Enter' && (shiftPress || controlPress)) {
      Restart(language, wordLimit, leetcodeTitle)
      setControllPress(false)
      setShiftPress(false)
      return ''
    }
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
        setRenderIndex(activeWordIndex)
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
      if (wordBank[activeWordIndex].substring(wordBank[activeWordIndex].length - 1) === "\n") {
        setRenderIndex(activeWordIndex)
      }
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

  function handleWordLimit(val) {
    if (val === '') setWordLimit(50000)
    else setWordLimit(val)
    console.log(wordLimit)
    
    
    let numSolutions = 0
    const codingLanguage = language
    let codeLang = javaCode
    if (codingLanguage === 'C++') codeLang = cppCode // C++ CRASHING RN PROB CAUSE COMMENTS (theyt end in smth sus)
    else if (codingLanguage === 'Java') codeLang = javaCode // same with java
    else if (codingLanguage === 'Python') codeLang = pyCode
    for (let i = 0; i < codeLang.length; i++) {
      let selectedCode = ''
      
      let pulledCode = codeLang[i]
      if (pulledCode === null) continue
      pulledCode.map((codeInfo) => {
        selectedCode = codeInfo.code
        return 0
      })
      // 
      const solutionArray = selectedCode.split(" ")
      let solutionSize = 0
      solutionArray.map((word) => {
        if (word !== '') solutionSize++
        return ''
      })
      if (solutionSize <= val) numSolutions++
    }
    if (val === '') setSolutionRage('ALL')
    else setSolutionRage(numSolutions)
    console.log(numSolutions)
  }

  
  

  return (
    <div className = 'body'>
      <div className = 'container'>
        <div className = 'title'><h1> some name </h1></div>
        
        <div className = 'content'>
          
          <div className = 'codingSettings'>
            <div className = 'maxWordsDiv'>
              <p>Word Limit</p>
            
              <input 
                className = 'maxWordsForm' 
                placeholder={'...'} 
                type='text'
                onChange={(e) => handleWordLimit(e.target.value)}
              />
              <p>Selecting from {solutionRange} {language} solutions</p>
              <p>{error}</p>
            </div>
            <button onClick={() => Restart('C++', wordLimit)}>C++</button>
            <button onClick={() => Restart('Java', wordLimit)}>Java</button>
            <button onClick={() => Restart('Python', wordLimit)}>Python</button>
          </div>
          <div className = 'inputContainer'>
            <div className = 'leetcodeTitle'>
              <p>{leetcodeTitle}</p>
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
                  spellCheck={false}
                  ref = {inputElement}
                />}
              </div>
              <div className = 'wordsLeft'>{!newUser && !finished && wordsLeft}</div>
            </div> 
            
            <div className = 'text'>

              <p>{!finished && wordBank.map((word, index) => {
                if (index > renderIndex) {
                  let s = ''
                  if (index !== wordBank.length - 1) {
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
                }
                return ''
              })}</p>
              
            </div>
          </div>
        </div>
        <div id = "userInput"> 
         
          {!newUser && <button onClick={() => Restart(language, wordLimit)}>Restart Test</button>}
          {!newUser && <p className = "reminder">Tab + Enter to Restart Test<br/><br/>Shift/Ctrl + Enter to Retry Same Test</p>}
          
        </div>
        
      </div>
    </div>
  );
}

export default App;