import React, {useState,useEffect} from 'react'
import { Alert } from 'react-bootstrap';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
import { ScrollCard } from './ScrollCard';

export const Upcoming = () => {
    const [upcoming, setUpcoming] = useState([]);
    
    useEffect( () => { 
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1&region=GB`
        )
        .then((res) => res.json())
        .then((data) => {
            if (!data.errors) {
                setUpcoming(data.results);
                console.log(data.results)   
            }else{
                <Alert variant="danger">Error</Alert>
            }
        });
    // eslint-disable-next-line
    }, [])

    return (
        <div className="scroll-container films">
                <div className='scroll-container__heading'>
                    <h4>Upcoming</h4>
                    <Link className='scroller-link' to={"/upcoming"}>See More</Link>
                </div>
                {upcoming && (
                   <div className='scroller' >
                       {upcoming.slice(0,15).map(movie => (
                            <ScrollCard movie={movie} key={movie.id}/>
                        ))}
                   </div>       
                )}
        </div>
    )
}
