import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSearchSuggestions } from "../hooks/useSearchSuggestions";
import logo from "../Assets/logo-teal.svg";

export const NavBar = () => {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const { suggestions, loading: suggestionsLoading } = useSearchSuggestions(
    query,
    showSuggestions && query.trim().length >= 2
  );

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const handleSuggestionClick = (movieId) => {
    setShowSuggestions(false);
    setQuery("");
    navigate(`/film/${movieId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSuggestions &&
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  const handleInputFocus = (inputType) => {
    setFocusedInput(inputType);
    if (query.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/top-rated", label: "Top Rated" },
    { path: "/popular", label: "Popular" },
    { path: "/watchlist", label: "Watchlist" },
    { path: "/favourites", label: "Favourites" },
  ];

  const shouldShowSuggestions =
    showSuggestions &&
    suggestions.length > 0 &&
    query.trim().length >= 2 &&
    (focusedInput === "desktop" || focusedInput === "mobile");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-dark border-b border-white/10">
        <div className="container-apple">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ScreenSeek Logo" className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-gray-200 hover:text-mint"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8"
            >
              <div className="relative flex-1" ref={searchRef}>
                <input
                  type="search"
                  placeholder="Search movies..."
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus("desktop")}
                  className="w-full glass px-4 py-2.5 rounded-full text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 glass p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                >
                  <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                </button>

                {/* Suggestions Dropdown */}
                {shouldShowSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-xl overflow-hidden shadow-2xl z-50 max-h-96 overflow-y-auto bg-space-gray/95 backdrop-blur-md"
                  >
                    {suggestionsLoading ? (
                      <div className="p-4 text-center text-gray-200 text-sm">
                        Loading...
                      </div>
                    ) : (
                      <div className="py-2">
                        {suggestions.map((movie) => (
                          <button
                            key={movie.id}
                            onClick={() => handleSuggestionClick(movie.id)}
                            className="w-full px-4 py-3 text-left hover:bg-white/20 transition-colors flex items-center gap-3 group"
                          >
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="w-12 h-16 object-cover rounded-lg"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-12 h-16 bg-space-gray-light rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon
                                  icon={faSearch}
                                  className="w-4 h-4 text-gray-500"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm group-hover:text-mint transition-colors truncate">
                                {movie.title}
                              </p>
                              {movie.release_date && (
                                <p className="text-gray-200 text-xs mt-0.5">
                                  {new Date(movie.release_date).getFullYear()}
                                </p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden glass p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <FontAwesomeIcon
                icon={isMenuOpen ? faTimes : faBars}
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden glass-dark border-t border-white/10">
            <div className="container-apple py-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative" ref={mobileSearchRef}>
                  <input
                    type="search"
                    placeholder="Search movies..."
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("mobile")}
                    className="w-full glass px-4 py-2.5 rounded-full text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 glass p-2 rounded-full text-white"
                  >
                    <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                  </button>

                  {/* Mobile Suggestions Dropdown */}
                  {shouldShowSuggestions && (
                    <div
                      ref={suggestionsRef}
                      className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-xl overflow-hidden shadow-2xl z-50 max-h-96 overflow-y-auto bg-space-gray/95 backdrop-blur-md"
                    >
                      {suggestionsLoading ? (
                        <div className="p-4 text-center text-gray-200 text-sm">
                          Loading...
                        </div>
                      ) : (
                        <div className="py-2">
                          {suggestions.map((movie) => (
                            <button
                              key={movie.id}
                              onClick={() => handleSuggestionClick(movie.id)}
                              className="w-full px-4 py-3 text-left hover:bg-white/20 transition-colors flex items-center gap-3 group"
                            >
                              {movie.poster_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                  alt={movie.title}
                                  className="w-12 h-16 object-cover rounded-lg"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-12 h-16 bg-space-gray-light rounded-lg flex items-center justify-center">
                                  <FontAwesomeIcon
                                    icon={faSearch}
                                    className="w-4 h-4 text-gray-500"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm group-hover:text-mint transition-colors truncate">
                                  {movie.title}
                                </p>
                                {movie.release_date && (
                                  <p className="text-gray-200 text-xs mt-0.5">
                                    {new Date(movie.release_date).getFullYear()}
                                  </p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>

              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-white/10 text-white"
                      : "text-gray-200 hover:bg-white/5 hover:text-mint"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
