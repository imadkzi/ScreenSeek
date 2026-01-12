import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMapMarkerAlt,
  faBriefcase,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import { usePersonDetails } from "../hooks/useMovies";
import placeholder from "../Assets/Cast-P.png";

export const CastPage = () => {
  const { id } = useParams();
  const { person, credits, loading, error } = usePersonDetails(id);
  const [isBiographyExpanded, setIsBiographyExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsBiographyExpanded(false);
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatYear = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).getFullYear();
  };

  const sortedCredits =
    credits.length > 0
      ? [...credits].sort((a, b) => {
          const yearA = a.release_date
            ? new Date(a.release_date).getFullYear()
            : 0;
          const yearB = b.release_date
            ? new Date(b.release_date).getFullYear()
            : 0;
          return yearA - yearB;
        })
      : [];

  if (error || (!loading && !person)) {
    return (
      <div className="min-h-screen flex items-center justify-center container-apple">
        <div className="text-white text-xl">{error || "Person not found"}</div>
      </div>
    );
  }

  if (loading || !person) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative min-h-[500px] flex items-start container-apple section-spacing mt-16 md:mt-0">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Profile Image Skeleton */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="glass rounded-2xl overflow-hidden shadow-2xl w-full max-w-xs aspect-[2/3] bg-space-gray-light animate-pulse" />
              </div>

              {/* Info Skeleton */}
              <div className="lg:col-span-9">
                <div className="h-16 w-3/4 bg-space-gray-light rounded-lg mb-4 animate-pulse" />
                <div className="flex gap-4 mb-4">
                  <div className="h-8 w-32 bg-space-gray-light rounded-lg animate-pulse" />
                  <div className="h-8 w-40 bg-space-gray-light rounded-lg animate-pulse" />
                  <div className="h-8 w-28 bg-space-gray-light rounded-lg animate-pulse" />
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-space-gray-light rounded animate-pulse" />
                  <div className="h-4 w-full bg-space-gray-light rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-space-gray-light rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections Skeleton */}
        <div className="container-apple space-y-12 py-8">
          <div>
            <div className="h-8 w-48 bg-space-gray-light rounded-lg mb-6 animate-pulse" />
            <div className="glass rounded-2xl p-6">
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-space-gray-light rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{person.name} | ScreenSeek</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-start container-apple section-spacing mt-16 md:mt-0">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Profile Image */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="glass rounded-2xl overflow-hidden shadow-2xl">
                {person.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-auto max-w-xs aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={placeholder}
                    alt={person.name}
                    className="w-full h-auto max-w-xs aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-9">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6">
                {person.name}
              </h1>

              {/* Personal Details */}
              <div className="flex flex-wrap gap-4 mb-6">
                {person.birthday && (
                  <div className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm backdrop-blur-md">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="w-4 h-4 text-gray-300"
                    />
                    <span className="text-gray-300">
                      {formatDate(person.birthday)}
                    </span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm backdrop-blur-md">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="w-4 h-4 text-gray-300"
                    />
                    <span className="text-gray-300">
                      {person.place_of_birth}
                    </span>
                  </div>
                )}
                {person.known_for_department && (
                  <div className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm backdrop-blur-md">
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      className="w-4 h-4 text-gray-300"
                    />
                    <span className="text-gray-300">
                      {person.known_for_department}
                    </span>
                  </div>
                )}
              </div>

              {/* Biography Preview/Expandable */}
              {person.biography && (
                <div className="mb-6">
                  <button
                    onClick={() => setIsBiographyExpanded(!isBiographyExpanded)}
                    className="w-full text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p
                          className={`text-lg text-gray-300 transition-all duration-300 ${
                            isBiographyExpanded
                              ? "line-clamp-none"
                              : "line-clamp-4"
                          }`}
                        >
                          {person.biography}
                        </p>
                      </div>
                      <div className="flex-shrink-0 pt-1">
                        <FontAwesomeIcon
                          icon={
                            isBiographyExpanded ? faChevronUp : faChevronDown
                          }
                          className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Credits Table Section */}
              {credits.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Film Credits
                  </h2>
                  <div className="glass rounded-2xl overflow-hidden backdrop-blur-md">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">
                              Year
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Character
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {sortedCredits.map((movie) => (
                            <tr
                              key={movie.id}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 font-medium">
                                {formatYear(movie.release_date)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <Link
                                  to={`/film/${movie.id}`}
                                  className="text-white hover:text-accent transition-colors font-medium"
                                >
                                  {movie.title}
                                </Link>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-400">
                                {movie.character || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
