import './App.css'
import Home from './pages/Home.js'
import React, {useState, useEffect} from 'react'
import NavBar from './pages/components/Navbar.js'
import About from './pages/About.js'
import Leaderboard from './pages/Leaderboard.js'
import Solutions from './pages/Solutions.js'
import UserLogin from './pages/components/UserLogin'
import Profile from './pages/components/Profile'
import { Routes, Route } from 'react-router-dom'

import {db} from './pages/components/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

import {
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react'








function App() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({});
  const auth = getAuth();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
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
    
    
  }, [])

  
  
  const theme = extendTheme({
    colors: {
      brand: {
        100: "#545e56",
        // ...
        900: "#1a202c",
      },
    },
  })
  console.log(loading)
  
    
  
  

  console.log("here: " + user)
  return (
    
   
    <>  
     
      <ChakraProvider theme={theme}>
        <NavBar loading={loading} user={user}/>
            <div className = 'pageContainer'>
              
              <Routes>
                <Route path='/' element={<Home submissions={submissions} user={user}/>} />
                <Route path='/about' element={<About/>} />
                <Route path='/leaderboard' element={<Leaderboard submissions={submissions} loading={loading} />} />
                <Route path='/solutions' element={<Solutions/>} />
                <Route path='/login' element={<UserLogin user={user} setUser={setUser}/>} />
                <Route path='/profile' element={<Profile user={user} setUser={setUser}/>} />
              </Routes>
            </div>
          
      </ChakraProvider>
      
    </>
  )
}

export default App;