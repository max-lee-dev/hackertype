import { useState, useEffect} from 'react'


function Timer (props) {
       const [timeElapsed, setTimeElapsed] = useState(0)
        const { correctWords, startCounting, pause, totalWords} = props
        const [done, setDone] = useState(pause)
        const [wordspm, setWordspm] = useState(0)
        useEffect(() => {
                setDone(false)
                let id 
                if (startCounting) {
                        id = setInterval(() => {
                                setTimeElapsed(oldTime => oldTime + 1)
                        }, 1000)
                } else {
                        console.log("wtf")
                }
                return () => {
                        console.log(startCounting)
                        setTimeElapsed(0)
                        clearInterval(id)
                        
                }
        }, [startCounting])
        const wpm = (correctWords/(timeElapsed/60) || 0).toFixed(0)
        if (!pause && startCounting) return <p className = "wpm">WPM : {wpm}</p>
        else if (pause) {
                const accuracy = (correctWords/totalWords || 0).toFixed(3) * 100 
                if (!done) {
                        console.log(timeElapsed/60)
                        setWordspm((correctWords/(timeElapsed/60) || 0).toFixed(0))
                        setDone(true)
                }
                
                return (
                        
                        <p>WPM: {wordspm}<br/>Accuracy: {accuracy}%</p>
                )
        }
        

}

export default Timer;