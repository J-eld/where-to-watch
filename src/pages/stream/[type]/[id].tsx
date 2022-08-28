/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";

import { trpc } from "../../../utils/trpc";
import { Header } from '../../../components/Header';
import { ErrorCountryBlock, ErrorNotAvailable, ErrorNotAvailableInCountry} from '../../../components/Errors';

interface infoProps {
  title: string
  overview: string
  poster_path: string
  streams: object
  countries: object
}

export default function Stream() {
  const [streams, setStreams] = useState<any>({});
  const [contentInfo, setContentInfo] = useState<any>({});
  const [localCountry, setLocalCountry] = useState<string>("");
  const [countriesList, setCountriesList] = useState<any>({});
  const [getCountryBlocked, setGetCountryBlocked] = useState(false);

  const router = useRouter();
  const type = router.query.type as string;
  const allowedTypes = ['movie', 'tv']
  let info: infoProps = {
    title: '',
    overview: '',
    poster_path: '',
    streams: {},
    countries: {},
  };

  if (typeof type === 'string' && !allowedTypes.includes(type)) {
    router.push('/404');
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
        setGetCountryBlocked(true);
      });
  }, []);


  useEffect(() => {
    if (info.title) {
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

  return (
    <div className="mx-auto flex flex-col min-h-screen py-12 px-8 max-w-screen-xl">
        <Header />
        {contentInfo.title && (
          <div className="flex flex-col justify-center items-center md:items-start">
            <div className="py-8 text-4xl">{contentInfo.title}</div>
            <div className="flex flex-col gap-8 items-center max-w-xs md:flex-row md:max-w-none">
              <div>
                {contentInfo && (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${contentInfo.poster_path}`}
                    alt="movie image"
                    className="w-80"
                  />
                )}
              </div>
              <div className="flex flex-col justify-between gap-8 md:w-3/5">
                <div className="text-xl">
                  <div className="text-4xl mb-4">
                    Streaming Platforms
                  </div>
                  <div className="mb-2">
                    <span>Country: </span>
                    {((Object.keys(countriesList).length > 0 &&
                      localCountry.length > 0) ||
                      getCountryBlocked) && (
                      <Select
                        isSearchable={false}
                        defaultValue={
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
                    )}
                  </div>
                  <div className="flex flex-wrap gap-8">
                    {getCountryBlocked ? (
                      <ErrorCountryBlock />
                    ) : (
                      localCountry.length > 0 &&
                      (streams[localCountry]?.length > 0 ? (
                        streams[localCountry].map(
                          (platform: any, index: number) => (
                            <div
                              key={index}
                              className="flex flex-col justify-center items-center text-center w-20"
                            >
                              <img
                                src={`https://image.tmdb.org/t/p/w45${platform.logo_path}`}
                                alt={`${platform.provider_name} Logo`}
                              />
                              <div>
                                {platform.provider_name}
                              </div>
                            </div>
                          )
                        )
                      ) : Object.keys(countriesList).length > 0 ? (
                        <ErrorNotAvailableInCountry mediaType={type} />
                      ) : (
                        <ErrorNotAvailable mediaType={type} />
                      ))
                    )}
                  </div>
                </div>
                <div className="w-full max-w-screen-sm text-xl">
                  <div className="text-4xl">Overview</div>
                  <div className="font-sans">
                    {contentInfo.overview}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
