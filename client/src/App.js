import './App.css'
import {useState, useRef, useEffect} from 'react'
import React from 'react'
import Timer from './components/Timer.js'
import javaCode from './components/javaCode.json'



// figure out how to get new text every reload

// remove comments, when i find a // remopve that ENTIRE line not just thaT word

// figure out how to make the user press return
  // CLIENT SIDE: replace \n with RETURN!!!
  // SERVER SIDE: 
  // all of the linews that have \n are at the end. Whenever i press return, just c heck the last two characters and see if theres a

function getWordBank ()  {
  const codeArray = []
  
  javaCode.map(code => {
    code.map(codeInfo => {

      return (
        codeArray.push(codeInfo.code)
      )
    })
    return ('')
  })
  const randInt = (Math.floor(Math.random() * (codeArray.length)) + 1)
  const pickedCode = codeArray[randInt]
  const codeWords = pickedCode.split(' ')
  const finalCode = []
  codeWords.map(word => {
    if (word !== '') finalCode.push(word)
    return console.log()
  })
  
  return (
    finalCode
  );
}




// fetch(`http://localhost:8000/results`)
//   .then(response => {return response.json()})
//   .then(data => {
//     data.forEach(codeInfo => {
      
//       codeInfo.forEach(thing => {
//         console.log(thing.code);
//         getWordBank(thing.code);
//       })
      
//     })
//   }).catch(err => console.log(err))


function Word(props) {
  const { text, active, correct } = props
  let newText = text
  const rerender = useRef(0)

  useEffect (() => {
    rerender.current += 1
  })
  const hasReturn = text.includes('\n')
  if (hasReturn) {
    newText = newText.substring(0, newText.length - 1)
    console.log(newText + " " + newText.includes('\n'))
  }
  if (correct === true) return <span className="correct">{newText} </span>
  if (correct === false) return <span className ="incorrect">{newText} </span>
  if (active) {
    if (hasReturn)return <span>{newText} <br/></span>
    return <span style = {{ fontWeight: active ? 'bold' : 'lighter'}}> {newText} </span>
  }
  if (hasReturn)return <span>{newText} <br/></span>
  return <span>{newText} </span>

}




// eslint-disable-next-line
Word = React.memo(Word)





function App() {
  const [userInput, setUserInput] = useState('')
  const [startCounting, setStartCounting] = useState(false)
  const [correctWordArray, setCorrectWordArray] = useState([])
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [curCharIdx, setCurCharIdx] = useState(0)
  const [isBackSpace, setIsBackSpace] = useState(false)
  const [userChar, setUserChar] = useState('')
  const wordBank = useRef(getWordBank())

  
  const [finished, setFinished] = useState(false)
  function Restart() {
    setUserInput('')
    setActiveWordIndex(0)
    setStartCounting(false)
    setUserChar('')
    setCurCharIdx(0)
    setCorrectWordArray([])
    setFinished(false)
    this.input.focus()
  }

  // automatically select the text box on startCounting
  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
      
    }
  }, [startCounting]);
  

  
  function processInput(e) {
    setStartCounting(true)
    setIsBackSpace(false)
    document.addEventListener("keydown", (event) => {
      if (inputElement.current.type === document.activeElement.type && event.key === "Enter") {
        if (wordBank.current[activeWordIndex].substring(wordBank.current[activeWordIndex].length - 3 === "\n")) {
          setCorrectWordArray(data => {
            const newResult = [...data] 
            newResult[activeWordIndex] = true
            return newResult
    
          })
        }
        console.log("watch")
        setActiveWordIndex(activeWordIndex => activeWordIndex + 1)
        setUserInput('')
        setCurCharIdx(0)
        
      }
      if (event.key === "Backspace") setIsBackSpace(true)
      else setUserChar(event.key)
    });
    const value = e.target.value;
    setStartCounting(true)
    if (value.endsWith(' ')) {
      
      setActiveWordIndex(index => index + 1)
      setUserInput('')
      setCurCharIdx(0)

      setCorrectWordArray(data => {
        const word = value.trim()
        const newResult = [...data] 
        newResult[activeWordIndex] = word === wordBank.current[activeWordIndex]
        return newResult

      })
      if (activeWordIndex === wordBank.current.length - 1) {
        
        // we're done        
        setFinished(true)
        return
      }
    } else {
      setUserInput(value)
      if (!isBackSpace) {
        setCurCharIdx(curCharIdx => curCharIdx + 1)
      } else {
        setCurCharIdx(curCharIdx => curCharIdx - 1)
      }
      if ((activeWordIndex !== 0 || curCharIdx !== 0) && userChar !== wordBank.current[activeWordIndex].charAt(curCharIdx)) {
        setCorrectWordArray(data => {
          const newResult = [...data] 
          newResult[activeWordIndex] = false
          return newResult
  
        })
      } else if (userChar === wordBank.current[activeWordIndex].charAt(curCharIdx)) {
        
      }
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
              totalWords={wordBank.current.length}
            />
            

          </div>
          <div className = 'text'>

            <p>{!finished && wordBank.current.map((word, index) => {

              return <Word 
                text = {word}
                active={index === activeWordIndex}
                correct={correctWordArray[index]}
                
              />
            })}</p>
            
          </div>
          
        </div>
        <div id = "userInput"> 
          {!finished && <input 
              type="text" 
              value={userInput} 
              onChange ={(e) => processInput(e)}
              
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