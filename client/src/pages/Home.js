import {useState, useRef, useEffect} from 'react'
import React from 'react'
import Timer from './components/Timer.js'
import javaCode from './components/codefiles/javaCode.json'
import pyCode from './components/codefiles/pyCode.json'
import cppCode from './components/codefiles/cppCode.json' // bye bye
import CodeSettings from './components/CodeSettings.js'
import StoredInput from './components/StoredInput.js'
import Letter from './components/Letter.js'
import {addDoc, getDocs} from 'firebase/firestore'
import {db} from './components/firebase.js'
import { collection } from 'firebase/firestore'
import {
  Center,
  useDisclosure,
  IconButton,
  Stack,
  Divider,
  Image
} from '@chakra-ui/react'
import {
  RepeatIcon,
  StarIcon
} from '@chakra-ui/icons'

// figure out how to get new text every reload

// remove comments, when i find a // remopve that ENTIRE line not just thaT word



function countCharCorrect(actualText, userText) {
  let count = 0, 
  i = 0;
  while (i < actualText.length) {
    if (userText.charAt(i) === actualText.charAt(i)) count++;
    i++;
  }
  return count;
}

function countReturns(text) {
  let count = 0,
    i = 0;
  while (true) {
    const r = text.indexOf('\n', i);
    if (r !== -1) [count, i] = [count + 1, r + 1];
    else return count;
  }
}










function App({user}) {
  const { isOpen: isWordsOpen, onClose: onWordsClose, onOpen: onWordsOpen } = useDisclosure();
  const { isOpen: isSearchOpen, onClose: onSearchClose, onOpen: onSearchOpen } = useDisclosure();
  


  const inputElement = useRef(null);
  const [submitted, setSubmitted] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [startCounting, setStartCounting] = useState(false)
  const [correctWordArray, setCorrectWordArray] = useState([])
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [leetcodeTitle, setLeetcodeTitle] = useState('')
  const [renderIndex, setRenderIndex] = useState(-1)
  const [javaRange, setJavaRange] = useState('ALL')
  const [cppRange, setCppRange] = useState('ALL')
  const [pythonRange, setPythonRange] = useState('ALL')
  const [wordLimit, setWordLimit] = useState(50000)
  const [wordBank, setNewWordBank] = useState([])
  const [whiteSpace, setWhiteSpace] = useState([])
  const [language, setLanguage] = useState('')
  const [newUser, setNewUser] = useState(true)
  const [lastCode, setLastCode] = useState([])
  const [wordsLeft, setWordsLeft] = useState(0)
  const [error, setError] = useState('')
  const [controlPress, setControllPress] = useState(false)
  const [solutionWordCount, setSolutionWordCount] = useState(0)
  const [storedInputArray, setStoredInputArray] = useState([])
  const [lineRenderIndex, setLineRenderIndex] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [correctCharsArray, setCorrectCharsArray] = useState([])
  const [thisSolutionPR, setThisSolutionPR] = useState(0)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState('')
  const submissionsCollectionRef = collection(db, 'submissions')
 
  
  const [finished, setFinished] = useState(false)
  useEffect(() => {
    setLoading(true)
    const getSubmissions = async () => {
      const data = await getDocs(submissionsCollectionRef)
      setSubmissions(data.docs.map(doc => (
        {...doc.data(), id: doc.id}
      )))
    }
    getSubmissions().then(() => setLoading(false))
    
    //eslint-disable-next-line
  }, [finished])
  function Restart(codingLanguage, maxWords, retrySame) {
    console.log(wordsLeft)
    let s = ''
    
    if (retrySame === undefined) { // if not retrying same code (typically)
      
      if (id !== undefined && id !== '') {
        
        if (!isNaN(id) || id < 1) {
          s = Reset(codingLanguage, maxWords, id)
        }
      } else {
        s = Reset(codingLanguage, maxWords)
      }
      
      if (s !== undefined) {
        setError(s)
        return
      } else setError('')
    }
    
    
    //
    if (!newUser && retrySame !== undefined) setWordsLeft(solutionWordCount)
    if (inputElement.current) {
      inputElement.current.focus();
      
    }
    setSubmitted(false)
    setLanguage(codingLanguage)
    setRenderIndex(-1)
    setNewUser(false)
    setUserInput('')
    setActiveWordIndex(0)
    setStartCounting(false)
    setCorrectWordArray([])
    setFinished(false)
    setStoredInputArray([])
    setLineRenderIndex([])
    setCurrentLine(0)
    setCorrectCharsArray([])
    
    
    
  }
  function randomCode(codingLanguage, solutionSize, id) {
    let codeLang = javaCode
    id--
    if (codingLanguage === 'C++') codeLang = cppCode // C++ CRASHING RN PROB CAUSE COMMENTS (theyt end in smth sus)
    else if (codingLanguage === 'Java') codeLang = javaCode // same with java
    else if (codingLanguage === 'Python') codeLang = pyCode
   
    var selectedCode = ''
    var codeTitle = ''
    
    
    if (codeLang[id] === null) {
      setError('Not a valid solution ID!')
    }
    while (true) {
      var randInt = (Math.floor(Math.random() * (codeLang.length)))
      var pulledCode = codeLang[randInt] // contains /**  in java
      pulledCode = codeLang[randInt]
      while (pulledCode === null || (solutionSize !== 1 && pulledCode === lastCode)) {
        
        randInt = (Math.floor(Math.random() * (codeLang.length)))
        pulledCode = codeLang[randInt]
        

      }
      if (id !== undefined && !isNaN(id)) {
        if (codeLang[parseInt(id)] === undefined) {
          setError('Not a valid solution ID!')
        }
        pulledCode = codeLang[parseInt(id)]
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
      
      if (id !== undefined && !isNaN(id)) break
    }
    // 
    const inputArr = []
    setStoredInputArray(inputArr)
    setLeetcodeTitle(codeTitle)
    setLastCode(pulledCode)
    let pr = 0;
    submissions.map(submission => {
                    
      if (submission.user !== user.displayName) return ''
      if (submission.solution_id !== codeTitle) return ''
      if (submission.wpm > pr) pr = submission.wpm
      
      
      
    })
    console.log("TESdTTT: " + pr)
    setThisSolutionPR(pr)
    return selectedCode 
  }

  function Reset(codingLanguage, maxWords, id) {
    

    // solution range
    ////////////////////////// C++ 
    let codeLang = cppCode
    
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
    if (maxWords === '') setCppRange('ALL')
    else setCppRange(numSolutions)
    ////////////////////////// JAVA
    numSolutions = 0
    
    codeLang = javaCode
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
    if (maxWords === '') setJavaRange('ALL')
    else setJavaRange(numSolutions)
    numSolutions = 0
    ////////////////////////// PYTHON
    codeLang = pyCode
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
    if (maxWords === '') setPythonRange('ALL')
    else setPythonRange(numSolutions)

    numSolutions = 0
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
      if (solutionSize <= maxWords) numSolutions++
    }



    if (numSolutions === 0) {      
      return `Must have atleast 1 solution`
    }
    let funcRawCode = randomCode(codingLanguage, numSolutions, id)
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
    setSolutionWordCount(funcWordBank.length)
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
    
    const { text, active, correct, thisWordIndex} = props
    const hasReturn = text.includes('\n')
    const textArr = text.split('')
    return textArr.map((char, index) => {
      return ( <Letter
        idx={index}
        char={char}
        displayWord={text}
        userInput={userInput}
        active={active}
        wordCorrect={correct}
        hasReturn={hasReturn}
        activeWordIndex={activeWordIndex}
        thisWordIndex={thisWordIndex}
      />)
      
    })
    // if (correct === true) {
    //         if (active) {
    //                 if (hasReturn) return <span className = 'currentCorrect displayText'>{text} <br/></span>
    //                 return <span className="currentCorrect displayText">{text} </span>
    //         } else {
    //                 if (hasReturn) return <span className="correct displayText">{text} <br/></span>
    //                 return <span className="correct displayText">{text} </span>
    //         }
    // }
    // if (correct === false) {
    //         if (active) {
    //                 if (hasReturn) return <span className="currentIncorrect displayText">{text} <br/></span>
    //                 return <span className ="currentIncorrect displayText">{text} </span>
    //         } else {
    //                 if (hasReturn) return <span className="incorrect displayText">{text} <br/></span>
    //                 return <span className ="incorrect displayText">{text} </span>
    //         }
            
    // }

    // if (active) {
    //         if (hasReturn) return <span className = "active">{text} <br/></span>
    //         return <span className = "active">{text} </span>
    // }
    // if (hasReturn)return <span className = "displayText">{text}<br/></span>
    // return <span className = "displayText">{text} </span>
  }
  // eslint-disable-next-line
  Word = React.memo(Word)

  


  function handleKeyDown(e) {
    if (e.key === 'Backspace' && userInput === '' && activeWordIndex !== 0) {
      if (whiteSpace[activeWordIndex] !== undefined) {
        setRenderIndex(lineRenderIndex[currentLine - 1])
        setCurrentLine(line => line - 1)      
      }
        setUserInput(storedInputArray[activeWordIndex-1])
        setActiveWordIndex(input => input - 1)
        setCorrectWordArray(data => {
          const newResult = [...data] 
          newResult[activeWordIndex] = null
          return newResult
        })
      

      
      
    } 

    if (e.key === 'Control') setControllPress(true)
    else (setControllPress(false))


    if (e.key === 'Enter' && (controlPress)) {
      Restart(language, wordLimit, leetcodeTitle)
      setControllPress(false)
      return ''
    }
    if (e.key === 'Enter' && inputElement.current.type === document.activeElement.type) {
      if (wordBank[activeWordIndex].substring(wordBank[activeWordIndex].length - 1) === "\n") {
        setCorrectWordArray(data => {
          const newResult = [...data] 
          newResult[activeWordIndex] = userInput === wordBank[activeWordIndex].substring(0, wordBank[activeWordIndex].length - countReturns(wordBank[activeWordIndex]))
          return newResult
  
        })
        
        var StoredInputFunction = StoredInput()
        setStoredInputArray(StoredInputFunction.setCode(storedInputArray, activeWordIndex, e.target.value + e.target.value.charAt(e.target.value.length - 1))) // WHY DO I NEED THIS LMFAO (deletes last char)

        setRenderIndex(activeWordIndex)
        const arr = [...lineRenderIndex]
        arr[currentLine] = renderIndex
        setCurrentLine(line => line + 1)
        setLineRenderIndex(arr)
        setUserInput('')
        setActiveWordIndex(input => input + 1)
        var oldCharacterCountArray = [...correctCharsArray]
        oldCharacterCountArray[activeWordIndex] = countCharCorrect(wordBank[activeWordIndex], e.target.value.trim())

        setCorrectCharsArray(oldCharacterCountArray)
       
        if (activeWordIndex === wordBank.length - 1) { 
        
          setFinished(true)
          return
        }
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
        const arr = [...lineRenderIndex]
        arr[currentLine] = renderIndex
        setCurrentLine(line => line + 1)
        setLineRenderIndex(arr)
      }
      var StoredInputFunction = StoredInput()
      setStoredInputArray(StoredInputFunction.setCode(storedInputArray, activeWordIndex, value))
      var oldCharacterCountArray = [...correctCharsArray]
      oldCharacterCountArray[activeWordIndex] = countCharCorrect(wordBank[activeWordIndex], value.trim())

      setCorrectCharsArray(oldCharacterCountArray)
      

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
    
    
    // solution range
    ////////////////////////// C++ 
    let codeLang = cppCode
    
    if (val === '' || val === undefined) {
      val = 50000
      setWordLimit(50000)
    }
    else setWordLimit(val)
    
    
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
      if (solutionSize <= val) numSolutions++
    }
    if (val === '') setCppRange('ALL')
    else setCppRange(numSolutions)
    ////////////////////////// JAVA
    numSolutions = 0 

    codeLang = javaCode
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
    if (val === '') setJavaRange('ALL')
    else setJavaRange(numSolutions)
    ////////////////////////// PYTHON
    codeLang = pyCode
    numSolutions = 0 
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
    if (val === '') setPythonRange('ALL')
    else setPythonRange(numSolutions)
  }

  

  
  return (
   
    <div className = 'body'>
      <div className = 'container'>        
        <Center>
          <div className = 'content'>
          <div className = 'leetcodeTitle'>
                <p>{newUser && 'Select a language to begin coding'}</p>
              </div>
            <div className = 'codingSettings'>
              <CodeSettings
                id={id}
                language={language} 
                isSearchOpen={isSearchOpen}
                onSearchOpen={onSearchOpen}
                onSearchClose={onSearchClose}
                isWordsOpen={isWordsOpen}
                onWordsOpen={onWordsOpen}
                onWordsClose={onWordsClose}
                wordLimit={wordLimit} 
                handleWordLimit={handleWordLimit} 
                Restart={Restart}
                cppRange={cppRange}
                javaRange={javaRange}
                pythonRange={pythonRange}
                setId={setId}
              />
            </div>
            
            <div className = 'inputContainer'>
              
            <div className = 'leetcodeTitle'>

                <p>{leetcodeTitle}</p>
              </div>
              <div id = 'timer'>
                
                {startCounting && <Timer
                  codeID={leetcodeTitle}
                  startCounting={startCounting}
                  pause={finished}
                  correctWords={correctWordArray.filter(Boolean).length}
                  totalWords={wordBank.length}
                  correctCharacterArray={correctCharsArray}
                  submitted={submitted}
                  leetcodeTitle={leetcodeTitle}
                  setSubmitted={setSubmitted}
                  user={user}
                  thisSolutionPR={thisSolutionPR}
                />}
                {console.log("test2: " + thisSolutionPR)}
              </div>
              
              
              <div className = 'textContainer'>
                
                <p className = 'error'> {error}</p>
                 
                <div>
                  
                  <Stack justifyContent='center' direction='row'>
                  {!finished && <Divider orientation='vertical' width='56px'/>}
                  {!newUser && !finished && <input 
                    
                    className = 'textInput'
                    type="text" 
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    value={userInput} 
                    onChange ={(e) => processInput(e)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                    ref = {inputElement}
                  />}
                   
                  <div className = 'restartDiv'>
                    {!newUser && <IconButton boxSize='12' icon={<RepeatIcon/>} onClick={() => Restart(language, wordLimit)}></IconButton>}
                  </div>
                  
                  </Stack>
                </div>
                <div className = 'reminder'>
                <Center>
                  <Stack direction={['row']}>
                 {!newUser && !startCounting && 
                 <p>PR: {thisSolutionPR} WPM </p>
                 
                 }
                 {!newUser && !startCounting && <Image _activeLink={'/'} boxSize='25px' src = {'crown (2).png'} alt='logo' className='site-title'/>}
                  
                 </Stack>
                </Center>
                </div>
                
                
                
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
                      thisWordIndex={index}
                      
                    />
                    </span>
                  }
                  return ''
                })}</p>
                
              </div>
            </div>
          </div>
        </Center>
        <div id = "userInput"> 
         
         
          {!newUser && <p className = "reminder">Tab + Enter to Restart Test<br/><br/>Ctrl + Enter to Retry Same Test</p>}
          
        </div>
        
      </div>
    </div>
  );
}

export default App;