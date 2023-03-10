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
                }
                return () => {
                        setTimeElapsed(0)
                        clearInterval(id)
                        
                }
        }, [startCounting])
        const wpm = (correctWords/(timeElapsed/60) || 0).toFixed(0)
        if (!pause && startCounting) return <p className = "wpm">WPM : {wpm}</p>
        else if (pause) {
                const accuracy = (correctWords/totalWords || 0).toFixed(3) * 100 
                if (!done) {
                        setWordspm((correctWords/(timeElapsed/60) || 0).toFixed(0))
                        setDone(true)
                }
                const acc = accuracy.toFixed(0)
                return (
                        
                        <p>WPM: {wordspm}<br/>Accuracy: {acc}%</p>
                )
        }
        

}

export default Timer;