import { useState, useEffect} from 'react'
import {addDoc} from 'firebase/firestore'
import {db} from './firebase'
import { collection } from 'firebase/firestore'
import { StarIcon } from '@chakra-ui/icons'


function Timer ({language, thisSolutionPR, user, leetcodeTitle, submitted, setSubmitted, correctWords, startCounting, pause, totalWords, correctCharacterArray}) {
       const [timeElapsed, setTimeElapsed] = useState(0)
        const actualPR = thisSolutionPR;
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
                //eslint-disable-next-line
        }, [startCounting])
       

        useEffect(() => {
                if (done) {
                        createSubmission()
                }
              //eslint-disable-next-line  
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
               
                const isPR = wordspm > actualPR
                return (
                        
                        <div className = 'aboutContainer'>
                                {isPR && <h1><StarIcon/> NEW PR!</h1>}
                                <div>
                                        
                                </div>
                                
                                <div>
                                        <p>WPM: {wordspm}<br/>Accuracy: {acc}%</p>
                                </div>
                                {!isPR && <p className = 'reminder'>PR: {actualPR}</p>}
                                {isPR && <h1 className = 'reminder'>Old PR: {actualPR}</h1>}
                        </div>
                )
                
                
               
        }
        
        async function createSubmission() {
                await addDoc(submissionsCollectionRef, {solution_id: leetcodeTitle, user: user.displayName, wpm: wordspm, acc: newAcc, language: language, user_uid: user.uid, date: new Date()});
        }

}

export default Timer;