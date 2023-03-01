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
function countReturns(text) {
  let count = 0,
    i = 0;
  while (true) {
    const r = text.indexOf('\n', i);
    if (r !== -1) [count, i] = [count + 1, r + 1];
    else return count;
  }
}

function Word(props) {
  const { text, active, correct } = props
  const rerender = useRef(0)

  useEffect (() => {
    rerender.current += 1
  })
  const hasReturn = text.includes('\n')
  
  if (correct === true) {
    if (active) {
      if (hasReturn) return <span className = 'currentCorrect'> {text} <br/></span>
      return <span className="currentCorrect">{text} </span>
    } else {
      if (hasReturn) return <span className="correct">{text} <br/></span>
      return <span className="correct">{text} </span>
    }
  }
  if (correct === false) {
    if (hasReturn) return <span className="incorrect">{text} <br/></span>
    return <span className ="incorrect">{text} </span>
  }
  
  if (active) {
    console.log()
    if (hasReturn) return <span style = {{ fontWeight: active ? 'bold' : 'lighter'}}> {text} <br/></span>
    return <span style = {{ fontWeight: active ? 'bold' : 'lighter'}}> {text} </span>
  }
  if (hasReturn)return <span>{text} <br/></span>
  return <span>{text} </span>

}




// eslint-disable-next-line
Word = React.memo(Word)
function randomCode() {
  const randInt = (Math.floor(Math.random() * (javaCode.length)) + 1)
  let selectedCode
  javaCode[randInt].map(code => {
    selectedCode = code.code
    
    return console.log(selectedCode)
  })
  return selectedCode
  
  
}

function getWordBank ()  {
  
  
  
  const pickedCode = randomCode()
  console.log(pickedCode)
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



function App() {
  
  const inputElement = useRef(null);
  const [userInput, setUserInput] = useState('')
  const [startCounting, setStartCounting] = useState(false)
  const [correctWordArray, setCorrectWordArray] = useState([])
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [newWordBank, setNewWordBank] = useState(getWordBank())
  
  const wordBank = useRef(newWordBank)

  
  const [finished, setFinished] = useState(false)

  function Restart() {
    setUserInput('')
    setActiveWordIndex(0)
    setStartCounting(false)
    setCorrectWordArray([])
    setFinished(false)
    setNewWordBank(getWordBank())
  }

  // automatically select the text box on startCounting
  

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
      
    }
  }, [startCounting]);
    document.addEventListener("keydown", (event) => {
    // if (inputElement.current.type === document.activeElement.type && event.key === "Enter") {
    //   console.log("second: " + activeWordIndex)
      
      
    // }

  });

  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputElement.current.type === document.activeElement.type) {
      if (wordBank.current[activeWordIndex].substring(wordBank.current[activeWordIndex].length - 1) === "\n") {
        console.log("is it ")
        setCorrectWordArray(data => {
          const newResult = [...data] 
          newResult[activeWordIndex] = userInput === wordBank.current[activeWordIndex].substring(0, wordBank.current[activeWordIndex].length - countReturns(wordBank.current[activeWordIndex]))
          console.log("corr: " + wordBank.current[activeWordIndex])
          return newResult
  
        })
        
        setUserInput('')
        setActiveWordIndex(input => input + 1)
      }
    }
  }
  
  function processInput(e) {
    console.log(activeWordIndex)
    setStartCounting(true)
    
    const value = e.target.value;
    setStartCounting(true)
    if (value.endsWith(' ')) {
      
      setActiveWordIndex(index => index + 1)
      setUserInput('')

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
      
      // if ((activeWordIndex !== 0 || curCharIdx !== 0) && value !== wordBank.current[activeWordIndex].substring(0, value.length)) {
       
      // }


      // live feedback
      setCorrectWordArray(data => {
        const newResult = [...data]   
        newResult[activeWordIndex] = value === wordBank.current[activeWordIndex].substring(0, value.length)
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
              totalWords={wordBank.current.length}
            />
            

          </div>
          <div className = 'text'>

            <p>{!finished && wordBank.current.map((word, index) => {

              return <Word 
                key ={index}
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