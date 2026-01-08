import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MovieCard } from "../Components/MovieCard";
import { CustomPagination } from "../Components/CustomPagination";

export const TopRated = () => {
  const [page, setPage] = useState(1);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&page=${page}&language=en-US&region=GB`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setTopRated(data.results);
        }
      })
      .catch((error) => {
        console.error("Error fetching top rated movies:", error);
      });
  }, [page]);

  return (
    <Container fluid className="mt">
      <h3 className="page-title">Top Rated</h3>
      {topRated && (
        <Row>
          {topRated.map((movie) => (
            <Col className="movie-grid" key={movie.id}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      )}
      <CustomPagination setPage={setPage} />
    </Container>
  );
};
