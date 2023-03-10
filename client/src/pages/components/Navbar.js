import React from 'react'

export default function Navbar() {


  return <nav className='nav'>
        <a href='/' className='site-title'>HackerType</a>
        <ul>
                         
                <CustomLink href='/solutions'>Solution Set (WIP)</CustomLink>
                <CustomLink href='/leaderboard'>Leaderboard (WIP)</CustomLink>
                <CustomLink href='/about'>About</CustomLink>
                
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
