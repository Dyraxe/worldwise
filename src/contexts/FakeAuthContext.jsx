import { createContext, useContext, useReducer } from "react";

const authContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { state, user: null, isAuthenticated: false };

    default:
      throw new Error("Unknown Action");
  }
}
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
function AuthProvider({ children }) {
  const [{ user, isAuth }, dispatch] = useReducer(reducer, initialState);
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    } else {
      alert("Incorrect email or password");
    }
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <authContext.Provider value={{ login, logout, user, isAuth }}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  const context = useContext(authContext);
  if (context === undefined)
    throw new Error("Context used outside of Provider");
  return context;
}
export { AuthProvider, useAuth };
