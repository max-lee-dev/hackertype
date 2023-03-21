import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {auth} from './firebase'
import ExternalLink from './ExternalLink'
import logo from './assets/favicon.ico';
import {Divider} from '@chakra-ui/react'
export default function Navbar() {
        const [user, setUser] = useState(null);
        
                
                        auth.onAuthStateChanged((user) => {
                        
                        if (user) {
                        setUser(user)
                        } else {
                        setUser(null)
                        }
                        })
                
                //eslint-disable-next-line
  return (
  <nav className='nav'>
        <div className='Logo' >
        <Link to="/">
                <img src={logo} width='80px' alt='Logo' />
        </Link>
                <Link to="/" className='site-title'>HackerType</Link>
        </div>

        <ul>
        <li>
        <Link to="/solutions">Solutions</Link>
        </li>
        <li>
        <Link to="/leaderboard">Leaderboard</Link>
        </li>
        <li>
        <Link to="/about">About</Link>
        </li>
        <li>
                {!user && <Link to="/login">Log In</Link>}
                {user && user.displayName && <Link to={`/profile/${user.displayName}`}>{user.displayName}</Link>}
        </li>
        
        
        
        
        
        </ul>
       
        
  </nav>
  )
}


