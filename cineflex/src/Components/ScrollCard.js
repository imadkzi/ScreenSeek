import React from 'react'
import placeholder from '../Assets/Placeholder.jpg'
import {Nav} from 'react-bootstrap'
import {NavLink} from 'react-router-dom';

export const ScrollCard = ({movie}) => {
    
    return (
        <div className="scroll-card center">
            <div className="scroll-card__poster">
            {movie.poster_path ? (
                <Nav.Link as={NavLink} exact={true} to={{pathname:`/film/${movie.id}`, state: movie.id }} className="hidden-link" >                
                <img className="poster" 
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                alt= {movie.title}
               />
               </Nav.Link>
            ) : (
                <Nav.Link as={NavLink} exact={true} to={{pathname:`/film/${movie.id}`, state: movie.id }} className="hidden-link" >                
                <img className="poster"
                 src={placeholder} 
                 alt= {movie.title}
                />
               </Nav.Link>
            )}
            </div>
            <div className="scroll-card__title">
                <h6 className="title">{movie.title}</h6>
            </div>
        </div>
    )
}
