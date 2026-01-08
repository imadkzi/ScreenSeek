import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {NavBar} from './Components/NavBar';
import { Home } from './Pages/Home';
import { Trending } from './Pages/Trending';
import { MostPopular } from './Pages/MostPopular';
import { Upcoming } from './Pages/Upcoming';
import { NowPlaying } from './Pages/NowPlaying';
import { TopRated } from './Pages/TopRated';
import { Search } from './Pages/Search';
import {FilmPage} from './Pages/FilmPage';
import {CastPage} from './Components/CastPage'
import { WatchList } from './Pages/WatchList';
import { Favourites } from './Pages/Favourites';
import { Footer } from './Components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './sass/custom.scss';

import {GlobalProvider} from "./context/GlobalState"

function App() {
  return (
      <GlobalProvider>
        <Router forceRefresh={true}>
         <NavBar />
         <Switch>
            <Route forceRefresh={true} exact path="/">
               <Home />
            </Route>
            <Route exact path="/trending">
               <Trending />
            </Route>
            <Route exact path="/popular">
               <MostPopular />
            </Route>
            <Route exact path="/upcoming">
               <Upcoming />
            </Route>
            <Route exact path="/now-playing">
               <NowPlaying />
            </Route>
            <Route exact path="/top-rated">
               <TopRated />
            </Route>
            <Route exact path="/watchlist">
               <WatchList />
            </Route>
            <Route exact path="/favourites">
               <Favourites />
            </Route>
            <Route exact path="/search">
               <Search />
            </Route>
            <Route exact path="/film/:id">
               <FilmPage />
            </Route>
            <Route exact path="/cast/:id:name">
               <CastPage />
            </Route>
         </Switch>
      </Router>
      <Footer />
   </GlobalProvider>

  );
}

export default App;
