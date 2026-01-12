import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export const GlassPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (end - start < maxVisible - 1) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisible - 1);
        } else {
          start = Math.max(1, end - maxVisible + 1);
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
        <span className="text-sm font-medium">Prev</span>
      </button>

      <div className="flex items-center gap-2">
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="glass px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="text-gray-400 px-2">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              page === currentPage
                ? "bg-accent text-white shadow-lg border border-accent/50"
                : "glass text-white hover:bg-white/20"
            }`}
          >
            {page}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="text-gray-400 px-2">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="glass px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <span className="text-sm font-medium">Next</span>
        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
      </button>
    </div>
  );
};
