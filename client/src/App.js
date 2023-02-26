import './App.css'
import {useState, useRef, useEffect} from 'react'
import React from 'react'
import Timer from './components/Timer.js'
import javaCode from './components/javaCode.json'


function getWordBank ()  {
  const codeArray = []
  
  
  
  
    javaCode.map(code => {
      code.map(codeInfo => {
        console.log(codeInfo)

        return (
          codeArray.push(codeInfo.code)
        )
      })
      return ('')
  })
  const pickedCode = codeArray[0]
  const codeWords = pickedCode.split(' ')
  const finalCode = []
  codeWords.map(word => {
    word = word.replaceAll("\n", "")
    if (word !== '') finalCode.push(word)
    if (word.includes("\n")) console.log("huh :" + word)
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

  const rerender = useRef(0)

  useEffect (() => {
    rerender.current += 1
  })


  if (correct === true) return <span className="correct">{text} </span>
  if (correct === false) return <span className ="incorrect">{text} </span>
  if (active) {
    return <span style = {{ fontWeight: active ? 'bold' : 'lighter'}}> {text} </span>
  }
  return <span>{text} </span>

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
    console.log(wordBank.current[activeWordIndex])
    setStartCounting(true)
    setIsBackSpace(false)
    document.addEventListener("keydown", (event) => {
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