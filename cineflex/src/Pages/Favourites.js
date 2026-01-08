import React, {useContext} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { GlobalContext } from '../context/GlobalState'
import { MovieCardSmall } from '../Components/MovieCardSmall'

export const Favourites = () => {

    const {favourites} = useContext(GlobalContext)

    return (
        <Container fluid className="mt content">
            <h3 className="page-title">Your favourite films</h3>
            {favourites.length > 0 ? (
                <Row>
                   {favourites.map(movie => (
                        <Col className="movie-grid" key={movie.id}>
                            <MovieCardSmall type="favourites" movie={movie}/>
                        </Col>
                    ))}
                </Row>    
            ) : (
                <h4 className='page-title'>No movies in your favourites</h4>
            )}
        </Container>
    )
}
