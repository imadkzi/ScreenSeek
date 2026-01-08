import React, {useState, useContext} from 'react'
import { GlobalContext } from '../context/GlobalState'
import placeholder from '../Assets/Placeholder.jpg'
import {Button, Alert, Nav} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faPlay, faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'
import {NavLink} from 'react-router-dom';

export const MovieCard = ({movie}) => {
    const [trailer, setTrailer] = useState();
    const {
        addToWatchlist,
        watchlist,
        addToFavourites,
        favourites,
    } = useContext(GlobalContext)

    let storedMovie = watchlist.find((o) => o.id === movie.id);
    let storedMovieFavourites = favourites.find((o) => o.id === movie.id);

    const watchlistDisabled = storedMovie ? true : false;
    const favouritesDisabled = storedMovieFavourites ? true : false;

    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`)
    .then((res) => res.json())
    .then((data) => {
        if (!data.errors) {
            setTrailer(data.results[0]?.key);   
        }else{
            <Alert variant="danger">Error</Alert>
        }
    })

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
                <p className="desc mobile-text">{movie.release_date}</p>
                <div className="card-btn">
                    <Button className="watch-btn" variant="primary" target="__blank" href={`https://www.youtube.com/watch?v=${trailer}`}><FontAwesomeIcon icon={faPlay} /> Trailer</Button>
                    <div className="icons center">
                        <NavLink exact={true} to="/favourites"> <button onClick={() => addToFavourites(movie)} disabled={favouritesDisabled} className="icon-btn"><FontAwesomeIcon icon={faHeart}/> </button> </NavLink>                                
                        <NavLink exact={true} to="/watchlist"> <button onClick={() => addToWatchlist(movie)} disabled={watchlistDisabled} className="icon-btn"><FontAwesomeIcon icon={faBookmark}/> </button> </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
