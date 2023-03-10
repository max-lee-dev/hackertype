import React from 'react'

export default function Navbar() {
  return <nav className='nav'>
        <a href='/' className='site-title'>HackerType</a>
        <ul>
                <li>            
                        <a href='/'>Solutions (WIP)</a>
                </li>
                <li>
                        <a href='/'>Leaderboard (WIP)</a>
                </li>
                <li>            
                        <a href='/about'>About</a>
                </li>
        </ul>
  </nav>
}
