// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css";

import { useState } from "react";
import { useFetchGeoForm } from "../hooks/useFetchGeoForm";
import DatePicker from "react-datepicker";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [date, setDate] = useState(new Date());
  const { createCity, isLoading } = useCities();
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const {
    mapLat,
    mapLng,
    emoji,
    geoError,
    country,
    isLoadingGeoData,
    cityName,
    setCityName,
  } = useFetchGeoForm();

  //use
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: mapLat, lng: mapLng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingGeoData)
    return (
      <>
        <Spinner />
      </>
    );

  if (!mapLat && !mapLng)
    return <Message message="Start by cliking somewhere in the map" />;

  if (geoError) return <Message message={geoError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          dateFormat="dd/MM/yyyy"
          selected={date}
          onChange={(date) => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
