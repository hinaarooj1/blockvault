import { useContext, createContext } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storeTokenInLs = (serverToken) => {
    return localStorage.setItem("token", serverToken);
  };
  return (
    <AuthContext.Provider value={{ storeTokenInLs }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    return new Error("useAuth used outside the provider");
  }
  return authContextValue;
};
