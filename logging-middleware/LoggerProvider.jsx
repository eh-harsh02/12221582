import { createContext, useContext } from "react";

const LoggerContext = createContext();

export const useLogger = () => useContext(LoggerContext);

const LoggerProvider = ({ children }) => {
  const log = (type, message) => {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    const logs = JSON.parse(localStorage.getItem("logStore") || "[]");
    logs.push(entry);
    localStorage.setItem("logStore", JSON.stringify(logs));
  };

  return (
    <LoggerContext.Provider value={{ log }}>
      {children}
    </LoggerContext.Provider>
  );
};

export default LoggerProvider;
