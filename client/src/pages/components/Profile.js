import React from 'react'

import {signOut} from 'firebase/auth'
import {auth} from './firebase'

export default function Profile() {
        console.log("test")
async function signout() {
        await signOut(auth);
        window.location.reload()
                
        }
  return (
        <div className = 'aboutContainer'>
                <div className = 'site-title'>Profile</div>
                <div>
                        Signout?
                       
                </div>
                <button onClick={signout}>Signout</button>
         </div>
        
  )
}
