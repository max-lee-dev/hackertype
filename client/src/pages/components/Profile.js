import React from 'react'

import {signOut, getAuth} from 'firebase/auth'
import {auth} from './firebase'
import {
        Button,
        Center,
        Stack,
        Text
} from '@chakra-ui/react'

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase"; // import your Firebase app instance

export default function Profile() {
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
                setLoading(true)
                async function getUserSettings() {
                        
                  const q = query(collection(db, "users"));
            
                  const querySnapshot = await getDocs(q);
                  querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data().displayName === username) setUserData(doc.data())
                  });
                }
                getUserSettings().then(() => setLoading(false))
                
              }, [username])

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
        }, [username])

        var date = new Date(profileUserData?.account_created)
        var dateArr = date.toDateString().split(' ');
  return (
                <Stack>
                        <div className = 'userTitleContainer'>
                                <Center>
                                <div className = 'userTitleCard aboutContainer'> 
                                        
                                        
                                        <div className = 'userTitle mainFont'>
                                                {!loading && !profileUserData && <Text fontSize = '56px'>User not found...</Text>}
                                                <Text fontSize = '56px'>{profileUserData?.displayName}</Text>
                                                {profileUserData && <Text fontSize = '22px'>Joined {dateArr[1]} {dateArr[2]}, {dateArr[3]}</Text>}
                                        </div>


                                        <div className = 'generalUserInfo mainFont'>
                                                <div>
                                                        <Text fontSize = '40px'>Average</Text>
                                                        {profileUserData?.average_wpm && <Text fontSize = '40px'>{profileUserData?.average_wpm} WPM</Text>}
                                                </div>

                                                <div>
                                                        <Text fontSize = '40px'>Started</Text>
                                                        <Text fontSize = '40px'>{profileUserData?.tests_started}</Text>
                                                </div>

                                                <div>
                                                        <Text fontSize = '40px'>Completed</Text>
                                                        <Text fontSize = '40px'>{profileUserData?.tests_completed}</Text>
                                                </div>
                                                
                                                
                                        </div>
                                </div>
                                </Center>
                        </div>
                        <div className = 'aboutContainer'> 
                        <Center>
                        {loading && <div className = 'site-title'>Loading...</div> }
                        


                        
                        {!loading && username === user?.displayName && <Button colorScheme={'red'} onClick={signout}>Signout</Button>}
                        </Center>

                        {!loading && profileUserData && <div className = 'about'>
                                <h1>WPM: {profileUserData?.wpm}</h1>
                                <h1>Accuracy: {profileUserData?.accuracy}</h1>
                                <h1>Last Language: {profileUserData?.lastLanguage}</h1>
                                <br/>
                        </div>}

                        
                        <div>
                                {!loading && profileUserData && <div className = 'smallerMainFont site-title correct'>Recent Submissions</div>}
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
         
        
  )
}
