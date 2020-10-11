import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';
import {Landing} from './home';
import Signup from '../screens/Signup';
import Login from '../screens/Login';

const UnauthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export {UnauthenticatedApp};
