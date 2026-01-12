import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MoviePosterCard } from "../Components/MoviePosterCard";

export const Favourites = () => {
  const { favourites, removeFromFavourites } = useContext(GlobalContext);

  return (
    <div className="min-h-screen">
      <div className="container-apple py-8 section-spacing">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">
            Favourites
          </h1>
          <p className="text-gray-400 text-lg">
            {favourites.length > 0
              ? `${favourites.length} favourite movie${
                  favourites.length !== 1 ? "s" : ""
                }`
              : "Your favourite movies will appear here"}
          </p>
        </div>

        {/* Movies Grid */}
        {favourites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {favourites.map((movie) => (
              <MoviePosterCard
                key={movie.id}
                movie={movie}
                onRemove={removeFromFavourites}
                showRemoveButton={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="glass rounded-2xl p-8 md:p-12 backdrop-blur-md max-w-md mx-auto">
              <p className="text-gray-400 text-lg mb-2">No favourites yet</p>
              <p className="text-gray-500 text-sm">
                Start adding movies to your favourites to save them here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
