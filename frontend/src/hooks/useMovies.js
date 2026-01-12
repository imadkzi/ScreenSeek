import { useState, useEffect, useCallback } from "react";
import {
  movieAPI,
  personAPI,
  organizeWatchProviders,
  getUKCertification,
  getYouTubeTrailer,
} from "../services/tmdb";

const INITIAL_LOAD_COUNT = 15;
const MAX_PAGES = 500;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { movies, loading, error };
};

export const useTrendingMovies = (timeWindow = "week", limit = null) => {
  const { movies, loading, error } = useMoviesWithLimit(
    () => movieAPI.getTrending(timeWindow),
    [timeWindow]
  );

  const limitedMovies = limit ? movies.slice(0, limit) : movies;
  return { movies: limitedMovies, loading, error };
};

export const useUpcomingMovies = (limit = null) => {
  const { movies, loading, error } = useMoviesWithLimit(
    () => movieAPI.getUpcoming(),
    []
  );

  const limitedMovies = limit ? movies.slice(0, limit) : movies;
  return { movies: limitedMovies, loading, error };
};

export const useTopRatedMovies = (limit = null) => {
  const { movies, loading, error } = useMoviesWithLimit(
    () => movieAPI.getTopRated(),
    []
  );

  const limitedMovies = limit ? movies.slice(0, limit) : movies;
  return { movies: limitedMovies, loading, error };
};

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

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

export const usePopularMovies = () => {
  return useInfiniteScrollMovies(
    () => movieAPI.getPopular(1),
    (page) => movieAPI.getPopular(page),
    []
  );
};

export const useTrendingMoviesPaginated = (timeWindow = "week") => {
  return useInfiniteScrollMovies(
    () => movieAPI.getTrending(timeWindow, 1),
    (page) => movieAPI.getTrending(timeWindow, page),
    [timeWindow]
  );
};

export const useTopRatedMoviesPaginated = () => {
  return useInfiniteScrollMovies(
    () => movieAPI.getTopRated(1),
    (page) => movieAPI.getTopRated(page),
    []
  );
};

export const useUpcomingMoviesPaginated = () => {
  return useInfiniteScrollMovies(
    () => movieAPI.getUpcoming(1),
    (page) => movieAPI.getUpcoming(page),
    []
  );
};

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

          try {
            const providersData = await movieAPI.getWatchProviders(
              featuredMovie.id
            );
            const organized = organizeWatchProviders(providersData);
            setWatchProviders(organized);
          } catch (providerError) {
            console.error("Error fetching watch providers:", providerError);
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

const findHighResBackdrop = (backdrops) => {
  if (!backdrops || backdrops.length === 0) return null;

  const highResBackdrops = backdrops.filter((backdrop) => {
    const aspectRatio = backdrop.width / backdrop.height;
    const is16to9 = Math.abs(aspectRatio - 16 / 9) < 0.1;
    const isHighRes = backdrop.width >= 1920;
    return is16to9 && isHighRes;
  });

  return highResBackdrops.length > 0
    ? highResBackdrops[0].file_path
    : backdrops[0].file_path;
};

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
        setMovie(null);
        setGenres([]);
        setCast([]);
        setTrailerKey(null);
        setRecommendations([]);
        setWatchProviders({ flatrate: [], rent: [], buy: [] });
        setCertification(null);
        setBackdropImage(null);
        setLoading(true);

        const movieData = await movieAPI.getMovieDetails(movieId);
        setMovie(movieData);
        setGenres(movieData.genres || []);
        setCast(movieData.credits?.cast || []);
        setRecommendations(movieData.recommendations?.results || []);

        if (movieData.release_dates?.results) {
          const cert = getUKCertification(movieData.release_dates);
          setCertification(cert);
        }

        if (movieData.videos?.results) {
          const trailer = getYouTubeTrailer(movieData.videos);
          setTrailerKey(trailer);
        }

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
          if (movieData.backdrop_path) {
            setBackdropImage(movieData.backdrop_path);
          }
        }

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

export const usePersonDetails = (personId) => {
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!personId) return;

    const fetchPersonDetails = async () => {
      try {
        setPerson(null);
        setCredits([]);
        setLoading(true);

        const personData = await personAPI.getPersonDetails(personId);
        setPerson(personData);
        setCredits(personData.movie_credits?.cast || []);

        setError(null);
      } catch (err) {
        setError(err.message);
        setPerson(null);
        setCredits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [personId]);

  return {
    person,
    credits,
    loading,
    error,
  };
};

export const useMovieCertification = (movieId) => {
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchCertification = async () => {
      try {
        setLoading(true);
        const releaseDatesData = await movieAPI.getReleaseDates(movieId);
        const cert = getUKCertification(releaseDatesData);
        setCertification(cert);
      } catch (error) {
        setCertification(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCertification();
  }, [movieId]);

  return { certification, loading };
};
