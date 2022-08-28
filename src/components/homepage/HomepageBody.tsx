/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "../Link";

interface searchResultProps {
  results: Array<object>;
}

export const HomepageBody: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<searchResultProps>({
    results: [],
  });

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${searchQuery}&include_adult=false`
      )
      .then((res) => {
        searchQuery
          ? setSearchResult(res.data)
          : setSearchResult({ results: [] });
      })
      .catch((err) => {
        setSearchResult({ results: [] });
        console.log(err);
      });
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col items-center justify-start mt-10">
      <div className="text-center text-6xl">Search</div>
      <div className="relative max-w-xs w-full">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-2 border-current text-2xl rounded-md w-full pl-12 py-2 font-sans"
        />
      </div>
      <div className="bg-white max-w-xs w-full max-h-96 overflow-auto drop-shadow-2xl">
        {searchResult &&
          searchResult?.results.map((result: any, index) => (
            <Link key={index} href={`/stream/${result.media_type}/${result.id}`}>
              <div
                onClick={() =>
                  result.media_type === "movie"
                    ? setSearchQuery(result.title)
                    : setSearchQuery(result.name)
                }
                key={index}
                className="flex items-center text-black cursor-pointer hover:bg-gray-200"
              >
                {result.media_type !== "person" &&
                  (result.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                      width={92 / 1.5}
                      height={138 / 1.5}
                      alt="movie image"
                    />
                  ) : (
                    <img
                      src={`/questionMark.png`}
                      width={92 / 1.5}
                      height={92 / 1.5}
                      alt="movie image"
                    />
                  ))}
                {result.media_type !== "person" && (
                  <span className="text-xl ml-2">
                    {result.media_type === "movie"
                      ? result.title
                      : result.name}
                  </span>
                )}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
