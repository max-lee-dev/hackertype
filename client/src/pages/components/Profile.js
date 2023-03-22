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
import { collection, doc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase"; // import your Firebase app instance
import Submission from './Submission';

export default function Profile() {
        async function signout() {
                await signOut(auth);
                window.location.replace('/')
                        
        }
        

        const [profileUserData, setUserData] = useState(null);
        const auth = getAuth();
        const { username } = useParams();
        const [loading, setLoading] = useState(true)
        const [user, setUser] = useState({});
        const [recentSubmissions, setRecentSubmissions] = useState([]);
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
                async function getRecentSubmissions() {
                        const q = query(submissionsCollectionRef, where("user", "==", username))
                        const top = query(q, orderBy("date", "desc"), limit(3));
                        const recentQuerySnapshot = await getDocs(top);
                        const tempArray = []

                        recentQuerySnapshot.forEach((doc) => {
                                tempArray.push(doc.id)
                        })
                        setRecentSubmissions(tempArray)
                }
                getUserSettings()
                getRecentSubmissions().then(() => setLoading(false))
                
                
              }, [username])

        const submissionsCollectionRef = collection(db, 'submissions')
               
        var date = new Date(profileUserData?.account_created)
        var dateArr = date.toDateString().split(' ');

       
  return (
        <Stack>
                <div className = 'profileContainer'>
                        <div className = 'userTitleContainer'>
                        <Center>
                                        
                                <div className = 'userTitleCard aboutContainer'> 
                                        
                                        
                                        <div className = 'userTitle mainFont font500'>
                                                {!loading && !profileUserData && <Text fontSize = '56px'>User not found...</Text>}
                                                <Text fontSize = '56px'>{profileUserData?.displayName}</Text>
                                                {profileUserData && <Text fontSize = '22px' className='grayText font400'>Joined {dateArr[1]} {dateArr[2]}, {dateArr[3]}</Text>}
                                                <div className='signoutButton'>
                                                        {!loading && username === user?.displayName && <Button width={'75px'} fontSize="15px" colorScheme={'red'} onClick={signout}>Sign Out</Button>}
                                                </div>
                                        </div>

                                        <Stack>
                                        <div className = 'generalUserInfo mainFont'>
                                        <Stack direction = 'row' spacing = {24}>
                                                <div className = 'generalInfoCard'>
                                                {profileUserData?.average_wpm && <Text fontSize = '36px' className ='font400'>{profileUserData?.average_wpm}</Text>}
                                                        <Text fontSize = '22px' className='grayText font400' >Average WPM</Text> 
                                                        
                                                </div>

                                                <div className = 'generalInfoCard'>
                                                        
                                                        <Text fontSize = '36px' className ='font400'>{profileUserData?.tests_started}</Text>
                                                        <Text fontSize = '22px' className='grayText font400' >Started</Text>
                                                </div>

                                                <div className = 'generalInfoCard'>
                                                        
                                                        <Text fontSize = '36px' className ='font400'>{profileUserData?.tests_completed}</Text>
                                                        <Text fontSize = '22px' className='grayText font400'>Completed</Text>
                                                </div>
                                                
                                        </Stack>   
                                        </div>
                                        </Stack>   
                                        
                                </div>
                                
                                </Center>
                        </div>
                        <div className = 'graphContentContainer'>
                                <div className = 'graphContainer'> 
                                        <Center>
                                        <div className = 'graphCard aboutContainer'>
                                                <div className = 'graphTitle mainFont font500'>
                                                        <Text fontSize = '36px'>Graph</Text>
                                                </div>
                                        </div>
                                        </Center>
                                </div>
                        </div>
                        <Center>
                        <div className = 'submissionContentContainer'>
                                <div className = 'submissionContainer'>
                                        <div className = 'submissionCard aboutContainer'>
                                                <Stack direction={'row'} spacing='450px' justifyContent='space-evenly'>
                                                <div className = 'recentSubmissionsContainer mainFont font500'>
                                                        <Text fontSize = '36px'>Recent</Text>
                                                        {!loading && recentSubmissions[0] && <Submission
                                                                uid={recentSubmissions[0]}
                                                        />}
                                                        {!loading && recentSubmissions[1] &&  <Submission
                                                                uid={recentSubmissions[1]}
                                                        />}
                                                        {!loading && recentSubmissions[2] && <Submission
                                                                uid={recentSubmissions[2]}
                                                        />}
                                                </div>
                                                <div className = 'recentSubmissionsContainer mainFont font500'>
                                                        <Text fontSize = '36px'>Best</Text>
                                                </div>
                                                </Stack>
                                        </div>
                                        
                                </div>
                        </div>  
                        </Center>

                        <div className = 'aboutContainer'> 
                        <Center>
                        {loading && <div className = 'site-title'>Loading...</div> }
                        


                        
                       
                        </Center>
                </div>

                        {/* {!loading && profileUserData && <div className = 'about'>
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
                                        
                                

                        </div> */}
                        </div>
                </Stack>
         
        
  )
}
