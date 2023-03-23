import React, {useEffect, useState} from 'react'
import { query, collection, where, getDocs, doc, getDoc} from "firebase/firestore";
import {db} from './firebase'
import {
        Stack,
        Text,
        Tooltip,
        Badge,
        Button
} from '@chakra-ui/react'

export default function Submission({uid, setId}) {
        const [submission, setSubmission] = useState({})
        const [loading, setLoading] = useState(true)
        let color = 'green'
        if (submission.language === 'Python') {
                color = '#adaa45'
        } else if (submission.language === 'Java') {
                color = '#fcba03'
        } else if (submission.language === 'C++') {
                color = '#2b5599'
        }
        let solutionNumber = ''
        useEffect(() => {
                setLoading(true)
                async function getSubmission() {
                        console.log(uid)
                        const subRef = doc(db, "submissions", uid)
                        const docSnap = await getDoc(subRef);
                        if (docSnap.exists()) {
                                setSubmission(docSnap.data())
                        } else {
                                console.log("No such document!");
                        }
                }
                getSubmission().then(() => setLoading(false))
        }, [])
       
        if (!loading) {
                const solutionNumberArr = submission.solution_id.split('.')
                solutionNumber = solutionNumberArr[0]
        }

        async function redirect() {
                window.location.replace(`/solutions/${submission.language}/${solutionNumber}`)
                
        }

  return (
        <div className = 'individualSubmissionContainer'>
                <div className = 'submissionText'>
                        
                                <div className = 'submissionInformationContainer'>
                                        <div>
                                                <Stack direction='row'>
                                                        
                                                        <div className = 'solutionTitleDiv'>
                                                                <Button onClick={redirect}>
                                                                <Text fontSize = '22px' paddingLeft = '6px'className='whiteText font500'>{submission.solution_id}</Text>
                                                                </Button>
                                                        </div>
                                                        
                                                        <Text fontSize = '22px' className='grayText font400'>- {submission.wpm} WPM</Text>
                                                        
                                                        
                                                </Stack>
                                        </div>
                                        <div className = 'badgeContainer'>
                                                <Stack direction='row'>
                                                        <Tooltip label = 'Rank' placement='top'>       
                                                                        
                                                                        <div className = 'badge'>                                                  
                                                                                <Badge variant='subtle' fontSize='15px' height='24px' colorScheme={'yellow'}>
                                                                                        {submission.rank}/{submission.totalOpponents}
                                                                                </Badge>   
                                                                        </div>  
                                                                                                                                     
                                                        </Tooltip>

                                                        <Tooltip label = 'Language' placement='top'>
                                                                <div className = 'badge'>
                                                                        <Badge variant='subtle' fontSize='13px' color='white' paddingTop={'2px'} width='65px' height='24px' bgColor={color}>
                                                                                <div ckassName='badgeText'>{submission.language}</div>
                                                                        </Badge>
                                                                </div>
                                                        </Tooltip>
                                                        
                                                </Stack>
                                        </div>
                                </div>
                                
                       
                                        
                </div>
               
        </div>
  )
}
