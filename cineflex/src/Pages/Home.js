import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { MovieCarouselSection } from "../Components/MovieCarouselSection";

export const Home = () => {
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);

  // Fetch featured movie (first from trending)
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors && data.results?.length > 0) {
          setFeatured(data.results[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching featured movie:", error);
      });
  }, []);

  // Fetch trending
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setTrending(data.results.slice(0, 20));
        }
      })
      .catch((error) => {
        console.error("Error fetching trending:", error);
      });
  }, []);

  // Fetch now playing
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1&region=GB`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setNowPlaying(data.results.slice(0, 20));
        }
      })
      .catch((error) => {
        console.error("Error fetching now playing:", error);
      });
  }, []);

  // Fetch upcoming
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1&region=GB`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setUpcoming(data.results.slice(0, 20));
        }
      })
      .catch((error) => {
        console.error("Error fetching upcoming:", error);
      });
  }, []);

  // Fetch top rated
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setTopRated(data.results.slice(0, 20));
        }
      })
      .catch((error) => {
        console.error("Error fetching top rated:", error);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[85vh] min-h-[600px] flex items-end container-apple section-spacing mt-6">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${featured.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-space-gray via-space-gray/80 to-transparent" />
          </div>

          <div className="relative z-10 w-full pb-16">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-semibold mb-4 tracking-tight text-white">
                {featured.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 line-clamp-3">
                {featured.overview}
              </p>
              <div className="flex gap-4">
                <Link
                  to={`/film/${featured.id}`}
                  className="glass px-8 py-4 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300 group text-white"
                >
                  <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
                  <span className="font-medium">Watch Now</span>
                </Link>
                <Link
                  to={`/film/${featured.id}`}
                  className="glass px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 text-white"
                >
                  <span className="font-medium">Learn More</span>
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
          title="Now Playing"
          movies={nowPlaying}
          seeAllLink="/now-playing"
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
