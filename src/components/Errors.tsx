import React from "react";

export const ErrorCountryBlock: React.FC = ({}) => {
  return (
    <div className="font-sans">
      Something is blocking us from being able to get your current country,
      please feel free to browse the list of available countries above, or
      disable any adblockers for the best experience
    </div>
  );
};

export const ErrorNotAvailable: React.FC<{ mediaType: string }> = ({
  mediaType,
}) => {
  return (
    <div className="font-sans">
      This {mediaType === "movie" ? "Movie" : "Show"} is not available to stream
      in any country :(
    </div>
  );
};

export const ErrorNotAvailableInCountry: React.FC<{ mediaType: string }> = ({
  mediaType,
}) => {
  return (
    <div className="font-sans">
      This {mediaType === "movie" ? "Movie" : "Show"} is not available to stream
      in your country :(. Select a country from the above list to show
      availabilities elsewhere.
    </div>
  );
};
