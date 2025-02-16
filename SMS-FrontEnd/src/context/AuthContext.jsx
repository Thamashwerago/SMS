import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { login } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Handle login
  const loginUser = async (credentials) => {
    try {
      const { data } = await login(credentials);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data)); // Store user in localStorage
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Handle logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user from storage
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
