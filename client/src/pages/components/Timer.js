import { useState, useEffect} from 'react'
import {addDoc} from 'firebase/firestore'
import {db} from './firebase'
import { collection, increment, updateDoc, doc, getDocs } from 'firebase/firestore'
import { StarIcon } from '@chakra-ui/icons'


function Timer ({language, thisSolutionPR, user, leetcodeTitle, submitted, setSubmitted, correctWords, startCounting, pause, totalWords, correctCharacterArray}) {
       const [timeElapsed, setTimeElapsed] = useState(0)
        const actualPR = thisSolutionPR;
        const [finalWPM, setFinalWPM] = useState(0)
        const submissionsCollectionRef = collection(db, 'submissions')
        const [submissions, setSubmissions] = useState([])
        const [done, setDone] = useState(pause)
        const [addedOne, setAddedOne] = useState(false)
        const [newAcc , setNewAcc] = useState(0)
        const [rank, setRank] = useState(1)
        const [totalOpponents, setTotalOpponents] = useState(1)
        console.log("START: " + startCounting)

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
                        setFinalWPM((fakeCorrectWords/(timeElapsed/60) || 0).toFixed(0))
                        setDone(true)
                        setNewAcc(acc)

                }
               
                const isPR = user ? parseInt(finalWPM) > parseInt(actualPR) : false
                // specify language using BADGES (CHAKRA)
                return (
                        
                        <div className = 'aboutContainer'>
                                {isPR && <h1><StarIcon/> NEW PR!</h1>}
                                {isPR && <h1>RANK: {rank}/{totalOpponents}</h1>} 
                                <div>
                                        
                                </div>
                                
                                <div>
                                        <p>WPM: {finalWPM}<br/>Accuracy: {acc}%</p>
                                </div>
                                {!isPR && <p className = 'reminder'>PR: {actualPR}</p>}
                                {user && isPR && <h1 className = 'reminder'>Old PR: {actualPR}</h1>}
                        </div>
                )
                
                
               
        }
        
        async function createSubmission() {
                if (user) {
                        let totalWpm = parseInt(finalWPM) // database doesnt update during this func so start with the current wpm
                        let testsCompleted = 1
                        
                        
                        
                        let isBestSubmission = true
                        const oldBestSubmission = submissions.filter(function(submission) {
                                return submission.isBestSubmission === true && submission.user === user.displayName && submission.language === language && submission.solution_id === leetcodeTitle
                        })
                        submissions.map(submission => {
                                if (submission.user === user.displayName) { // This user's submissions
                                        // calculate rank
                                        if (submission.language === language && submission.solution_id === leetcodeTitle) { // This user's submissions in this language and this problem
                                                console.log("check")
                                                if (submission.isBestSubmission) {
                                                        // remove its status if the current one is best, it cant be the best anymore

                                                }
                                                if (parseInt(submission.wpm) > parseInt(finalWPM)) { 
                                                        isBestSubmission = false
                                                }
                                        }



                                        // calculate new average wpm
                                        totalWpm += parseInt(submission.wpm)
                                        testsCompleted++
                                }
                                return ''
                        })
                        let amountBetter = 1
                        let totalOppo = 1
                        if (isBestSubmission) {

                                // first update last one,
                                oldBestSubmission.map(submission => {
                                        updateDoc(doc(db, "submissions", submission.id), {
                                                isBestSubmission: false
                                        })
                                        return ''
                                })
                                
                                submissions.filter(function(submission) {
                                return submission.isBestSubmission === true && submission.user !== user.displayName && submission.language === language && submission.solution_id === leetcodeTitle
                                }).map(submission => {
                                        totalOppo++
                                        if (parseInt(submission.wpm) > parseInt(finalWPM)) {
                                                amountBetter++
                                        }
                                        return ''
                                })
                                setTotalOpponents(totalOppo)
                                setRank(amountBetter)
                        }
                        const avgWpm = (totalWpm/testsCompleted).toFixed(0)
                        console.log(avgWpm)
                        await updateDoc(doc(db, "users", user?.uid), {
                                tests_completed: increment(1),
                                average_wpm: avgWpm
                        })
                        await addDoc(submissionsCollectionRef, {
                                solution_id: leetcodeTitle, 
                                user: user.displayName, 
                                wpm: finalWPM, 
                                acc: newAcc, 
                                language: language, 
                                user_uid: user.uid, 
                                date: new Date(),
                                isBestSubmission: isBestSubmission,
                                rank: amountBetter,
                        });
                        
                }

        }

        async function startedTest() {
                if (!addedOne) {
                        await updateDoc(doc(db, "users", user?.uid), {
                                tests_started: increment(1) // this runs twice for some reason lol
                        });
                        setAddedOne(true) 
                }
        }

}

export default Timer;