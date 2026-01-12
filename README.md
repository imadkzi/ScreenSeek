# ScreenSeek

A modern movie discovery platform built with React, featuring a clean glassmorphic design. ScreenSeek helps users discover, explore, and organize their favorite movies with an intuitive interface powered by The Movie Database (TMDB) API.

**Live Demo:** [https://screenseek.netlify.app](https://screenseek.netlify.app)

## Features

### Content Discovery
- **Trending Movies** - Discover movies trending this week
- **Popular Movies** - Browse the most popular films
- **Top Rated** - Explore critically acclaimed movies
- **Upcoming Releases** - See what's coming to theaters
- **Advanced Search** - Search with real-time suggestions
- **Movie Details** - Comprehensive information including cast, trailers, and watch providers

### User Features
- **Watchlist** - Save movies to watch later
- **Favourites** - Mark your favorite films
- **Cast Pages** - Explore actor and crew member profiles with filmography
- **Watch Providers** - See where to stream, rent, or buy movies

### Design
- **Glassmorphic UI** - Modern, Apple-inspired design with glassmorphism effects
- **Responsive Design** - Optimized for all device sizes
- **Smooth Animations** - Polished transitions and interactions
- **Dark Theme** - Easy on the eyes with a space-gray color scheme

## Tech Stack

### Core
- **React 18.2** - UI library
- **React Router DOM 6.21** - Client-side routing
- **React Helmet Async** - Dynamic meta tags for SEO

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **SCSS/SASS** - Custom styles and variables
- **Font Awesome** - Icon library

### Data & API
- **The Movie Database (TMDB) API** - Movie and cast data
- **Custom Hooks** - Reusable data fetching logic
- **Service Layer** - Centralized API calls

### Additional Libraries
- **Swiper** - Touch-enabled carousels
- **React Context API** - Global state management

## Project Structure

```
ScreenSeek/
├── frontend/
│   ├── public/              # Static assets
│   │   ├── favicon/         # Favicon files
│   │   └── manifest.json    # PWA manifest
│   ├── src/
│   │   ├── Components/      # Reusable components
│   │   │   ├── Footer.js
│   │   │   ├── GlassPagination.js
│   │   │   ├── MovieCarouselSection.js
│   │   │   ├── MoviePosterCard.js
│   │   │   ├── NavBar.js
│   │   │   └── ScrollToTop.js
│   │   ├── Pages/           # Route components
│   │   │   ├── CastPage.js
│   │   │   ├── Favourites.js
│   │   │   ├── FilmPage.js
│   │   │   ├── Home.js
│   │   │   ├── MostPopular.js
│   │   │   ├── Search.js
│   │   │   ├── TopRated.js
│   │   │   ├── Trending.js
│   │   │   ├── Upcoming.js
│   │   │   └── WatchList.js
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useMovies.js
│   │   │   └── useSearchSuggestions.js
│   │   ├── services/        # API service layer
│   │   │   └── tmdb.js
│   │   ├── context/         # Global state
│   │   │   ├── GlobalState.js
│   │   │   └── AppReducer.js
│   │   ├── sass/            # SCSS styles
│   │   │   ├── custom.scss
│   │   │   └── var.scss
│   │   └── Assets/          # Images and logos
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── README.md
└── roadmap.md
```

## Getting Started

### Prerequisites

- Node.js >= 22.21.1
- npm >= 10.0.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ScreenSeek
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Add your TMDB API key to `.env`:
```env
REACT_APP_TMDB_KEY=your_api_key_here
```

To get a TMDB API key:
- Visit [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- Create an account or log in
- Request an API key
- Copy your API key to the `.env` file

### Development

Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

The page will reload automatically when you make changes.

### Building for Production

Create an optimized production build:
```bash
npm run build
```

This creates a `build` folder with optimized production files.

To preview the production build locally:
```bash
npx serve -s build
```

### Testing

Run the test suite:
```bash
npm test
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Creates a production build
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)

## Architecture

### Service Layer (`services/tmdb.js`)
Centralized API client for all TMDB API calls. Handles:
- Movie data fetching
- Person/cast information
- Search functionality
- Data transformation utilities

### Custom Hooks (`hooks/`)
Reusable React hooks for data fetching:
- `useMovies.js` - Movie data hooks (trending, popular, top rated, etc.)
- `useSearchSuggestions.js` - Search suggestions with debouncing

### State Management
- **Context API** - Global state for watchlist and favourites
- **Local Storage** - Persistence for user data

### Component Structure
- **Pages** - Route-level components
- **Components** - Reusable UI components
- **Hooks** - Data fetching and business logic
- **Services** - API communication layer

## Key Features Implementation

### Infinite Scroll
Listing pages use intersection observer for infinite scrolling, loading more content as users scroll.

### Search Suggestions
Real-time search suggestions with debouncing for optimal performance.

### Watchlist & Favourites
Local storage-based persistence for user watchlists and favourites.

### Responsive Design
Mobile-first approach with breakpoints for tablet and desktop views.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Check the [roadmap.md](./roadmap.md) for planned features
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Development

See [roadmap.md](./roadmap.md) for planned features and improvements, including:
- TV Shows support
- Advanced filtering and sorting
- Genre pages
- Recommendations engine
- And more

## Credits

- **The Movie Database (TMDB)** - Movie and cast data API
- **React** - UI framework
- **Tailwind CSS** - Styling framework
- **Font Awesome** - Icons

## License

This project is private and proprietary.

## Author

Created by Imad Kazi

---

**Version:** 0.1.0  
**Last Updated:** 2026
