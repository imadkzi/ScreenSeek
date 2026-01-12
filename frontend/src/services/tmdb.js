const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_TMDB_KEY;

const fetchFromTMDB = async (endpoint) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}&api_key=${API_KEY}`
    );
    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors.join(", "));
    }

    return data;
  } catch (error) {
    console.error(`Error fetching from TMDB ${endpoint}:`, error);
    throw error;
  }
};

export const movieAPI = {
  getTrending: (timeWindow = "day", page = 1, language = "en-US") => {
    return fetchFromTMDB(
      `/trending/movie/${timeWindow}?language=${language}&page=${page}`
    );
  },

  getNowPlaying: (page = 1, language = "en-US", region = "GB") => {
    return fetchFromTMDB(
      `/movie/now_playing?language=${language}&page=${page}&region=${region}`
    );
  },

  getUpcoming: (page = 1, language = "en-US", region = "GB") => {
    return fetchFromTMDB(
      `/movie/upcoming?language=${language}&page=${page}&region=${region}`
    );
  },

  getTopRated: (page = 1, language = "en-US") => {
    return fetchFromTMDB(`/movie/top_rated?language=${language}&page=${page}`);
  },

  getPopular: (page = 1, language = "en-US", region = "GB") => {
    return fetchFromTMDB(
      `/movie/popular?language=${language}&page=${page}&region=${region}`
    );
  },

  getMovieDetails: (movieId, language = "en-US", region = "GB") => {
    return fetchFromTMDB(
      `/movie/${movieId}?language=${language}&region=${region}&append_to_response=release_dates,videos,credits,recommendations`
    );
  },

  getMovieVideos: (movieId, language = "en-US") => {
    return fetchFromTMDB(`/movie/${movieId}/videos?language=${language}`);
  },

  getWatchProviders: (movieId, language = "en-US", region = "GB") => {
    return fetchFromTMDB(
      `/movie/${movieId}/watch/providers?language=${language}&region=${region}`
    );
  },

  getReleaseDates: (movieId) => {
    return fetchFromTMDB(`/movie/${movieId}/release_dates?`);
  },

  getMovieImages: (movieId, language = "en") => {
    return fetchFromTMDB(`/movie/${movieId}/images?language=${language}`);
  },

  searchMovies: (query, page = 1, language = "en-US") => {
    return fetchFromTMDB(
      `/search/movie?query=${encodeURIComponent(
        query
      )}&language=${language}&page=${page}&include_adult=false`
    );
  },
};

export const personAPI = {
  getPersonDetails: (personId, language = "en-US") => {
    return fetchFromTMDB(
      `/person/${personId}?language=${language}&append_to_response=movie_credits`
    );
  },
};

export const getUKCertification = (releaseDatesData) => {
  if (!releaseDatesData?.results) return null;

  const ukRelease = releaseDatesData.results.find(
    (release) => release.iso_3166_1 === "GB"
  );

  if (!ukRelease?.release_dates) return null;

  const certifiedRelease = ukRelease.release_dates.find(
    (rd) => rd.certification && rd.certification.trim() !== ""
  );

  return certifiedRelease?.certification || null;
};

export const getYouTubeTrailer = (videosData) => {
  if (!videosData?.results) return null;

  const trailer = videosData.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return trailer?.key || null;
};

export const organizeWatchProviders = (providersData) => {
  if (!providersData?.results?.GB) {
    return {
      flatrate: [],
      rent: [],
      buy: [],
    };
  }

  return {
    flatrate: providersData.results.GB.flatrate || [],
    rent: providersData.results.GB.rent || [],
    buy: providersData.results.GB.buy || [],
  };
};
