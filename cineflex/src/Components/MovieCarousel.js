import React, {useState} from 'react'
// eslint-disable-next-line
import { Carousel, Alert, Button } from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import '../sass/custom.scss';

export const MovieCarousel = () => {
    const [index, setIndex] = useState(0);
    // eslint-disable-next-line
    const [hero, setHero] = useState([]);

    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_KEY}&page=1&language=en-US&region=GB`
    )
    .then((res) => res.json())
    .then((data) => {
        if (!data.errors) {
            setHero(data.results);   
        }else{
              <Alert variant="danger">Error</Alert>
        }
    });

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };



    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
        {hero.slice(0,6).map (heroitems=>
            <Carousel.Item key={heroitems.id} interval={1000}>
            <img
            className="img-carousel"
            src={`https://image.tmdb.org/t/p/original/${heroitems.backdrop_path}`} 
            alt={heroitems.title}
            />
            <Carousel.Caption className='center'>
            <div className="d-flex flex-column details">
                    <h3 className="hero-title">{heroitems.title}</h3>
                    <p>{heroitems.overview}</p>
                    <Button 
                    as={NavLink} 
                    exact={true} 
                    to={
                            {
                                pathname:`/film/${heroitems.id}`, 
                                state: heroitems.id 
                            }
                        } 
                    className="btn btn-secondary watch-btn">
                        Watch
                    </Button> 
                </div>
                <div className="details-content__poster-container d-flex flex-row"> 
                    <img className="poster" 
                        src={`https://image.tmdb.org/t/p/w500${heroitems.poster_path}`} 
                        alt= {heroitems.title}
                    />
                </div>
            </Carousel.Caption>
            </Carousel.Item>
        )}
        </Carousel>
    );
}
