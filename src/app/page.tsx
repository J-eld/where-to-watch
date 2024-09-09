"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { debounce } from "lodash";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface FetchSearchResultsParams {
  queryKey: [string, string];
  pageParam?: number;
}

const fetchSearchResults = async ({
  queryKey,
  pageParam = 1,
}: FetchSearchResultsParams) => {
  const query = queryKey[1];
  const response = await fetch(`/api/search?query=${query}&page=${pageParam}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize the debounce function
  const debouncedSearchHandler = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 300),
    []
  );

  // Handle search input and debounce update
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      debouncedSearchHandler(e.target.value);
      setShowDropdown(true);
      setActiveOptionIndex(-1);
      if (e.target.value.length > 0) {
        history.pushState(null, "", `?query=${e.target.value}`);
      } else {
        history.pushState(null, "", "/");
      }
    },
    [debouncedSearchHandler]
  );

  // Handle key down events for navigation and selection
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveOptionIndex((prevIndex) =>
        prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveOptionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter" && activeOptionIndex >= 0) {
      e.preventDefault();
      handleResultClick(results[activeOptionIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Cleanup debounce function on component unmount
  useEffect(() => {
    return () => {
      debouncedSearchHandler.cancel();
    };
  }, [debouncedSearchHandler]);

  // Use the debounced search term to query the API with infinite scroll
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["searchResults", debouncedSearch] as [string, string],
    queryFn: ({ queryKey, pageParam = 1 }) =>
      fetchSearchResults({ queryKey, pageParam }),
    enabled: debouncedSearch.length > 0, // Only run the query if there is a search term
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observing = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        !observing.current
      ) {
        observing.current = true;
        fetchNextPage().then(() => {
          observing.current = false;
        });
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleResultClick = (result: any) => {
    setSearch(result.title || result.name);
    setDebouncedSearch(result.title || result.name);
    setShowDropdown(false);
    setTimeout(() => {
      debouncedSearchHandler.cancel();
    }, 0);

    router.push(`/stream/${result.media_type}/${result.id}`);
  };

  const results = data?.pages.flatMap((page) => page.results) || [];

  return (
    <main className="flex min-h-screen flex-col items-center py-24 px-4 w-full">
      <div className="w-full max-w-5xl font-mono text-sm">
        <div className="relative w-full max-w-lg mt-12 mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Search for a movie or TV show..."
          />
          {showDropdown && results.length > 0 && (
            <div className="relative w-full max-w-lg h-96 overflow-auto">
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                {results.map((result: any, index: number) => (
                  <li
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`p-2 flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      activeOptionIndex === index
                        ? "bg-gray-200 dark:bg-gray-700"
                        : ""
                    }`}
                  >
                    {result.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                        alt={result.title || result.name}
                        className="w-14 h-18 mr-2"
                      />
                    )}
                    <span>
                      ({dayjs(result.release_date).format("YYYY")}) -{" "}
                      {result.title || result.name}
                    </span>
                  </li>
                ))}
                <div ref={observerRef} className="h-4"></div>{" "}
                {/* Dynamic content loader */}
              </ul>
            </div>
          )}
        </div>
        {error && <p>Error fetching data</p>}
      </div>
    </main>
  );
}
