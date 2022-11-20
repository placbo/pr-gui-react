import { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';

export const AuthContext = createContext<any>({} as any); //jukser (https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value)

export const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const authContextValue = { isUserLoggedIn, setIsUserLoggedIn };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};
