import React, {useState, useEffect} from 'react';
// eslint-disable-next-line
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { MovieCard } from '../Components/MovieCard';
import { CustomPagination } from '../Components/CustomPagination';

export const NowPlaying = () => {
    const [page, setPage] = useState(1);
    // eslint-disable-next-line
    const [nowPlaying, setNowPlaying] = useState([]);

    useEffect (()=>{
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${page}&region=GB`
        )
        .then((res) => res.json())
        .then((data) => {
            if (!data.errors) {
                setNowPlaying(data.results);   
            }else{
                <Alert variant="danger">Error</Alert>
            }
        })
    },[page])

    return (
        <Container fluid className="mt">
            <h3 className="page-title">Now Playing In Theaters</h3>
            {nowPlaying && (
                <Row>
                   {nowPlaying.map(movie => (
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
