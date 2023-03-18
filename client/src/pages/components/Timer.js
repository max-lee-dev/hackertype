import { useState, useEffect} from 'react'
import {addDoc} from 'firebase/firestore'
import {db} from './firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'


function Timer ({leetcodeTitle, submitted, setSubmitted, correctWords, startCounting, pause, totalWords, correctCharacterArray}) {
        const [newUser, setNewUser] = useState("")
        const [setWPM, setNewWPM] = useState(0)
       const [timeElapsed, setTimeElapsed] = useState(0)
        
        const [wordspm, setWordspm] = useState(0)
        const submissionsCollectionRef = collection(db, 'submissions')

        const [done, setDone] = useState(pause)
        const [newAcc , setNewAcc] = useState(0)


        
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
       

        useEffect(() => {
                if (done) {
                        createSubmission()
                }
                
        }, [done])
        let totalCorrectChars = 0
        for (let i = 0; i < correctCharacterArray.length; i++) {
                totalCorrectChars += correctCharacterArray[i]
        }
       
        let fakeCorrectWords = totalCorrectChars/4.5
        const wpm = (fakeCorrectWords/(timeElapsed/60) || 0).toFixed(0)
        
        if (!pause && startCounting) return <p className = "wpm">WPM : {wpm}</p>
        else if (pause) {
                const accuracy = (correctWords/totalWords || 0).toFixed(3) * 100 
                const acc = accuracy.toFixed(0)
                if (!done) {
                        setWordspm((fakeCorrectWords/(timeElapsed/60) || 0).toFixed(0))
                        setDone(true)
                        setNewAcc(acc)

                }
               
                
                return (
                        
                        <p>WPM: {wordspm}<br/>Accuracy: {acc}%</p>
                )
                
                
               
        }
        
        async function createSubmission() {
                await addDoc(submissionsCollectionRef, {solution_id: leetcodeTitle, user: "YOOOO", wpm: wordspm, acc: newAcc});
        }

}

export default Timer;