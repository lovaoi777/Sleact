import React from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const WorkSpace = loadable(() => import('@layouts/Workspace/Workspace'));
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/:workspace/*" element={<WorkSpace />} />
      </Routes>
    </div>
  );
};

export default App;
