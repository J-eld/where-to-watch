"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";

interface CountrySelectProps {
  streamInfo: {
    country: string;
    countryISO: string;
    providers: { provider_name: string }[];
  }[];
}

const CountrySelect: React.FC<CountrySelectProps> = ({ streamInfo }) => {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUserLocation(data.country));
  }, []);

  const options = streamInfo.map((info) => ({
    value: info,
    label: (
      <span key={info.country}>
        {info.country}
        {info.providers.map((provider: any, index: number) => (
          <img
            key={index}
            src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
            alt={`${provider.provider_name} logo`}
          />
        ))}
      </span>
    ),
  }));

  const handleCountryChange = (selectedOption: any) => {
    setSelectedCountry(selectedOption.value);
  };

  const getDefaultValue = () => {
    if (!userLocation) return null;

    const userCountryStreamInfo = streamInfo.find(
      (info) => info.countryISO === userLocation
    );

    if (!userCountryStreamInfo) return null;

    return {
      value: userCountryStreamInfo,
      label: (
        <span>
          {userCountryStreamInfo.country}
          {userCountryStreamInfo.providers.map(
            (provider: any, index: number) => (
              <img
                key={index}
                src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                alt={`${provider.provider_name} logo`}
              />
            )
          )}
        </span>
      ),
    };
  };

  useEffect(() => {
    if (userLocation) {
      const defaultCountry = getDefaultValue();
      if (defaultCountry) {
        setSelectedCountry(defaultCountry.value);
      }
    }
  }, [userLocation]);

  const providers = selectedCountry ? selectedCountry.providers : null;

  return (
    <div>
      <Select
        options={options}
        value={
          selectedCountry
            ? {
                value: selectedCountry,
                label: (
                  <span>
                    {selectedCountry.country}
                    {selectedCountry.providers.map(
                      (provider: any, index: number) => (
                        <img
                          key={index}
                          src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                          alt={`${provider.provider_name} logo`}
                        />
                      )
                    )}
                  </span>
                ),
              }
            : null
        }
        onChange={handleCountryChange}
        placeholder="Select a country"
        className="font-sans dark:text-black text-lg child-img:w-8 child-span:flex child-span:gap-2 child-span:items-center child-span:flex-wrap"
      />
      {providers && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">
            Streaming Providers for {selectedCountry.country}
          </h2>
          <div className="flex flex-wrap gap-2">
            {providers.map(
              (provider: { provider_name: string; logo_path: string }) => (
                <div
                  key={provider.provider_name}
                  className="flex flex-col justify-center items-center text-center w-20"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                    alt={`${provider.provider_name} Logo`}
                  />
                  <div>{provider.provider_name}</div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
