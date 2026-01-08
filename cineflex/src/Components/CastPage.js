import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router';
import { Alert } from 'react-bootstrap';
import { ScrollCard } from './ScrollCard';
import placeholder from '../Assets/Cast-P.png'

export const CastPage = () => {
    const [person, setPerson] = useState([]);
    const [credits, setCredits] = useState([]);
    const location = useLocation(); 

    useEffect( () => { 
        fetch(`https://api.themoviedb.org/3/person/${location.state}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&append_to_response=movie_credits`)
        .then((res) => res.json())
        .then((data) => {
            if (!data.errors) {
                setPerson(data); 
                setCredits(data.movie_credits.cast) 
            }else{
                <Alert variant="danger">Error</Alert>
            }
        })
    // eslint-disable-next-line
    }, [])

    return (
        <div>
            <div className="person-info center mt">
                <div className="person-info_poster"> 
                    {person.profile_path ? (
                        <img className="poster" 
                            src={`https://image.tmdb.org/t/p/w300/${person.profile_path}`} 
                            alt= {person.name}
                        />
                    ) : (
                        <img className="poster" 
                            src={placeholder} 
                            alt= {person.name}
                        />
                    )}
                </div>
                <div className="person-info__details center">
                    <h2 className='title'>{person.name}</h2>
                    <div className='personal'>
                        <div className='details center'>
                            <p className='header'>D.O.B</p>
                            <p>{person.birthday}</p>
                        </div>
                        <div className='details center'>
                            <p className='header'>Place of birth</p>
                            <p>{person.place_of_birth}</p>
                        </div>
                        <div className='details center'>
                            <p className='header'>Known for</p>
                            <p>{person.known_for_department}</p>
                        </div>
                    </div>
                    <div className='biography'>
                        <h5>Biography</h5>
                        <p>{person.biography}</p>
                    </div>
                    <div className='scroll-container cast films'>
                        <h4>Credits</h4>
                        {credits && (
                            <div className='scroller' >
                                {credits.slice(0,20).map(movie => (
                                    <ScrollCard movie={movie} key={movie.id}/>
                                ))}
                            </div>       
                        )}
                    </div>
                </div>        
            </div>           
        </div>
    )
}
