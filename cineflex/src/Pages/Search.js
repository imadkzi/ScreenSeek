import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieCard } from "../Components/MovieCard";
import { CustomPagination } from "../Components/CustomPagination";

export const Search = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState();
  const [results, setResults] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) return;
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&page=${page}&language=en-US&include_adult=false&query=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          console.log(data);
          setResults(data.results || []);
          setNumPage(data.total_pages);
        }
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  }, [page, query]);

  return (
    <div>
      <div className="mt content">
        <h3 className="page-title">Results for '{query}'</h3>
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((movie) => (
              <div className="movie-grid" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
      <CustomPagination setPage={setPage} numOfPages={numPage} />
    </div>
  );
};
