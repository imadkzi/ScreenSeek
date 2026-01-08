import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { MovieCard } from '../Components/MovieCard';
import { CustomPagination } from '../Components/CustomPagination';

export const MostPopular = () => {
    // eslint-disable-next-line
    const [page, setPage] = useState(1)
    const [popular, setPopular] = useState([]);

    useEffect (() => {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_KEY}&page=${page}&language=en-US&include_adult=false&region=GB`
        )
        .then((res) => res.json())
        .then((data) => {
            if (!data.errors) {
                setPopular(data.results);   
            }else{
                <Alert variant="danger">Error</Alert>
            }
        })
    },[page])

    return (
        <Container fluid className="mt">
            <h3 className="page-title">Popular Movies</h3>
            {popular && (
               <Row>
                   {popular.map(movie => (
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
