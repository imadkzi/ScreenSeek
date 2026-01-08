import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ScrollCard } from "./ScrollCard";

export const MovieCarouselSection = ({ title, movies, seeAllLink }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-white">{title}</h2>
        {seeAllLink && (
          <Link
            to={seeAllLink}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            See All
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
          </Link>
        )}
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={2}
        navigation
        loop={true}
        loopAdditionalSlides={2}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 6,
          },
          1536: {
            slidesPerView: 7,
          },
        }}
        className="movie-swiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <ScrollCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
