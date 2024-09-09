import CountrySelect from "./CountrySelect";

export default async function Stream({ params }: any) {
  const { type, id } = params;
  const programInfo = await getProgramInfo(type, id);
  const streamInfo = await getStreamInfo(type, id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
        {programInfo.title || programInfo.name}
      </h1>
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {programInfo.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${programInfo.poster_path}`}
            alt={programInfo.title || programInfo.name}
            className="w-64 h-auto mb-4 md:mb-0 md:mr-4"
          />
        )}
        <div>
          <div className="mb-4">
            <CountrySelect streamInfo={streamInfo} />
          </div>
          <h2 className="text-xl font-bold">Overview</h2>
          <p className="text-center md:text-left">{programInfo.overview}</p>
        </div>
      </div>
    </div>
  );
}

export async function getProgramInfo(type: string, id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}`
  );

  const programInfo = await response.json();

  return programInfo;
}

export async function getStreamInfo(type: string, id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
  );

  const countries = await fetch(
    `https://api.themoviedb.org/3/watch/providers/regions?api_key=${process.env.TMDB_API_KEY}`
  );

  const countriesInfo = await countries.json();

  const streamInfo = await response.json();

  const results: {
    country: string;
    countryISO: string;
    providers: { provider_name: string }[];
  }[] = [];

  countriesInfo.results.forEach(
    (country: { iso_3166_1: string; english_name: string }) => {
      if (
        streamInfo.results[country.iso_3166_1]?.flatrate &&
        country.english_name
      ) {
        results.push({
          country: country.english_name,
          countryISO: country.iso_3166_1,
          providers: streamInfo.results[country.iso_3166_1].flatrate,
        });
      }
    }
  );

  // sort by name
  results.sort((a, b) => a.country.localeCompare(b.country));

  return results;
}
