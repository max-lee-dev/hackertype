import React from 'react'

import {signOut, getAuth} from 'firebase/auth'
import {auth} from './firebase'
import {
        Button,
        Center,
        Stack
} from '@chakra-ui/react'

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase"; // import your Firebase app instance

export default function Profile({}) {
        async function signout() {
                await signOut(auth);
                window.location.replace('/')
                        
        }
        

        const [profileUserData, setUserData] = useState(null);
        const auth = getAuth();
        const { username } = useParams();
        const [loading, setLoading] = useState(true)
        const [submissions, setSubmissions] = useState([]);
        const [user, setUser] = useState({});
        useEffect(() => {
                auth.onAuthStateChanged((user) => {
                if (user) {
                        
                        setUser(user)
                } else {
                        setUser(null)
                }
        })
        //eslint-disable-next-line
        }, [loading])
        
        useEffect(() => {
                async function getUserSettings() {
                        
                  const q = query(collection(db, "users"));
            
                  const querySnapshot = await getDocs(q);
                  querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data().displayName === username) setUserData(doc.data())
                  });
                }
                getUserSettings()
                
              }, [])

        const submissionsCollectionRef = collection(db, 'submissions')
                useEffect(() => {
                setLoading(true)
                const getSubmissions = async () => {
                const data = await getDocs(submissionsCollectionRef)
                setSubmissions(data.docs.map(doc => (
                        {...doc.data(), id: doc.id}
                )))
                }
                getSubmissions().then(() => setLoading(false))
                
                //eslint-disable-next-line
        }, [])


  return (
        <Center>
                <Stack>
                <div className = 'aboutContainer'>
                        {loading && <div className = 'site-title'>Loading...</div>}
                        


                        <div className = 'site-title correct'>{profileUserData?.displayName}</div>
                        {!loading && !profileUserData && <div className = 'site-title'>User not found...</div>}
                        {!loading && username === user?.displayName && <Button colorScheme={'red'} onClick={signout}>Signout</Button>}
                        

                        {!loading && profileUserData && <div className = 'about'>
                                <h1>WPM: {profileUserData?.wpm}</h1>
                                <h1>Accuracy: {profileUserData?.accuracy}</h1>
                                <h1>Last Language: {profileUserData?.lastLanguage}</h1>
                                <br/>
                        </div>}

                        
                        <div>
                                {!loading && profileUserData && <div className = 'site-title correct'>Recent Submissions</div>}
                                {submissions.map(submission => {
                                        if (submission.user === profileUserData?.displayName) {
                                                return (
                                                        <div key={submission.id}>
                                                                <br/>
                                                                <h1>{submission.user}</h1>
                                                                <h1>{submission.solution_id}</h1>
                                                                <h1>WPM: {submission.wpm}</h1>
                                                        </div>
                                                )
                                        }
                                        return ''
                                })}
                                        
                                

                        </div>
                </div>
                </Stack>
         </Center>
         
        
  )
}
