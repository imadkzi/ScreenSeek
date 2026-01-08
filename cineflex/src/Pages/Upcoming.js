import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MovieCard } from "../Components/MovieCard";
import { CustomPagination } from "../Components/CustomPagination";

export const Upcoming = () => {
  const [page, setPage] = useState(1);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${page}&region=GB`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setUpcoming(data.results);
        }
      })
      .catch((error) => {
        console.error("Error fetching upcoming movies:", error);
      });
  }, [page]);

  return (
    <Container fluid className="mt">
      <h3 className="page-title">Upcoming</h3>
      {upcoming && (
        <Row>
          {upcoming.map((movie) => (
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
