import { useState, useEffect } from "react";
import {
  movieAPI,
  organizeWatchProviders,
  getUKCertification,
  getYouTubeTrailer,
} from "../services/tmdb";

/**
 * Custom hook for fetching trending movies
 */
export const useTrendingMovies = (timeWindow = "week", limit = null) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await movieAPI.getTrending(timeWindow);
        const results = limit ? data.results.slice(0, limit) : data.results;
        setMovies(results);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [timeWindow, limit]);

  return { movies, loading, error };
};

/**
 * Custom hook for fetching upcoming movies
 */
export const useUpcomingMovies = (limit = null) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const data = await movieAPI.getUpcoming();
        const results = limit ? data.results.slice(0, limit) : data.results;
        setMovies(results);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, [limit]);

  return { movies, loading, error };
};

/**
 * Custom hook for fetching top rated movies
 */
export const useTopRatedMovies = (limit = null) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        const data = await movieAPI.getTopRated();
        const results = limit ? data.results.slice(0, limit) : data.results;
        setMovies(results);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, [limit]);

  return { movies, loading, error };
};

/**
 * Custom hook for fetching featured movie (first from trending)
 */
export const useFeaturedMovie = () => {
  const [movie, setMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState({
    flatrate: [],
    rent: [],
    buy: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Get first trending movie as featured
        const trendingData = await movieAPI.getTrending("day");

        if (trendingData.results?.length > 0) {
          const featuredMovie = trendingData.results[0];
          setMovie(featuredMovie);

          // Fetch watch providers for featured movie
          try {
            const providersData = await movieAPI.getWatchProviders(
              featuredMovie.id
            );
            const organized = organizeWatchProviders(providersData);
            setWatchProviders(organized);
          } catch (providerError) {
            console.error("Error fetching watch providers:", providerError);
            // Don't fail the whole request if providers fail
          }
        }

        setError(null);
      } catch (err) {
        setError(err.message);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { movie, watchProviders, loading, error };
};

/**
 * Custom hook for fetching movie details
 */
export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [watchProviders, setWatchProviders] = useState({
    flatrate: [],
    rent: [],
    buy: [],
  });
  const [certification, setCertification] = useState(null);
  const [backdropImage, setBackdropImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        // Reset all state when movie ID changes
        setMovie(null);
        setGenres([]);
        setCast([]);
        setTrailerKey(null);
        setRecommendations([]);
        setWatchProviders({ flatrate: [], rent: [], buy: [] });
        setCertification(null);
        setBackdropImage(null);
        setLoading(true);

        // Fetch main movie data
        const movieData = await movieAPI.getMovieDetails(movieId);
        setMovie(movieData);
        setGenres(movieData.genres || []);
        setCast(movieData.credits?.cast || []);
        setRecommendations(movieData.recommendations?.results || []);

        // Extract certification
        if (movieData.release_dates?.results) {
          const cert = getUKCertification(movieData.release_dates);
          setCertification(cert);
        }

        // Extract trailer
        if (movieData.videos?.results) {
          const trailer = getYouTubeTrailer(movieData.videos);
          setTrailerKey(trailer);
        }

        // Fetch images to get alternative backdrop (3840x2160 or similar)
        try {
          const imagesData = await movieAPI.getMovieImages(movieId);
          if (imagesData.backdrops && imagesData.backdrops.length > 0) {
            // Filter for high resolution backdrops (3840x2160 or similar 16:9 at high res)
            // Target: 3840x2160, but also accept 1920x1080, 2560x1440, or any 16:9 ratio >= 1920 width
            const highResBackdrops = imagesData.backdrops.filter((backdrop) => {
              const width = backdrop.width;
              const height = backdrop.height;
              const aspectRatio = width / height;

              // Check for 16:9 aspect ratio (approximately 1.777)
              const is16to9 = Math.abs(aspectRatio - 16 / 9) < 0.1;

              // Check for high resolution (width >= 1920, which includes 1920x1080, 2560x1440, 3840x2160)
              const isHighRes = width >= 1920;

              return is16to9 && isHighRes;
            });

            if (highResBackdrops.length > 0) {
              // Use the first high-res backdrop
              setBackdropImage(highResBackdrops[0].file_path);
            } else if (imagesData.backdrops.length > 0) {
              // Fallback to any backdrop if no high-res found
              setBackdropImage(imagesData.backdrops[0].file_path);
            }
          }
        } catch (imagesError) {
          console.error("Error fetching images:", imagesError);
          // Fallback to movie backdrop_path if images fetch fails
          if (movieData.backdrop_path) {
            setBackdropImage(movieData.backdrop_path);
          }
        }

        // Fetch watch providers
        try {
          const providersData = await movieAPI.getWatchProviders(movieId);
          const organized = organizeWatchProviders(providersData);
          setWatchProviders(organized);
        } catch (providerError) {
          console.error("Error fetching watch providers:", providerError);
        }

        setError(null);
      } catch (err) {
        setError(err.message);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return {
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
  };
};
