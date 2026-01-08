import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoviePosterCard } from "./MoviePosterCard";

export const Trending = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_KEY}&page=1&language=en-US&include_adult=false&region=GB`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setTrending(data.results);
        }
      })
      .catch((error) => {
        console.error("Error fetching trending movies:", error);
      });
  }, []);

  return (
    <div className="scroll-container films">
      <div className="scroll-container__heading">
        <h4>Trending</h4>
        <Link className="scroller-link" to={"/trending"}>
          See More
        </Link>
      </div>
      {trending && (
        <div className="scroller">
          {trending.slice(0, 15).map((movie) => (
            <MoviePosterCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}
    </div>
  );
};
