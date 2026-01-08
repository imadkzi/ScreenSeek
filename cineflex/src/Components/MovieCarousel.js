import React, { useState, useEffect } from "react";
import { Carousel, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../sass/custom.scss";

export const MovieCarousel = () => {
  const [index, setIndex] = useState(0);
  const [hero, setHero] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_KEY}&page=1&language=en-US&region=GB`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setHero(data.results);
        }
      })
      .catch((error) => {
        console.error("Error fetching carousel data:", error);
      });
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {hero.slice(0, 6).map((heroitems) => (
        <Carousel.Item key={heroitems.id} interval={1000}>
          <img
            className="img-carousel"
            src={`https://image.tmdb.org/t/p/original/${heroitems.backdrop_path}`}
            alt={heroitems.title}
          />
          <Carousel.Caption className="center">
            <div className="d-flex flex-column details">
              <h3 className="hero-title">{heroitems.title}</h3>
              <p>{heroitems.overview}</p>
              <Button
                as={Link}
                to={`/film/${heroitems.id}`}
                className="btn btn-secondary watch-btn"
              >
                Watch
              </Button>
            </div>
            <div className="details-content__poster-container d-flex flex-row">
              <img
                className="poster"
                src={`https://image.tmdb.org/t/p/w500${heroitems.poster_path}`}
                alt={heroitems.title}
              />
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
