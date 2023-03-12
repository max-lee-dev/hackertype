import './App.css'
import Home from './pages/Home.js'
import React from 'react'
import NavBar from './pages/components/Navbar.js'
import About from './pages/About.js'
import Leaderboard from './pages/Leaderboard.js'
import Solutions from './pages/Solutions.js'
import { Routes, Route } from 'react-router-dom'
import {
  ChakraProvider,
  extendTheme,
  VStack
} from '@chakra-ui/react'







function App() {
 
  const theme = extendTheme({
    colors: {
      brand: {
        100: "#545e56",
        // ...
        900: "#1a202c",
      },
    },
  })
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