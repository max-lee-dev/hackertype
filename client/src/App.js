import './App.css'
import Home from './pages/Home.js'
import React, {useState, useEffect} from 'react'
import NavBar from './pages/components/Navbar.js'
import About from './pages/About.js'
import Leaderboard from './pages/Leaderboard.js'
import Solutions from './pages/Solutions.js'
import UserLogin from './pages/components/UserLogin'
import { Routes, Route } from 'react-router-dom'

import {db} from './pages/components/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

import {
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react'








function App() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  
  const submissionsCollectionRef = collection(db, 'submissions')
  useEffect(() => {
    setLoading(true)
    const getSubmissions = async () => {
      const data = await getDocs(submissionsCollectionRef)
      setSubmissions(data.docs.map(doc => (
        {...doc.data(), id: doc.id}
      )))
    }
    getSubmissions()
    setLoading(false)

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
  
    
  
  if (loading) {
    return <h1 className='reminder'>Loading...</h1>
  }

  
  return (
   
    <>  
     
      <ChakraProvider theme={theme}>
        <NavBar/>
            <div className = 'pageContainer'>
              
              <Routes>
                <Route path='/' element={<Home submissions={submissions} />} />
                <Route path='/about' element={<About/>} />
                <Route path='/leaderboard' element={<Leaderboard submissions={submissions} />} />
                <Route path='/solutions' element={<Solutions/>} />
                <Route path='/login' element={<UserLogin/>} />
              </Routes>
            </div>
          
      </ChakraProvider>
      
    </>
  )
}

export default App;