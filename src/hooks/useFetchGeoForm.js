import { useEffect, useState } from "react";
import { useUrlPosition } from "./useUrlPosition";
import { convertToEmoji } from "../components/Form";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function useFetchGeoForm() {
  const [mapLat, mapLng] = useUrlPosition();
  const [emoji, setEmoji] = useState("");
  const [geoError, setGeoError] = useState("");
  const [country, setCountry] = useState("");
  const [cityName, setCityName] = useState("");
  const [isLoadingGeoData, setIsLoadingGeoData] = useState(false);

  useEffect(
    function () {
      if (!mapLat && !mapLng) return;
      async function fetchCityData() {
        try {
          setIsLoadingGeoData(true);
          setGeoError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Try cliking somewhere else"
            );
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName || data.locality || "");
          setEmoji(convertToEmoji(data.countryCode));
          setIsLoadingGeoData(true);
        } catch (error) {
          setGeoError(error.message);
        } finally {
          setIsLoadingGeoData(false);
        }
      }
      fetchCityData();
    },
    [mapLat, mapLng]
  );
  return {
    emoji,
    geoError,
    country,
    isLoadingGeoData,
    cityName,
    setCityName,
    mapLat,
    mapLng,
  };
}
