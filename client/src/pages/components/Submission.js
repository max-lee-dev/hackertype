import React, {useEffect, useState} from 'react'
import { query, collection, where, getDocs, doc, getDoc} from "firebase/firestore";
import {db} from './firebase'
import {
        Stack,
        Text,
        Badge
} from '@chakra-ui/react'

export default function Submission({uid}) {
        const [submission, setSubmission] = useState({})
        let color = 'green'
        if (submission.language === 'Python') {
                color = 'yellow'
        } else if (submission.language === 'Java') {
                color = '#fcba03'
        } else if (submission.language === 'C++') {
                color = 'blue'
        }

        useEffect(() => {
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
                getSubmission()
        }, [])
  return (
        <div className = 'individualSubmissionContainer'>
                <div className = 'submissionText'>
                        
                                <div className = 'submissionInformationContainer'>
                                        <div>
                                        <Stack direction='row'>
                                                <Text fontSize = '22px' className='whiteText font500'>{submission.solution_id}</Text>
                                                <Text fontSize = '22px' className='grayText font100'>{submission.user}</Text>
                                                <Text fontSize = '22px' className='grayText font400'>{submission.wpm}</Text>
                                                
                                        </Stack>
                                        </div>
                                        <div className = 'badgeContainer'>
                                                <Stack direction='row'>
                                                        <div className = 'badge'>
                                                                <Badge variant='subtle' width='60px' height='20px' bgColor={color}>
                                                                        {submission.language}
                                                                </Badge>
                                                        </div>
                                                        <div className = 'badge'>
                                                                <Badge variant='subtle'height='20px' colorScheme={'green'}>
                                                                        {submission.rank}/{submission.totalOpponents}
                                                                </Badge>
                                                        </div>
                                                </Stack>
                                        </div>
                                </div>
                                
                       
                                        
                </div>
               
        </div>
  )
}
