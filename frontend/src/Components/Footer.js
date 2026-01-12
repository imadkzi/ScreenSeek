import React from "react";
import tmdb from "../Assets/tmdb.svg";
import logo from "../Assets/logo-white.svg";

export const Footer = () => {
  return (
    <footer className="glass-dark border-t border-white/10 mt-6">
      <div className="container-apple py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logos */}
          <div className="flex items-center gap-6">
            <img
              src={logo}
              alt="ScreenSeek logo"
              className="h-6 w-auto"
              loading="lazy"
            />
            <img
              src={tmdb}
              alt="The Movie DB Logo"
              className="h-6 w-auto opacity-70"
              loading="lazy"
            />
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © 2026 Copyright: <span className="text-white">Imad Kazi</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
