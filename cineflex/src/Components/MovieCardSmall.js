import React, {useContext} from 'react'
import { GlobalContext } from '../context/GlobalState'
import placeholder from '../Assets/Placeholder.jpg'
import {Nav} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import {NavLink} from 'react-router-dom';

export const MovieCardSmall = ({movie, type}) => {
    const {
        removeFromWatchlist,
        removeFromFavourites,
    } = useContext(GlobalContext)

    return (
        <div className="movie-card">
            <div className="poster-container">
                <span className="rating center translate-middle rounded-pill">
                    <FontAwesomeIcon icon={faStar} className="star"/>
                    {movie.vote_average}
                </span>
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
            <div className="content-container center">
                <Nav.Link as={NavLink} exact={true} to={{pathname:`/film/${movie.id}`, state: movie.id }} className="hidden-link" >                
                    <h2 className="title mobile-text">{movie.title}</h2>
                </Nav.Link>
                <p className="desc mobile-text">{movie.release_date.substring(0,4)}</p>
                <div className="card-btn">
                    <div className="icons center">
                        {type === "favourites" && (
                            <button onClick={() => 
                                removeFromFavourites(movie.id)} 
                                className="remove-btn btn btn-danger center">
                                    Remove
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                        {type === "watchlist" && (
                            <button onClick={() => 
                                removeFromWatchlist(movie.id)}
                                className="remove-btn btn btn-danger center">
                                    Remove
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
