import React from "react";
import placeholder from "../Assets/Placeholder.jpg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useMovieCertification } from "../hooks/useMovies";

export const MoviePosterCard = ({ movie, onRemove, showRemoveButton }) => {
  const { certification } = useMovieCertification(movie.id);

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
        {percentage !== null && (
          <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold backdrop-blur-md">
            <FontAwesomeIcon
              icon={faStar}
              className="w-3 h-3 text-yellow-400"
            />
            <span>{percentage}%</span>
          </div>
        )}
        {certification && (
          <div className="absolute bottom-3 left-3 glass px-2.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border border-white/20">
            {certification}
          </div>
        )}
        {showRemoveButton && onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(movie.id);
            }}
            className="absolute top-2 left-2 bg-red-500/80 hover:bg-red-600 px-3 py-2 rounded-lg backdrop-blur-md border border-red-400/50 opacity-70 group-hover:opacity-100 transition-all duration-300 text-white z-20 shadow-lg"
            aria-label="Remove"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="mt-3 text-sm font-medium text-white line-clamp-2 group-hover:text-gray-300 transition-colors">
        {movie.title}
      </h3>
    </Link>
  );
};
