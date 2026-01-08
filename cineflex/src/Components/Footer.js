import React from 'react'
import tmdb from '../Assets/tmdb.svg'
import logo from '../Assets/logo-white.svg'

export const Footer = () => {
    return (
        <div className="footer center font-small py-4">
            <img className='footer__logo' src={logo} alt='CINEFLEX logo'></img>
            <img className='footer__logo' src={tmdb} alt='The Movie DB Logo'></img>
            <div className="footer__copyright center text-center">© 2021 Copyright:
                <p> Imad Kazi</p>
            </div>
        </div>
    )
}
