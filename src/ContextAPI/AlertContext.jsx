import React, { createContext, useReducer, useContext, useState } from "react";

const AlertContext = createContext();

const useALert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("Error creating useAlert");

  return context;
};

const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    active: false,
    type: "fail",
    message: "Something went wrong!",
  });

  const showAlert = (type, message) =>
    setAlertState({ active: true, type: type, message: message });
  const closeAlert = () => setAlertState({ ...alertState, active: false });

  return (
    <AlertContext.Provider value={{ alertState, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export { useALert, AlertProvider };
