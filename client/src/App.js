import './App.css'
import {useState, useRef } from 'react'
import React from 'react'
import Timer from './components/Timer.js'


function getWordBank ()  {
  return 'pog poggers pogu lol haha xd'.split(' ')
}













function App() {
  const [userInput, setUserInput] = useState('')
  const [startCounting, setStartCounting] = useState(false)
  const [correctWordArray, setCorrectWordArray] = useState([])
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [curChar, setCurChar] = useState('')
  const wordBank = useRef(getWordBank())

  function Restart() {
    setUserInput('')
    setActiveWordIndex(0)
    setCorrectWordArray([])
  }
  function getCharClass(i, idx, char) {
    if (i === activeWordIndex && idx === charIdx - 1 && startCounting) {
      console.log(char + " " + curChar)
      if (char === curChar) {
        console.log("good")
        return 'y'
      } else {
        console.log("bad")
        return 'n'
      }
    } 
    return
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
      setUserInput('')
      setCharIdx(0)
      
      
      setCorrectWordArray(data => {
        const word = value.trim()
        const newResult = [...data] 
        newResult[activeWordIndex] = word === wordBank.current[activeWordIndex]
        return newResult
              
      })
      
    } else if (value.endsWith()) {
    } else {
      setCurChar(value.charAt(value.length - 1))
      setCharIdx(charIdx => charIdx + 1)
      
      setUserInput(value)
    }
  }
  
  return (
    <div className='body'>
      <div className = 'container'>
        <h1 className = 'title'>Hacker Type</h1>
        <Timer
          startCounting={startCounting}
          correctWords={correctWordArray.filter(Boolean).length}
        />
        <div className = "content">
          <div>
            {wordBank.current.map((word, i) => (
              <>
                
                <span key ={i}>
                  {word.split("").map((char, idx) => (
                    <span className={getCharClass(i, idx, char)} key = {idx}>{char}</span>
                  ))}  
                </span>
                <span> </span>
              </>
            ))}
          </div>
          <input 
          type="text" 
          value={userInput} 
          spellCheck="false"
          
          onChange ={(e) => processInput(e.target.value)}
        />
        </div>
        
      </div>
    </div>
  );
}

export default App;
