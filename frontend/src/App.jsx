import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner, Select } from 'flowbite-react';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState('');
  const [sort, setSort] = useState('');
  //Millozza aggiunte
  const fetchMovies = () => {
    setLoading(true);
    const query = new URLSearchParams({ ...(year && { year }), ...(sort && { sort }) }).toString();
    return fetch(`http://localhost:8000/movies?${query}`)
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchMovies();
  }, [year, sort]);

  return (
    <Layout>
      <Heading />
      <div className="flex justify-center space-x-4 mb-4">
        <Select onChange={e => setYear(e.target.value)} value={year}>
          <option value="">Select Year</option>
          {/* Placeholder for years. Add actual options based on available data or your requirements */}
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </Select>
        <Select onChange={e => setSort(e.target.value)} value={sort}>
          <option value="">Select Sort</option>
          <option value="rating_desc">Rating High to Low</option>
          <option value="rating_asc">Rating Low to High</option>
        </Select>
      </div>
      <MovieList loading={loading} movies={movies} />
    </Layout>
  );
};

const Layout = ({ children }) => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      {children}
    </div>
  </section>
);

const Heading = () => (
  <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
    <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
      Movie Collection
    </h1>
    <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
      Explore the whole collection of movies
    </p>
  </div>
);

const MovieList = ({ loading, movies }) => {
  if (loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {movies.map((movie, key) => (
        <MovieItem key={key} {...movie} />
      ))}
    </div>
  );
};

const MovieItem = ({ imageUrl, title, year, rating, plot, wikipediaUrl }) => (
  <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
    <div className="grow">
      <img
        className="object-cover w-full h-60 md:h-80"
        src={imageUrl}
        alt={title}
        loading="lazy"
      />
    </div>
    <div className="grow flex flex-col h-full p-3">
      <div className="grow mb-3 last:mb-0">
        <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
          <span>{year}</span>
          {rating && (
            <Rating>
              <Rating.Star />
              <span className="ml-0.5">{rating.toFixed(1)}</span>
            </Rating>
          )}
        </div>
        <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
          {plot.substr(0, 80)}...
        </p>
      </div>
      {wikipediaUrl && (
        <Button
          color="light"
          size="xs"
          className="w-full"
          onClick={() => window.open(wikipediaUrl, '_blank')}
        >
          More
        </Button>
      )}
    </div>
  </div>
);

export default App;
