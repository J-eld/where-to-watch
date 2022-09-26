/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";

import { trpc } from "../../../utils/trpc";
import { Header } from "../../../components/Header";
import {
  ErrorCountryBlock,
  ErrorNotAvailable,
  ErrorNotAvailableInCountry,
} from "../../../components/Errors";

interface infoProps {
  title: string;
  overview: string;
  poster_path: string;
  streams: object;
  countries: object;
}

export default function Stream() {
  const [streams, setStreams] = useState<any>({});
  const [contentInfo, setContentInfo] = useState<any>({});
  const [localCountry, setLocalCountry] = useState<string>("");
  const [countriesList, setCountriesList] = useState<any>({});
  const [isCountryBlocked, setIsCountryBlocked] = useState(false);

  const router = useRouter();
  const type = router.query.type as string;
  const allowedTypes = ["movie", "tv"];
  let info: infoProps = {
    title: "",
    overview: "",
    poster_path: "",
    streams: {},
    countries: {},
  };

  if (typeof type === "string" && !allowedTypes.includes(type)) {
    router.push("/404");
  }

  if (router && router.query) {
    info = trpc.useQuery(["stream.getInfo", { ...router.query }]).data;
  }

  useEffect(() => {
    axios
      .get("https://geolocation-db.com/json/")
      .then((res) => {
        setLocalCountry(res.data.country_code);
      })
      .catch((err) => {
        console.error(err);
        setIsCountryBlocked(true);
      });
  }, []);

  useEffect(() => {
    if (info?.title) {
      setContentInfo(info);
      setStreams(info.streams);
      setCountriesList(info.countries);
    }
  }, [info]);

  const changeCountry = (e: any) => {
    setLocalCountry(e.value);
  };

  const options = Object.keys(countriesList).map(
    (country: any, index: number) =>
      new Object({
        value: country,
        label: (
          <span key={index}>
            {countriesList[country]}
            {streams[country].map((platform: any, index: number) => (
              <img
                key={index}
                src={`https://image.tmdb.org/t/p/w45${platform.logo_path}`}
                alt={`${platform.provider_name} logo`}
              />
            ))}
          </span>
        ),
      })
  );

  const getError = () => {
    if (!contentInfo.title) return;

    if (Object.keys(countriesList).length === 0) {
      return (
        <ErrorNotAvailable mediaType={type} />
      );
    }
    
    if (isCountryBlocked) {
      return (
        <ErrorCountryBlock />
      );
    }

    if (!streams[localCountry] || streams[localCountry].length === 0) {
      return (
        <ErrorNotAvailableInCountry mediaType={type} />
      );
    }
  };

  return (
    <div className="mx-auto flex flex-col min-h-screen py-12 px-8 max-w-screen-xl">
      <Header />
      <div className="flex flex-col justify-center items-center md:items-start">
        <div className="py-8 text-4xl">{contentInfo.title}</div>
        <div className="flex flex-col gap-8 items-center max-w-xs md:flex-row md:max-w-none">
          <div>
            {contentInfo.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${contentInfo.poster_path}`}
                alt="movie image"
                className="w-80"
              />
            ) : (
              <div
                role="status"
                className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
              >
                <div className="flex justify-center items-center w-80 h-96 bg-gray-300 rounded sm:w-80 dark:bg-gray-700">
                  <svg
                    className="w-20 h-20 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                  >
                    <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                  </svg>
                </div>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between gap-8 md:w-3/5">
            <div className="text-xl">
              <div className="text-4xl mb-4">Streaming Platforms</div>
              <div className="mb-2">
                <span>Country: </span>
                <Select
                  isSearchable={false}
                  value={
                    countriesList[localCountry] &&
                    new Object({
                      value: localCountry,
                      label: countriesList[localCountry],
                    })
                  }
                  onChange={changeCountry}
                  options={options}
                  className="font-sans dark:text-black text-lg child-img:w-8 child-span:flex child-span:gap-2 child-span:items-center child-span:flex-wrap"
                  placeholder="Select country"
                />
              </div>
              <div className="flex flex-wrap gap-8">
                {streams[localCountry]?.map(
                  (platform: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col justify-center items-center text-center w-20"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w45${platform.logo_path}`}
                        alt={`${platform.provider_name} Logo`}
                      />
                      <div>{platform.provider_name}</div>
                    </div>
                  )
                )}
                {getError()}
              </div>
            </div>
            <div className="w-full max-w-screen-sm text-xl">
              <div className="text-4xl">Overview</div>
              {contentInfo.overview ? (
                <div className="font-sans">{contentInfo.overview}</div>
              ) : (
                <div className="animate-pulse mt-4">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
