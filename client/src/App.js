import './App.css'
import {useState, useRef, useEffect} from 'react'
import React from 'react'
import Timer from './components/Timer.js'


function getWordBank ()  {
  return 'pog poggers pogu lol haha xd'.split(' ')
}







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

  function Restart() {
    setUserInput('')
    setActiveWordIndex(0)
    setStartCounting(false)
    setUserChar('')
    setCurCharIdx(0)
    setCorrectWordArray([])
  }

  function processInput(e) {
    
    setStartCounting(true)
    setIsBackSpace(false)
    document.addEventListener("keydown", (event) => {
      if (event.key === "Backspace") setIsBackSpace(true)
      else setUserChar(event.key)
      console.log("userchar: " + userChar)
    });
    const value = e.target.value;
    setStartCounting(true)
    if (value.endsWith(' ')) {
      if (activeWordIndex === wordBank.current.length - 1) {
        // we're done
        setUserInput('Finished!')
        
        Restart()
        return
      }
      setActiveWordIndex(index => index + 1)
      setUserInput('')
      setCurCharIdx(0)

      setCorrectWordArray(data => {
        const word = value.trim()
        const newResult = [...data] 
        newResult[activeWordIndex] = word === wordBank.current[activeWordIndex]
        return newResult

      })

    } else {
      setUserInput(value)
      if (!isBackSpace) {
        setCurCharIdx(curCharIdx => curCharIdx + 1)
      } else {
        setCurCharIdx(curCharIdx => curCharIdx - 1)
      }
      console.log(userChar + " " + wordBank.current[activeWordIndex].charAt(curCharIdx))
      if ((activeWordIndex !== 0 || curCharIdx !== 0) && userChar !== wordBank.current[activeWordIndex].charAt(curCharIdx)) {
        setCorrectWordArray(data => {
          const newResult = [...data] 
          newResult[activeWordIndex] = false
          return newResult
  
        })
      } else if (userChar === wordBank.current[activeWordIndex].charAt(curCharIdx)) {
        console.log("good")
        
      }
    }
    
  }

  return (
    <div className = 'body'>
      <div className = 'container'>
        <div className = 'title'><h1>Hacker Type</h1></div>
        <div className = 'content'>
          
          <div id = 'timer'>
            <Timer
              startCounting={startCounting}
              correctWords={correctWordArray.filter(Boolean).length}
            />
          </div>
          <div className = 'text'>
            <p>{wordBank.current.map((word, index) => {

              return <Word 
                text = {word}
                active={index === activeWordIndex}
                correct={correctWordArray[index]}
                
              />
            })}</p>
            
          </div>
          <input 
              type="text" 
              value={userInput} 
              onChange ={(e) => processInput(e)}
            />
          <button onClick={() => Restart()}>Restart Test</button>
        </div>
        
      </div>
    </div>
  );
}

export default App;