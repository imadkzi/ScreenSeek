import React, {useContext} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { GlobalContext } from '../context/GlobalState'
import { MovieCardSmall } from '../Components/MovieCardSmall'

export const WatchList = ({type}) => {

    const {watchlist} = useContext(GlobalContext)

    return (
        <Container fluid className="mt content">
            <h3 className="page-title">Watchlist</h3>
            {watchlist.length > 0 ? (
                <Row>
                   {watchlist.map(movie => (
                        <Col className="movie-grid" key={movie.id}>
                            <MovieCardSmall type="watchlist" movie={movie}/>
                        </Col>
                    ))}
                </Row>    
            ) : (
                <h4 className='page-title'>No movies in your watchlist</h4>
            )}
        </Container>
    )
}
