import { useState, useEffect} from 'react'
import {addDoc} from 'firebase/firestore'
import {db} from './firebase'
import { collection, increment, updateDoc, doc, getDocs } from 'firebase/firestore'
import { StarIcon } from '@chakra-ui/icons'


function Timer ({language, thisSolutionPR, user, leetcodeTitle, submitted, setSubmitted, correctWords, startCounting, pause, totalWords, correctCharacterArray}) {
       const [timeElapsed, setTimeElapsed] = useState(0)
        const actualPR = thisSolutionPR;
        const [wordspm, setWordspm] = useState(0)
        const submissionsCollectionRef = collection(db, 'submissions')
        const [submissions, setSubmissions] = useState([])
        const [done, setDone] = useState(pause)
        const [newAcc , setNewAcc] = useState(0)


        useEffect(() => {
                let id 
                if (startCounting) {
                        startedTest()
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

 
  
        useEffect(() => {
        
        const getSubmissions = async () => {
        const data = await getDocs(submissionsCollectionRef)
        setSubmissions(data.docs.map(doc => (
                {...doc.data(), id: doc.id}
        )))
        }
        getSubmissions()
        
        //eslint-disable-next-line
        }, [])



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
                if (user) {
                        let totalWpm = 0
                        let testsCompleted = 1
                        submissions.map(submission => {
                                if (submission.user === user.displayName) {
                                        console.log(submission.wpm)
                                        totalWpm += parseInt(submission.wpm)
                                        testsCompleted++
                                }
                                return ''
                        })
                        const avgWpm = (totalWpm/testsCompleted).toFixed(0)
                        console.log(avgWpm)
                        await updateDoc(doc(db, "users", user?.uid), {
                                tests_completed: increment(1),
                                average_wpm: avgWpm
                        })
                        
                        await addDoc(submissionsCollectionRef, {
                                solution_id: leetcodeTitle, 
                                user: user.displayName, 
                                wpm: wordspm, 
                                acc: newAcc, 
                                language: language, 
                                user_uid: user.uid, 
                                date: new Date()
                        });
                        
                }

        }

        async function startedTest() {
                await updateDoc(doc(db, "users", user?.uid), {
                        tests_started: increment(0.5) // this runs twice for some reason lol
                });
        }

}

export default Timer;