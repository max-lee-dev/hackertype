import './App.css'
import Home from './pages/Home.js'
import React from 'react'
import NavBar from './pages/components/Navbar.js'
import About from './pages/About.js'
import Leaderboard from './pages/Leaderboard.js'
import Solutions from './pages/Solutions.js'
import { Route, Routes } from 'react-router-dom'







function App() {
 
 
  return (
   
    <>
      <NavBar/>
      <div className='pageContainer'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
          <Route path='/solutions' element={<Solutions/>}/>
          
        </Routes>
      </div>
    </>
  )
}

export default App;