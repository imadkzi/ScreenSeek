import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { NavBar } from "./Components/NavBar";
import { ScrollToTop } from "./Components/ScrollToTop";
import { Home } from "./Pages/Home";
import { Trending } from "./Pages/Trending";
import { MostPopular } from "./Pages/MostPopular";
import { Upcoming } from "./Pages/Upcoming";
import { TopRated } from "./Pages/TopRated";
import { Search } from "./Pages/Search";
import { FilmPage } from "./Pages/FilmPage";
import { CastPage } from "./Pages/CastPage";
import { WatchList } from "./Pages/WatchList";
import { Favourites } from "./Pages/Favourites";
import { Footer } from "./Components/Footer";
import "./sass/custom.scss";

import { GlobalProvider } from "./context/GlobalState";

function App() {
  return (
    <HelmetProvider>
      <GlobalProvider>
        <Router>
          <ScrollToTop />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/popular" element={<MostPopular />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/search" element={<Search />} />
            <Route path="/film/:id" element={<FilmPage />} />
            <Route path="/cast/:id/:name" element={<CastPage />} />
          </Routes>
        </Router>
        <Footer />
      </GlobalProvider>
    </HelmetProvider>
  );
}

export default App;
