import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPlay,
  faHeart,
  faBookmark,
  faCalendar,
  faClock,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import { MovieCarouselSection } from "../Components/MovieCarouselSection";
import { useMovieDetails } from "../hooks/useMovies";
import placeholder from "../Assets/Cast-P.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export const FilmPage = () => {
  const { id } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);
  const [backdropLoaded, setBackdropLoaded] = useState(false);

  const {
    movie,
    genres,
    cast,
    trailerKey,
    recommendations,
    watchProviders,
    certification,
    backdropImage,
    loading,
    error,
  } = useMovieDetails(id);

  const { addToWatchlist, watchlist, addToFavourites, favourites } =
    useContext(GlobalContext);

  const watchlistDisabled = watchlist.some((m) => m.id === movie?.id);
  const favouritesDisabled = favourites.some((m) => m.id === movie?.id);

  // Scroll to top when movie ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setBackdropLoaded(false); // Reset backdrop loaded state
  }, [id]);

  // Also scroll when movie data loads
  useEffect(() => {
    if (movie) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [movie]);

  const percentage = movie?.vote_average
    ? Math.round(movie.vote_average * 10)
    : null;

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCertificationColor = (cert) => {
    if (!cert) return "bg-gray-500";

    const certUpper = cert.toUpperCase();

    // UK certification colors
    if (certUpper === "U") return "bg-green-500";
    if (certUpper === "PG") return "bg-yellow-500";
    if (certUpper === "12" || certUpper === "12A") return "bg-blue-500";
    if (certUpper === "15") return "bg-orange-500";
    if (certUpper === "18") return "bg-red-500";

    // Default for other certifications
    return "bg-gray-500";
  };

  if (error || (!loading && !movie)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Error loading movie</div>
      </div>
    );
  }

  // Skeleton loading state
  if (loading || !movie) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative h-[85vh] min-h-[600px] flex items-end container-apple section-spacing mt-6">
          <div className="absolute inset-0 bg-space-gray rounded-3xl overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-space-gray via-space-gray/90 to-transparent" />
          </div>

          <div className="relative z-10 w-full pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              {/* Poster Skeleton */}
              <div className="lg:col-span-3 flex justify-center lg:justify-start">
                <div className="glass rounded-2xl overflow-hidden shadow-2xl w-full max-w-xs aspect-[2/3] bg-space-gray-light animate-pulse" />
              </div>

              {/* Info Skeleton */}
              <div className="lg:col-span-9">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-3/4 bg-space-gray-light rounded-lg animate-pulse" />
                  <div className="w-12 h-12 rounded-full bg-space-gray-light animate-pulse" />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="h-8 w-24 bg-space-gray-light rounded-lg animate-pulse" />
                  <div className="h-8 w-32 bg-space-gray-light rounded-lg animate-pulse" />
                  <div className="h-8 w-20 bg-space-gray-light rounded-lg animate-pulse" />
                </div>
                <div className="flex gap-2 mb-6">
                  <div className="h-8 w-20 bg-space-gray-light rounded-full animate-pulse" />
                  <div className="h-8 w-24 bg-space-gray-light rounded-full animate-pulse" />
                  <div className="h-8 w-16 bg-space-gray-light rounded-full animate-pulse" />
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-space-gray-light rounded animate-pulse" />
                  <div className="h-4 w-full bg-space-gray-light rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-space-gray-light rounded animate-pulse" />
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-32 bg-space-gray-light rounded-full animate-pulse" />
                  <div className="h-10 w-10 bg-space-gray-light rounded-full animate-pulse" />
                  <div className="h-10 w-10 bg-space-gray-light rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections Skeleton */}
        <div className="container-apple py-8 space-y-12">
          <div>
            <div className="h-8 w-48 bg-space-gray-light rounded-lg mb-6 animate-pulse" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-lg p-3 h-24 bg-space-gray-light animate-pulse"
                />
              ))}
            </div>
          </div>
          <div>
            <div className="h-8 w-32 bg-space-gray-light rounded-lg mb-6 animate-pulse" />
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-lg w-32 aspect-[2/3] bg-space-gray-light animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{movie.title} | Cineflex</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end container-apple section-spacing">
        <div
          className="absolute inset-0 overflow-hidden"
          key={`backdrop-${movie.id}`}
        >
          {/* Placeholder while loading */}
          {!backdropLoaded && (
            <div className="absolute inset-0 bg-space-gray" />
          )}

          {/* Backdrop image with fade-in */}
          {(backdropImage || movie.backdrop_path || movie.poster_path) && (
            <img
              src={
                backdropImage
                  ? `https://image.tmdb.org/t/p/original/${backdropImage}?v=${movie.id}`
                  : movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}?v=${movie.id}`
                  : `https://image.tmdb.org/t/p/original/${movie.poster_path}?v=${movie.id}`
              }
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                backdropLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setBackdropLoaded(true)}
              onError={() => setBackdropLoaded(true)}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-space-gray via-space-gray/90 to-transparent" />
        </div>

        <div className="relative z-10 w-full pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Poster */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="glass rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-9">
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                  {movie.title}
                </h1>
                {certification && (
                  <div
                    className={`${getCertificationColor(
                      certification
                    )} w-12 h-12 rounded-full text-base font-bold shadow-lg flex items-center justify-center`}
                  >
                    {certification}
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
                {percentage !== null && (
                  <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm backdrop-blur-md">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="w-4 h-4 text-yellow-400"
                    />
                    <span className="font-semibold">{percentage}%</span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="glass px-4 py-1.5 rounded-full text-sm backdrop-blur-md border border-white/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-lg text-gray-300 mb-6 line-clamp-3">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap mb-6">
                {trailerKey && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="px-6 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-all duration-300 text-white bg-accent border border-accent/50 shadow-lg"
                  >
                    <FontAwesomeIcon icon={faPlay} className="w-3.5 h-3.5" />
                    <span className="font-medium text-sm">Watch Trailer</span>
                  </button>
                )}
                <button
                  onClick={() => addToFavourites(movie)}
                  disabled={favouritesDisabled}
                  className="glass px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300 text-white border border-white/20 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => addToWatchlist(movie)}
                  disabled={watchlistDisabled}
                  className="glass px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300 text-white border border-white/20 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faBookmark} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 glass px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              Close
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={`${movie.title} Trailer`}
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="container-apple py-8 space-y-12">
        {/* Watch Providers Grid */}
        {(watchProviders.flatrate.length > 0 ||
          watchProviders.rent.length > 0 ||
          watchProviders.buy.length > 0) && (
          <section>
            <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faTv} className="w-6 h-6" />
              Where to Watch
            </h2>
            <div className="space-y-6">
              {/* Streaming */}
              {watchProviders.flatrate.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                    Stream
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                    {watchProviders.flatrate.map((provider) => (
                      <a
                        key={provider.provider_id}
                        href={`https://www.themoviedb.org/movie/${movie.id}/watch`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass rounded-lg p-3 hover:bg-white/20 transition-all duration-300 flex flex-col items-center gap-2 group"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="h-10 w-auto object-contain group-hover:scale-110 transition-transform"
                          loading="lazy"
                        />
                        <span className="text-xs text-white text-center font-medium line-clamp-1">
                          {provider.provider_name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Rent & Buy Combined */}
              {(watchProviders.rent.length > 0 ||
                watchProviders.buy.length > 0) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                    Buy or Rent
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                    {[...watchProviders.rent, ...watchProviders.buy]
                      .filter(
                        (provider, index, self) =>
                          index ===
                          self.findIndex(
                            (p) => p.provider_id === provider.provider_id
                          )
                      )
                      .map((provider) => (
                        <a
                          key={provider.provider_id}
                          href={`https://www.themoviedb.org/movie/${movie.id}/watch`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass rounded-lg p-3 hover:bg-white/20 transition-all duration-300 flex flex-col items-center gap-2 group"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="h-10 w-auto object-contain group-hover:scale-110 transition-transform"
                            loading="lazy"
                          />
                          <span className="text-xs text-white text-center font-medium line-clamp-1">
                            {provider.provider_name}
                          </span>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Cast Section */}
        {cast.length > 0 && (
          <section>
            <h2 className="text-3xl font-semibold text-white mb-6">Cast</h2>
            <Swiper
              modules={[Navigation]}
              spaceBetween={12}
              slidesPerView={3}
              navigation
              loop={cast.length > 10}
              loopAdditionalSlides={2}
              breakpoints={{
                640: {
                  slidesPerView: 4,
                },
                768: {
                  slidesPerView: 5,
                },
                1024: {
                  slidesPerView: 6,
                },
                1280: {
                  slidesPerView: 7,
                },
              }}
              className="movie-swiper"
            >
              {cast.slice(0, 20).map((actor) => (
                <SwiperSlide key={actor.id}>
                  <Link
                    to={`/cast/${actor.id}/${actor.name}`}
                    className="group block"
                  >
                    <div className="glass rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300">
                      <div className="aspect-[2/3] overflow-hidden">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <img
                            src={placeholder}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="p-2.5">
                        <h3 className="font-semibold text-white text-xs mb-0.5 line-clamp-1">
                          {actor.name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-1">
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <MovieCarouselSection
            title="You May Also Like"
            movies={recommendations}
          />
        )}
      </div>
    </div>
  );
};
