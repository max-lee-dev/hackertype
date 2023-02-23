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
    return <span style = {{ fontWeight: active ? 'bold' : 'normal'}}> {text} </span>
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
  const wordBank = useRef(getWordBank())

  function Restart() {
    setUserInput('')
    setActiveWordIndex(0)
    setCorrectWordArray([])
  }

  function processInput(value) {
    setStartCounting(true)
    if (value.endsWith(' ')) {
      if (activeWordIndex === wordBank.current.length - 1) {
        // we're done
        setUserInput('Finished!')
        setStartCounting(false)
        Restart()
        return
      }
      setActiveWordIndex(index => index + 1)
      setUserInput(' ')
      
      
      setCorrectWordArray(data => {
        const word = value.trim()
        const newResult = [...data] 
        newResult[activeWordIndex] = word === wordBank.current[activeWordIndex]
        return newResult
              
      })
      
    } else {
      setUserInput(value)
    }
  }

  return (
    <div>
      <h1>Hacker Type</h1>
      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />
      <p>{wordBank.current.map((word, index) => {

        return <Word 
          text = {word}
          active={index === activeWordIndex}
          correct={correctWordArray[index]}
        />
      })}</p>
      <input 
        type="text" 
        value={userInput} 
        onChange ={(e) => processInput(e.target.value)}
      />
    </div>
  );
}

export default App;
