import React from "react";

export const ErrorNotAvailableInCountry: React.FC<{ mediaType: string }> = ({
  mediaType,
}) => {
  return (
    <div>
      This {mediaType === "movie" ? "Movie" : "Show"} is not available to stream
      in your country :(. Select a country from the above list to show
      availabilities elsewhere.
    </div>
  );
};
