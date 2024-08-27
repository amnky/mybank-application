// src/context/AppContext.js
import React, { createContext, useState } from 'react';

// Create a context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [mobile,setMobile]=useState();
  const [email,setEmail]=useState("");
  const data={
    name,
    setName,
    mobile,
    setMobile,
    email,
    setEmail
  }

  return (
    <AppContext.Provider value={{ data }}>
      {children}
    </AppContext.Provider>
  );
};
