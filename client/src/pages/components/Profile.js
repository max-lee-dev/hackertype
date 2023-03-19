import React from 'react'

import {signOut} from 'firebase/auth'
import {auth} from './firebase'

export default function Profile({user, loading, submissions}) {
        console.log("test")
async function signout() {
        await signOut(auth);
        window.location.replace('/')
                
        }
  return (
        <div className = 'aboutContainer'>
                <div className = 'site-title'>Profile</div>
                <div>
                        Signout?
                       
                </div>
                <button onClick={signout}>Signout</button>
                {loading && <div className = 'site-title'>Loading...</div>}



                <div>
                        {submissions.map(submission => {
                                if (submission.user === user.displayName) {
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
         
        
  )
}
