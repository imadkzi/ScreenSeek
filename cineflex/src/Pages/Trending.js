import React, {useState, useEffect} from 'react';
// eslint-disable-next-line
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { MovieCard } from '../Components/MovieCard';
import { CustomPagination } from '../Components/CustomPagination';

export const Trending = () => {
    const [page, setPage] = useState(1);
    // eslint-disable-next-line
    const [trending, setTrending] = useState([]);

    useEffect (()=>{
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_KEY}&page=${page}&language=en-US&include_adult=false&region=GB`
        )
        .then((res) => res.json())
        .then((data) => {
            if (!data.errors) {
                setTrending(data.results);   
            }else{
                <Alert variant="danger">Error</Alert>
            }
        })
    },[page])

    return (
        <Container fluid className="mt">
            <h1 className="page-title">Trending</h1>
            {trending && (
                <Row>
                   {trending.map(movie => (
                        <Col className="movie-grid" key={movie.id}>
                            <MovieCard movie={movie}/>
                        </Col>
                    ))}
                </Row>    
            )}
            <CustomPagination setPage={setPage} />
        </Container>
    )
}
