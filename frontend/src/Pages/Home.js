import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faTv } from "@fortawesome/free-solid-svg-icons";
import { MovieCarouselSection } from "../Components/MovieCarouselSection";
import {
  useFeaturedMovie,
  useTrendingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
} from "../hooks/useMovies";

export const Home = () => {
  const [showWatchProviders, setShowWatchProviders] = useState(false);

  const { movie: featured, watchProviders } = useFeaturedMovie();
  const { movies: trending } = useTrendingMovies("week", 20);
  const { movies: upcoming } = useUpcomingMovies(20);
  const { movies: topRated } = useTopRatedMovies(20);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showWatchProviders &&
        !event.target.closest(".watch-providers-dropdown")
      ) {
        setShowWatchProviders(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWatchProviders]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[85dvh] min-h-[600px] flex items-end container-apple section-spacing">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${featured.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-space-gray via-space-gray/80 to-transparent" />
          </div>

          <div className="relative z-10 w-full pb-4">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-semibold mb-4 tracking-tight text-white">
                {featured.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 line-clamp-3">
                {featured.overview}
              </p>
              <div className="flex gap-3 flex-wrap relative">
                {/* Watch Provider Button */}
                {watchProviders.flatrate.length > 0 ||
                watchProviders.rent.length > 0 ||
                watchProviders.buy.length > 0 ? (
                  <div className="relative watch-providers-dropdown">
                    <button
                      onClick={() => setShowWatchProviders(!showWatchProviders)}
                      className="px-6 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 hover:scale-105 transition-all duration-300 text-white bg-accent border border-accent/50 shadow-lg"
                    >
                      <FontAwesomeIcon icon={faTv} className="w-3.5 h-3.5" />
                      <span className="font-medium text-sm">Watch Now</span>
                    </button>

                    {/* Watch Providers Dropdown */}
                    {showWatchProviders && (
                      <div className="absolute top-full left-0 mt-2 glass rounded-xl p-4 min-w-[280px] backdrop-blur-md border border-white/20 shadow-2xl z-40">
                        <div className="space-y-4">
                          {/* Streaming (Flatrate) */}
                          {watchProviders.flatrate.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Stream
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {watchProviders.flatrate.map((provider) => (
                                  <a
                                    key={provider.provider_id}
                                    href={`https://www.themoviedb.org/movie/${featured.id}/watch`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 glass px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                                  >
                                    <img
                                      src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="h-6 w-auto object-contain"
                                      loading="lazy"
                                    />
                                    <span className="text-xs text-white">
                                      {provider.provider_name}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Rent */}
                          {watchProviders.rent.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Rent
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {watchProviders.rent.map((provider) => (
                                  <a
                                    key={provider.provider_id}
                                    href={`https://www.themoviedb.org/movie/${featured.id}/watch`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 glass px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                                  >
                                    <img
                                      src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="h-6 w-auto object-contain"
                                      loading="lazy"
                                    />
                                    <span className="text-xs text-white">
                                      {provider.provider_name}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Buy */}
                          {watchProviders.buy.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Buy
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {watchProviders.buy.map((provider) => (
                                  <a
                                    key={provider.provider_id}
                                    href={`https://www.themoviedb.org/movie/${featured.id}/watch`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 glass px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                                  >
                                    <img
                                      src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="h-6 w-auto object-contain"
                                      loading="lazy"
                                    />
                                    <span className="text-xs text-white">
                                      {provider.provider_name}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={`/film/${featured.id}`}
                    className="px-6 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 hover:scale-105 transition-all duration-300 text-white bg-accent border border-accent/50 shadow-lg"
                  >
                    <FontAwesomeIcon icon={faTv} className="w-3.5 h-3.5" />
                    <span className="font-medium text-sm">Watch Now</span>
                  </Link>
                )}
                {/* Learn More Button */}
                <Link
                  to={`/film/${featured.id}`}
                  className="px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-accent hover:border-accent hover:scale-105 transition-all duration-300 text-white border border-white/20 bg-transparent shadow-lg hover:shadow-xl"
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="w-3.5 h-3.5"
                  />
                  <span className="font-medium text-sm">Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="container-apple py-8 space-y-8">
        <MovieCarouselSection
          title="Trending Now"
          movies={trending}
          seeAllLink="/trending"
        />
        <MovieCarouselSection
          title="Coming Soon"
          movies={upcoming}
          seeAllLink="/upcoming"
        />
        <MovieCarouselSection
          title="Top Rated"
          movies={topRated}
          seeAllLink="/top-rated"
        />
      </div>
    </div>
  );
};
