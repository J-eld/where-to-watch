import type { NextApiRequest, NextApiResponse } from "next";
const axios = require("axios");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const streams: any = {};
  const streamingProviders = await axios.get(
    `https://api.themoviedb.org/3/movie/${req.query.id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  for (const country in streamingProviders.data.results) {
    streams[country] = streamingProviders.data.results[country].flatrate;
  }

  const countries: any = {};
  const countriesList = await axios.get(
    `https://api.themoviedb.org/3/watch/providers/regions?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const countriesResults = countriesList.data.results;
  for (let i = 0; i < countriesResults.length; i++) {
    if (streams[countriesResults[i].iso_3166_1]) {
      countries[countriesResults[i].iso_3166_1] =
        countriesResults[i].english_name;
    }
  }

  const movieInfo: any = {};
  const movie = await axios.get(
    `https://api.themoviedb.org/3/movie/${req.query.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  movieInfo.title = movie.data.title;
  movieInfo.overview = movie.data.overview;
  movieInfo.poster_path = movie.data.poster_path;
  movieInfo.streams = streams;
  movieInfo.countries = countries;

  res.status(200).send(movieInfo);
};
