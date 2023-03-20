import React, {useState, useEffect} from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { auth } from './firebase.js';
import { db } from './firebase';
import { getFirestore, doc, addDoc, getDocs, setDoc, collection} from 'firebase/firestore';
export default function UserLogin({user, setUser}) {

        const [registerEmail, setRegisterEmail] = useState("");
        const [registerPassword, setRegisterPassword] = useState("");
        const [loginEmail, setLoginEmail] = useState("");
        const [loginPassword, setLoginPassword] = useState("");
        const [username, setUsername] = useState("");
        const [errorMessage, setErrorMessage] = useState("");
        const [users, setUsers] = useState([]);
        const usersRef = collection(db, 'users');
      
        useEffect(() => {
          const getUsers = async () => {
            const data = await getDocs(usersCollectionRef)
            setUsers(data.docs.map(doc => (
              {...doc.data(), id: doc.id}
            )))
          }
          getUsers()
        }, [])
        const usersCollectionRef = collection(db, 'users')
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user)
          }
        })

        async function createNewUser(uid) {
          console.log('creating new user')
          await setDoc(doc(db, "users", uid),  {
            displayName: username, 
            email: registerEmail, 
            account_created: new Date().toLocaleString(),
            uid: uid
          });
          window.location.reload()
        }

        async function register() {
          try {
            
              
              
              
            let ok = true
            //eslint-disable-next-line
            users.map(user => {
              if (user.displayName === username) {
                ok = false
              }
            })
            if (!ok) return setErrorMessage('Username already in use')


            if (username === '') {
              setErrorMessage('Username cannot be empty')
              return
            }
            const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            await updateProfile(auth.currentUser, { displayName: username }).catch(
              (err) => console.log(err)
            );

            console.log(auth.currentUser.uid)
            setErrorMessage('')
            createNewUser(auth.currentUser.uid)
          } catch (error) {
                  
            console.log(error.message)
            if (error.message === 'Firebase: Error (auth/invalid-email).' || error.message === 'Firebase: Error (auth/internal-error).') {
              setErrorMessage('Invalid email')
            } else if (error.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
              setErrorMessage('Password should be at least 6 characters')
            } else if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
              setErrorMessage('Email already in use')
            }

          }
        }
        async function login() {
          try {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            
            console.log(user)
            setErrorMessage('')
          } catch (error) {
            if (error.message === 'Firebase: Error (auth/user-not-found).' || error.message === 'Firebase: Error (auth/invalid-email).') {
              setErrorMessage('Invalid email')
            } else if (error.message === 'Firebase: Error (auth/internal-error).' || error.message === 'Firebase: Error (auth/wrong-password).') {
              setErrorMessage('Incorrect password')
            } else if (error.message === 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).') {
              setErrorMessage(`Too many failed login attempts to ${loginEmail}. Please try again later.`)
            } 
            console.log(error.message)

          }
        }

        async function signout() {
          await signOut(auth);
          window.location.reload()
                
        }
        return (
          <div className="App maintext">
            <div>
              <h3> Register User </h3>
              
              <input
                className = 'correct'
                placeholder="Username"
                onChange={(event) => {setUsername(event.target.value)}}
              />
              <input
                className = 'correct'
                placeholder="Email"
                onChange={(event) => {setRegisterEmail(event.target.value)}}
              />
              <input
                className = 'correct'
                placeholder="Password"
                type='password'
                  onChange={(event) => {setRegisterPassword(event.target.value)}}
              />
            
            <button onClick={register}>Sign Up</button>
          
            </div>
      
            <div>
              <h3> Login </h3>
              <input
                className = 'correct'
                placeholder="Email"
                  onChange={(event) => {setLoginEmail(event.target.value)}}
                
              />
              <input
                className = 'correct'
                placeholder="Password"
                type='password'
                  onChange={(event) => {setLoginPassword(event.target.value)}}
              />
              <button onClick={login}>Log In</button>
            
      
          </div>
          <div>
            {user && user.displayName && <h3> User Logged in: {user.displayName}</h3>}
            <p className='currentIncorrect'>{errorMessage}</p>
          {user && user.email && <button onClick={signout}>Signout</button>}
              
            </div>
        

            </div>

              );
}

