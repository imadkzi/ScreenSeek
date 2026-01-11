import { useState, useEffect, useCallback } from "react";
import {
  movieAPI,
  organizeWatchProviders,
  getUKCertification,
  getYouTubeTrailer,
} from "../services/tmdb";

// Constants
const INITIAL_LOAD_COUNT = 15;
const MAX_PAGES = 500;

/**
 * Helper function to remove duplicate movies by ID
 */
const removeDuplicates = (movies) => {
  const seen = new Set();
  return movies.filter((movie) => {
    if (!movie || !movie.id || seen.has(movie.id)) {
      return false;
    }
    seen.add(movie.id);
    return true;
  });
};

/**
 * Generic hook for fetching movies with a limit
 */
const useMoviesWithLimit = (fetchFunction, dependencies = []) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchFunction();
        setMovies(data.results || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, dependencies);

  return { movies, loading, error };
};

/**
 * Custom hook for fetching trending movies
 */
export const useTrendingMovies = (timeWindow = "week", limit = null) => {
  const { movies, loading, error } = useMoviesWithLimit(
    () => movieAPI.getTrending(timeWindow),
    [timeWindow]
  );

  const limitedMovies = limit ? movies.slice(0, limit) : movies;
  return { movies: limitedMovies, loading, error };
};

/**
 * Custom hook for fetching upcoming movies
 */
export const useUpcomingMovies = (limit = null) => {
  const { movies, loading, error } = useMoviesWithLimit(
    () => movieAPI.getUpcoming(),
    []
  );

  const limitedMovies = limit ? movies.slice(0, limit) : movies;
  return { movies: limitedMovies, loading, error };
};

/**
 * Custom hook for fetching top rated movies
 */
export const useTopRatedMovies = (limit = null) => {
  const { movies, loading, error } = useMoviesWithLimit(
    () => movieAPI.getTopRated(),
    []
  );

  const limitedMovies = limit ? movies.slice(0, limit) : movies;
  return { movies: limitedMovies, loading, error };
};

/**
 * Generic hook for infinite scroll movie fetching
 */
const useInfiniteScrollMovies = (
  fetchInitialFn,
  fetchPageFn,
  dependencies = []
) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Initial load - show first 15 items
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const data = await fetchInitialFn();
        const allResults = data.results || [];
        const initialMovies = allResults.slice(0, INITIAL_LOAD_COUNT);

        setMovies(removeDuplicates(initialMovies));
        setHasMore(
          allResults.length >= INITIAL_LOAD_COUNT && data.total_pages > 1
        );
        setPage(2);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, dependencies);

  // Load more movies
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const data = await fetchPageFn(page);
      const newMovies = data.results || [];

      setMovies((prev) => {
        const combined = [...prev, ...newMovies];
        return removeDuplicates(combined);
      });

      const nextPage = page + 1;
      const maxPages = Math.min(data.total_pages || 1, MAX_PAGES);
      setHasMore(nextPage <= maxPages);
      setPage(nextPage);
    } catch (err) {
      console.error("Error loading more movies:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore, fetchPageFn]);

  return { movies, loadMore, hasMore, loading, loadingMore, error };
};

/**
 * Custom hook for fetching popular movies with infinite scroll
 */
export const usePopularMovies = () => {
  return useInfiniteScrollMovies(
    () => movieAPI.getPopular(1),
    (page) => movieAPI.getPopular(page),
    []
  );
};

/**
 * Custom hook for fetching trending movies with infinite scroll
 */
export const useTrendingMoviesPaginated = (timeWindow = "week") => {
  return useInfiniteScrollMovies(
    () => movieAPI.getTrending(timeWindow, 1),
    (page) => movieAPI.getTrending(timeWindow, page),
    [timeWindow]
  );
};

/**
 * Custom hook for fetching top rated movies with infinite scroll
 */
export const useTopRatedMoviesPaginated = () => {
  return useInfiniteScrollMovies(
    () => movieAPI.getTopRated(1),
    (page) => movieAPI.getTopRated(page),
    []
  );
};

/**
 * Custom hook for fetching upcoming movies with infinite scroll
 */
export const useUpcomingMoviesPaginated = () => {
  return useInfiniteScrollMovies(
    () => movieAPI.getUpcoming(1),
    (page) => movieAPI.getUpcoming(page),
    []
  );
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
 * Helper function to find high-resolution backdrop
 */
const findHighResBackdrop = (backdrops) => {
  if (!backdrops || backdrops.length === 0) return null;

  const highResBackdrops = backdrops.filter((backdrop) => {
    const width = backdrop.width;
    const height = backdrop.height;
    const aspectRatio = width / height;

    // Check for 16:9 aspect ratio (approximately 1.777)
    const is16to9 = Math.abs(aspectRatio - 16 / 9) < 0.1;
    // Check for high resolution (width >= 1920)
    const isHighRes = width >= 1920;

    return is16to9 && isHighRes;
  });

  return highResBackdrops.length > 0
    ? highResBackdrops[0].file_path
    : backdrops[0].file_path;
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

        // Fetch images to get alternative backdrop
        try {
          const imagesData = await movieAPI.getMovieImages(movieId);
          if (imagesData.backdrops?.length > 0) {
            const backdropPath = findHighResBackdrop(imagesData.backdrops);
            if (backdropPath) {
              setBackdropImage(backdropPath);
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

/**
 * Custom hook for searching movies with infinite scroll
 */
export const useSearchMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Initial load - show first 15 items
  useEffect(() => {
    if (!query || query.trim() === "") {
      setMovies([]);
      setHasMore(false);
      setTotalResults(0);
      setPage(1);
      setLoading(false);
      return;
    }

    const fetchInitial = async () => {
      try {
        setLoading(true);

        const data = await movieAPI.searchMovies(query, 1);
        const allResults = data.results || [];
        const initialMovies = allResults.slice(0, INITIAL_LOAD_COUNT);

        setMovies(removeDuplicates(initialMovies));
        setTotalResults(data.total_results || 0);
        setHasMore(
          allResults.length >= INITIAL_LOAD_COUNT && data.total_pages > 1
        );
        setPage(2);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMovies([]);
        setTotalResults(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [query]);

  // Load more movies
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !query || query.trim() === "") return;

    try {
      setLoadingMore(true);
      const data = await movieAPI.searchMovies(query, page);
      const newMovies = data.results || [];

      setMovies((prev) => {
        const combined = [...prev, ...newMovies];
        return removeDuplicates(combined);
      });

      const nextPage = page + 1;
      const maxPages = Math.min(data.total_pages || 1, MAX_PAGES);
      setHasMore(nextPage <= maxPages);
      setPage(nextPage);
    } catch (err) {
      console.error("Error loading more movies:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore, query]);

  return {
    movies,
    loadMore,
    hasMore,
    totalResults,
    loading,
    loadingMore,
    error,
  };
};
