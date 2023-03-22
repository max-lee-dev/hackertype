import React, {useEffect, useState} from 'react'
import { query, collection, where, getDocs, doc, getDoc} from "firebase/firestore";
import {db} from './firebase'
import {
        Text,
} from '@chakra-ui/react'

export default function Submission({uid}) {
        const [submission, setSubmission] = useState({})
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
       
        <div className = 'submissionText'>
                                                                                
                <Text fontSize = '22px' className='grayText font400'>{submission.user}</Text>
                <Text fontSize = '22px' className='grayText font400'>{submission.language}</Text>
                <Text fontSize = '22px' className='grayText font400'>{submission.wpm}</Text>
                <Text fontSize = '22px' className='grayText font400'>{submission.accuracy}</Text>
        </div>
  )
}
