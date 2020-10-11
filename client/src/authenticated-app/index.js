import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';
import {AuthHome} from './home';
import {Profile} from './profile';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route exact path="/" element={<AuthHome />} />
      <Route exact path="/profile" element={<Profile />} />
    </Routes>
  );
};


export {AuthenticatedApp};


