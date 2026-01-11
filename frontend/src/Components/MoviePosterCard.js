import React, { useState, useEffect } from "react";
import placeholder from "../Assets/Placeholder.jpg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const MoviePosterCard = ({ movie }) => {
  const [certification, setCertification] = useState(null);

  useEffect(() => {
    // Fetch certification for UK region
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${process.env.REACT_APP_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors && data.results) {
          const ukRelease = data.results.find((x) => x.iso_3166_1 === "GB");
          if (ukRelease?.release_dates) {
            // Find the first release date with a certification
            const certifiedRelease = ukRelease.release_dates.find(
              (rd) => rd.certification && rd.certification.trim() !== ""
            );
            if (certifiedRelease?.certification) {
              setCertification(certifiedRelease.certification);
            }
          }
        }
      })
      .catch((error) => {
        // Silently fail - certification is optional
        console.error("Error fetching certification:", error);
      });
  }, [movie.id]);

  const percentage = movie.vote_average
    ? Math.round(movie.vote_average * 10)
    : null;

  return (
    <Link
      to={`/film/${movie.id}`}
      className="group block transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative overflow-hidden rounded-2xl glass aspect-[2/3] transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-white/20 group-hover:border-white/30">
        {movie.poster_path ? (
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <img
            className="w-full h-full object-cover"
            src={placeholder}
            alt={movie.title}
            loading="lazy"
          />
        )}
        {/* Rating Percentage - Top Right */}
        {percentage !== null && (
          <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold backdrop-blur-md">
            <FontAwesomeIcon
              icon={faStar}
              className="w-3 h-3 text-yellow-400"
            />
            <span>{percentage}%</span>
          </div>
        )}
        {/* UK Certification - Bottom Left */}
        {certification && (
          <div className="absolute bottom-3 left-3 glass px-2.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border border-white/20">
            {certification}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="mt-3 text-sm font-medium text-white line-clamp-2 group-hover:text-gray-300 transition-colors">
        {movie.title}
      </h3>
    </Link>
  );
};
