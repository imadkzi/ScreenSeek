// eslint-disable-next-line
import React, {createContext, useReducer, useEffect} from "react";
import AppReducer from "./AppReducer";

const initialState = {
    watchlist: localStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')) : [],
    favourites: localStorage.getItem('favourites') ? JSON.parse(localStorage.getItem('favourites')) : [],
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = props => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
        localStorage.setItem('favourites', JSON.stringify(state.favourites));
    }, [state])

    const addToWatchlist = (movie) =>  {
        dispatch({type: "ADD_TO_WATCHLIST", payload: movie});
    };

    const removeFromWatchlist = (id) => {
        dispatch({type: "REMOVE_FROM_WATCHLIST", payload: id});
    };

    const addToFavourites = (movie) =>  {
        dispatch({type: "ADD_TO_FAVOURITES", payload: movie});
    };

    const removeFromFavourites = (id) => {
        dispatch({type: "REMOVE_FROM_FAVOURITES", payload: id});
    };

    return (
        <GlobalContext.Provider value={{
                watchlist: state.watchlist, 
                favourites: state.favourites, 
                addToWatchlist,
                removeFromWatchlist,
                addToFavourites,
                removeFromFavourites,
            }}>
            {props.children}
        </GlobalContext.Provider>
    )
}