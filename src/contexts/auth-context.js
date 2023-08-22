import { createContext, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  let initialState;
  if (typeof sessionStorage !== "undefined") {
    initialState = {
      user: JSON.parse(sessionStorage.getItem("user")),
      token: sessionStorage.getItem("token"),
      isAuthinticate: sessionStorage.getItem("authenticated"),
      isLoading: false,
    };
  } else {
    initialState = {
      user: "",
      token: "",
      isAuthinticate: false,
      isLoading: false,
    };
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_START":
        return {
          ...state,
          isLoading: true,
        };
      case "LOGIN_SUCCESS":
        const { user, token } = action.payload;
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("authenticated", "true");
          sessionStorage.setItem("user", JSON.stringify(user));
          sessionStorage.setItem("token", token);
        }
        return {
          ...state,
          isAuthinticate: true,
          user,
          token,
          isLoading: false,
        };
      case "LOGIN_FAILUR":
        return {
          ...state,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...state,
          isLoading: false,
          isAuthinticate: false,
        };
      default:
        return state;
    }
  };

  const login = async (phone, password) => {
    dispatch({ type: "LOGIN_START" });
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}Admin_login`, {
        phone,
        password,
      });
      // console.log(response.data);
      if (response.data.status) {
        const { user, token } = response.data;
  
        dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
        router.push("/");
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  AuthProvider.propTypes = {
    children: PropTypes.node,
  };

  const [stateData, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{ stateData, dispatch, login }}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
export const AuthConsumer = AuthContext.Consumer;