export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";

  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}&include_adult=false`
  );

  const movieResults = await response.json();

  // Filter out objects with media_type "person"
  const filteredResults = movieResults.results.filter(
    (result: any) => result.media_type !== "person"
  );

  // Return pagination relevant data along with filtered results
  return new Response(
    JSON.stringify({
      page: movieResults.page,
      total_pages: movieResults.total_pages,
      total_results: movieResults.total_results,
      results: filteredResults,
    })
  );
}
