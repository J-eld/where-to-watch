import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/homepage/homepageBody.module.css";
import axios from "axios";
import Link from "next/link";

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
    <div className={styles.homepageBodyRoot}>
      <div className={styles.searchInputAndTitle}>
        <div className={styles.searchTitle}>Search</div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          className={styles.searchInput}
        />
        <div className={styles.searchAutocomplete}>
          {searchResult &&
            searchResult?.results
              ?.slice(0, 10)
              .map((result: any, index: number) => (
                <Link key={index} href={`/${result.media_type}/${result.id}`}>
                  <div
                    onClick={() =>
                      result.media_type === "movie"
                        ? setSearchQuery(result.title)
                        : setSearchQuery(result.name)
                    }
                    key={index}
                    className={styles.autocompleteResult}
                  >
                    {result.media_type !== "person" &&
                      (result.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                          width={92 / 1.5}
                          height={138 / 1.5}
                        />
                      ) : (
                        <img
                          src={`/questionMark.png`}
                          width={92 / 1.5}
                          height={92 / 1.5}
                        />
                      ))}
                    {result.media_type !== "person" && (
                      <span className={styles.resultTitle}>
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
    </div>
  );
};
