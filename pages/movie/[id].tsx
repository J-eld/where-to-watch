import React, { useState, useEffect } from "react";
import styles from "/styles/movieSearch/movieSearch.module.css";
import { Header } from "../../components/Header";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import Select from "react-select";
import Link from "next/link";
import { ErrorCountryBlock } from "../../components/ErrorMessages/ErrorCountryBlock";
import { ErrorNotAvailableInCountry } from "../../components/ErrorMessages/ErrorNotAvailableInCountry";
import { ErrorNotAvailable } from "../../components/ErrorMessages/ErrorNotAvailable";

const Movie_id: React.FC = ({}) => {
  const [streams, setStreams] = useState<any>({});
  const [movieInfo, setMovieInfo] = useState<any>({});
  const [localCountry, setLocalCountry] = useState<string>("");
  const [countriesList, setCountriesList] = useState<any>({});
  const router = useRouter();
  const { id } = router.query;
  const [getCountryBlocked, setGetCountryBlocked] = useState(false);

  useEffect(() => {
    if (id !== undefined) {
      axios
        .get(`/api/search/movie/${router.query.id}`)
        .then((res) => {
          const info = res.data;
          setMovieInfo(info);
          setStreams(info.streams);
          setCountriesList(info.countries);
        })
        .catch((err) => console.error(err));

      axios
        .get("https://geolocation-db.com/json/")
        .then((res) => {
          setLocalCountry(res.data.country_code);
        })
        .catch((err) => {
          console.error(err);
          setGetCountryBlocked(true);
        });
    }
  }, [id]);

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
              />
            ))}
          </span>
        ),
      })
  );

  return (
    <div className={styles.movieSearchRoot}>
      <Container maxWidth="xl">
        <Header />
        <Link href="/">
          <div className={styles.backButton}>&#10229; Back</div>
        </Link>
        {movieInfo.title && (
          <div className={styles.movieSearchBody}>
            <div className={styles.movieTitle}>
              {movieInfo && movieInfo.title}
            </div>
            <div className={styles.movieInfo}>
              <div className={styles.movieImage}>
                {movieInfo && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${movieInfo.poster_path}`}
                    width={342}
                    height={513}
                  />
                )}
              </div>
              <div className={styles.streamingPlatformsAndMovieDescription}>
                <div className={styles.streamingPlatforms}>
                  <div className={styles.streamingPlatformsTitle}>
                    Streaming Platforms
                  </div>
                  <div className={styles.countryList}>
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
                        className={styles.reactSelectContainer}
                        classNamePrefix={styles.reactSelect}
                        placeholder="Select country"
                      />
                    )}
                  </div>
                  <div className={styles.streamingPlatformsList}>
                    {getCountryBlocked ? (
                      <ErrorCountryBlock />
                    ) : (
                      localCountry.length > 0 &&
                      (streams[localCountry]?.length > 0 ? (
                        streams[localCountry].map(
                          (platform: any, index: number) => (
                            <div
                              key={index}
                              className={styles.streamingPlatform}
                            >
                              <img
                                src={`https://image.tmdb.org/t/p/w45${platform.logo_path}`}
                              />
                              <div className={styles.streamingPlatformName}>
                                {platform.provider_name}
                              </div>
                            </div>
                          )
                        )
                      ) : Object.keys(countriesList).length > 0 ? (
                        <ErrorNotAvailableInCountry mediaType="movie" />
                      ) : (
                        <ErrorNotAvailable mediaType="movie" />
                      ))
                    )}
                  </div>
                </div>
                <div className={styles.movieDescription}>
                  <div className={styles.overviewTitle}>Overview</div>
                  {movieInfo && movieInfo.overview}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Movie_id;
