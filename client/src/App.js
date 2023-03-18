import './App.css'
import Home from './pages/Home.js'
import React, {useState, useEffect} from 'react'
import NavBar from './pages/components/Navbar.js'
import About from './pages/About.js'
import Leaderboard from './pages/Leaderboard.js'
import Solutions from './pages/Solutions.js'
import { Routes, Route } from 'react-router-dom'

import {db} from './firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

import {
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react'








function App() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  
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
      <div>
        {submissions.map((submission) => {
          return (
            <div>
            {" "}
              <h1>{"title: " + submission.email}</h1>
            </div>
            
          )
        })}
      </div>
      <ChakraProvider theme={theme}>
        <NavBar/>
            <div className = 'pageContainer'>
              
              <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/about' element={<About/>} />
                <Route path='/leaderboard' element={<Leaderboard/>} />
                <Route path='/solutions' element={<Solutions/>} />
              </Routes>
            </div>
          
      </ChakraProvider>
      
    </>
  )
}

export default App;