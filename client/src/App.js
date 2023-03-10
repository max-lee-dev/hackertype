import './App.css'
import Home from './pages/Home.js'
import React from 'react'
import NavBar from './pages/components/Navbar.js'
import About from './pages/About.js'
import Leaderboard from './pages/Leaderboard.js'
import Solutions from './pages/Solutions.js'







function App() {
 
  let Compoonent
  switch (window.location.pathname) {
    case '/':
      Compoonent = Home
      break
    case '/about':
      Compoonent = About
      break
    default:
  }
  return (
   
    <>
      <NavBar/>
      <div className='pageContainer'>
        <Compoonent/>
      </div>
    </>
  )
}

export default App;