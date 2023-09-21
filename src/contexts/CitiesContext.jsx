/* eslint-disable react/prop-types */
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "cities/loaded":
      return { ...state, loading: false, cities: action.payload };
    case "city/loaded":
      console.log(state);
      return { ...state, loading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        loading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        loading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      console.log(action.payload);
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("unknown action");
  }
}
function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "rejected", payload: e.message });
      }
    }
    fetchCities();
  }, []);
  async function getCity(id) {
    // the state wont get updated thus retuning the previous one
    if (Number(id) === currentCity.id) return;
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (e) {
      dispatch({ type: "rejected", payload: e.message });
    }
  }
  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (e) {
      dispatch({ type: "rejected", payload: e.message });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cities/deleted", payload: id });
    } catch (e) {
      dispatch({ type: "rejected", payload: e.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of CitiesProvider");
  return context;
}
export { CitiesProvider, useCities };
