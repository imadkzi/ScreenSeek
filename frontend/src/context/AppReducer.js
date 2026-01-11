// eslint-disable-next-line
export default (state, action) => {
    switch (action.type) {
      case "ADD_TO_WATCHLIST":
        return {
          ...state,
          watchlist: [action.payload, ...state.watchlist],
        };
      case "REMOVE_FROM_WATCHLIST":
        return {
          ...state,
          watchlist: state.watchlist.filter(
            (movie) => movie.id !== action.payload
          ),
        };
      case "ADD_TO_FAVOURITES":
        return {
          ...state,
          favourites: [action.payload, ...state.favourites],
        };
      case "REMOVE_FROM_FAVOURITES":
        return {
          ...state,
          favourites: state.favourites.filter(
            (movie) => movie.id !== action.payload
          ),
        };
      default:
        return state;
    }
  };