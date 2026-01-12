import React, { useEffect, useRef } from "react";
import { usePopularMovies } from "../hooks/useMovies";
import { MoviePosterCard } from "../Components/MoviePosterCard";

export const MostPopular = () => {
  const { movies, loadMore, hasMore, loading, loadingMore, error } =
    usePopularMovies();
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center container-apple">
        <div className="text-white text-xl">Error loading movies</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-apple py-8 section-spacing">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">
            Popular Movies
          </h1>
          <p className="text-gray-400 text-lg">
            Discover the most popular movies right now
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="block">
                <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-space-gray/20 animate-pulse border-0 shadow-none outline-none">
                  {/* Rating skeleton - top right */}
                  <div className="absolute top-3 right-3 w-12 h-6 rounded-lg bg-space-gray-dark animate-pulse" />
                  {/* Certification skeleton - bottom left */}
                  <div className="absolute bottom-3 left-3 w-8 h-6 rounded-lg bg-space-gray-dark animate-pulse" />
                </div>
                <div className="mt-3 h-4 bg-space-gray-light rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Movies Grid */}
            {movies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 mb-8">
                  {movies.map((movie) => (
                    <MoviePosterCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Infinite Scroll Trigger */}
                <div ref={observerTarget} className="py-8">
                  {loadingMore && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                      {[...Array(15)].map((_, i) => (
                        <div key={`loading-${i}`} className="block">
                          <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-space-gray/20 animate-pulse border-0 shadow-none outline-none">
                            {/* Rating skeleton - top right */}
                            <div className="absolute top-3 right-3 w-12 h-6 rounded-lg bg-space-gray-dark animate-pulse" />
                            {/* Certification skeleton - bottom left */}
                            <div className="absolute bottom-3 left-3 w-8 h-6 rounded-lg bg-space-gray-dark animate-pulse" />
                          </div>
                          <div className="mt-3 h-4 bg-space-gray-light rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  )}
                  {!hasMore && movies.length > 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-lg">
                        You've reached the end
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No movies found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
