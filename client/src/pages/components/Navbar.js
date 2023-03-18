import React from 'react'
import ExternalLink from './ExternalLink'

export default function Navbar() {


  return <nav className='nav'>
        <div className='Logo' >
        <ExternalLink
                isExternal={false}
                href='/'
                gridColumn={0} // additional prop passed in
        />
        <a href='/' className='site-title'>HackerType</a>
        </div>
        <ul>
                         
                <CustomLink href='/solutions'>Solution Set (WIP)</CustomLink>
                <CustomLink href='/leaderboard'>Leaderboard (WIP)</CustomLink>
                <CustomLink href='/about'>About</CustomLink>
                <CustomLink href='/login'>Login</CustomLink>
                
        </ul>
  </nav>
}

function CustomLink({href, children, ...props}) {
        
        const path = window.location.pathname
        
        return (
                <li className={path === href ? 'activePage' : ''}>            
                        <a href={href} {...props}>{children}</a>
                </li>
        )
}
