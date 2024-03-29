import { createRouter } from "./context";
import { z } from "zod";
import axios from "axios";

export const streamRouter = createRouter()
  .query("getInfo", {
    input: z
      .object({
        type: z.enum(['movie', 'tv']).nullish(),
        id: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input }) {
      const streams: any = {};
      const streamingProviders = await axios.get(
        `https://api.themoviedb.org/3/${input?.type}/${input?.id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
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

      const contentInfo: any = {};
      const content = await axios.get(
        `https://api.themoviedb.org/3/${input?.type}/${input?.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      contentInfo.title = content.data.title || content.data.name;
      contentInfo.overview = content.data.overview;
      contentInfo.poster_path = content.data.poster_path;
      contentInfo.streams = streams;
      contentInfo.countries = countries;

      return contentInfo;
    },
  });
