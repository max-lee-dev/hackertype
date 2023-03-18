import './App.css'
import Home from './pages/Home.js'
import React, {useState, useEffect} from 'react'
import NavBar from './pages/components/Navbar.js'
import About from './pages/About.js'
import Leaderboard from './pages/Leaderboard.js'
import Solutions from './pages/Solutions.js'
import { Routes, Route } from 'react-router-dom'
import firebase from './firebase'
import database from './firebase';
import { getFirestore } from 'firebase/firestore'
import db from "./firebase";

import { doc, onSnapshot, collection, query, where, Unsubscribe } from "firebase/firestore";


import {
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react'








function App() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)
    db.collection("submissions").onSnapshot((snapshot) => {
      setSubmissions(snapshot.docs.map((doc) => doc.data()))
    })
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
  console.log("hi: " + submissions)
  if (loading) {
    return <h1>Loading...</h1>
  }


  
  return (
   
    <>  
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