import { useState, useEffect} from 'react'


function Timer (props) {
       const [timeElapsed, setTimeElapsed] = useState(0)
        const { correctWords, startCounting} = props

        useEffect(() => {
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

       
        return <p>WPM : {(correctWords/(timeElapsed/60) || 0).toFixed(0)}</p>

}

export default Timer;